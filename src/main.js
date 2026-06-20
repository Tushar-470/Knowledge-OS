const SECRET_NUMBER = 10;
const state = {
  vault: null,
  activeFolder: null,
  urls: new Map()
};

const el = {
  form: document.querySelector("#unlock-form"),
  password: document.querySelector("#password"),
  status: document.querySelector("#status"),
  lock: document.querySelector("#lock"),
  vault: document.querySelector("#vault"),
  folderGrid: document.querySelector("#folder-grid"),
  fileSection: document.querySelector("#file-section"),
  fileGrid: document.querySelector("#file-grid"),
  folderTitle: document.querySelector("#folder-title"),
  closeFolder: document.querySelector("#close-folder"),
  search: document.querySelector("#search"),
  preview: document.querySelector("#preview"),
  previewTitle: document.querySelector("#preview-title"),
  previewBody: document.querySelector("#preview-body"),
  download: document.querySelector("#download-link"),
  closePreview: document.querySelector("#close-preview")
};

function todaySession() {
  const now = new Date();
  const dd = now.getDate();
  const mm = now.getMonth() + 1;
  const yy = now.getFullYear() % 100;
  const password = String(dd + mm + SECRET_NUMBER).padStart(4, "0");
  const seed = (dd * mm * SECRET_NUMBER * yy) % 1000000;
  return {
    password,
    seed,
    hue: seed % 360,
    accent: (seed + 142) % 360,
    count: (seed % 50) + 30,
    style: seed % 6
  };
}

const session = todaySession();
document.documentElement.style.setProperty("--hue", session.hue);
document.documentElement.style.setProperty("--accent", session.accent);

function base64ToBytes(base64) {
  const binary = atob(base64);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

function bytesToText(bytes) {
  return new TextDecoder().decode(bytes);
}

async function deriveKey(secret, salt, iterations) {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(String(secret)),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: new TextEncoder().encode(salt), iterations, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
}

async function decryptVault(secret) {
  const encrypted = await fetch("./vault-data.json", { cache: "no-store" }).then(r => r.json());
  const key = await deriveKey(secret, encrypted.kdf.salt, encrypted.kdf.iterations);
  const iv = base64ToBytes(encrypted.cipher.iv);
  const tag = base64ToBytes(encrypted.cipher.tag);
  const data = base64ToBytes(encrypted.data);
  const combined = new Uint8Array(data.length + tag.length);
  combined.set(data);
  combined.set(tag, data.length);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, combined);
  return JSON.parse(bytesToText(new Uint8Array(plain)));
}

function folderLetters(folderName) {
  const now = new Date();
  const dd = now.getDate();
  const mm = now.getMonth() + 1;
  const base = [...folderName].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const letters = [];
  for (let index = 0; index < 4; index += 1) {
    letters.push(String.fromCharCode(65 + ((base + dd + mm + SECRET_NUMBER + index * 7) % 26)));
  }
  const shuffled = [...letters].sort((a, b) => ((a.charCodeAt(0) * session.seed) % 7) - ((b.charCodeAt(0) * session.seed) % 7));
  return { display: shuffled, correct: [...letters].sort().at(-1) };
}

function formatSize(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function renderFolders() {
  const query = el.search.value.trim().toLowerCase();
  const matchingFiles = query
    ? state.vault.files.filter(file => `${file.name} ${file.path}`.toLowerCase().includes(query))
    : state.vault.files;
  const folders = state.vault.folders
    .map(folder => ({ ...folder, count: matchingFiles.filter(file => file.folder === folder.name).length }))
    .filter(folder => folder.count > 0);

  el.folderGrid.innerHTML = "";
  for (const [index, folder] of folders.entries()) {
    const lock = folderLetters(folder.name);
    const card = document.createElement("article");
    card.className = "folder-card";
    card.style.animationDelay = `${Math.min(index * 35, 420)}ms`;
    card.innerHTML = `
      <div class="folder-icon" aria-hidden="true"></div>
      <h3>${escapeHtml(folder.name)}</h3>
      <p class="meta">${folder.count} file${folder.count === 1 ? "" : "s"}</p>
      <div class="letter-row" aria-label="Folder letter lock"></div>
    `;
    const row = card.querySelector(".letter-row");
    for (const letter of lock.display) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = letter;
      button.addEventListener("click", () => {
        if (letter === lock.correct) {
          button.classList.add("correct");
          openFolder(folder.name);
        } else {
          card.classList.remove("shake");
          requestAnimationFrame(() => card.classList.add("shake"));
        }
      });
      row.append(button);
    }
    el.folderGrid.append(card);
  }
}

function openFolder(folderName) {
  state.activeFolder = folderName;
  el.folderTitle.textContent = folderName;
  el.fileSection.classList.remove("hidden");
  renderFiles();
  el.fileSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderFiles() {
  const query = el.search.value.trim().toLowerCase();
  const files = state.vault.files.filter(file => {
    if (file.folder !== state.activeFolder) return false;
    return !query || `${file.name} ${file.path}`.toLowerCase().includes(query);
  });
  el.fileGrid.innerHTML = "";
  for (const file of files) {
    const card = document.createElement("article");
    card.className = "file-card";
    card.tabIndex = 0;
    card.innerHTML = `
      <p class="eyebrow">${escapeHtml(file.ext.replace(".", "") || "file")}</p>
      <h4>${escapeHtml(file.name)}</h4>
      <p class="meta">${formatSize(file.size)}</p>
    `;
    card.addEventListener("click", () => previewFile(file));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter") previewFile(file);
    });
    el.fileGrid.append(card);
  }
}

function fileUrl(file) {
  if (state.urls.has(file.id)) return state.urls.get(file.id);
  const bytes = base64ToBytes(file.content);
  const url = URL.createObjectURL(new Blob([bytes], { type: file.mime }));
  state.urls.set(file.id, url);
  return url;
}

function previewFile(file) {
  const url = fileUrl(file);
  el.previewTitle.textContent = file.name;
  el.download.href = url;
  el.download.download = file.name;
  el.previewBody.innerHTML = "";
  if (file.mime.startsWith("text/") || file.ext === ".md") {
    const pre = document.createElement("pre");
    pre.textContent = bytesToText(base64ToBytes(file.content));
    el.previewBody.append(pre);
  } else if (file.mime.startsWith("image/")) {
    const img = document.createElement("img");
    img.src = url;
    img.alt = file.name;
    el.previewBody.append(img);
  } else if (file.ext === ".pdf") {
    const frame = document.createElement("iframe");
    frame.src = url;
    frame.title = file.name;
    el.previewBody.append(frame);
  } else {
    const p = document.createElement("p");
    p.textContent = "Preview is not available for this file type. Use Download.";
    el.previewBody.append(p);
  }
  el.preview.showModal();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[char]);
}

let wrongAttempts = 0;
el.form.addEventListener("submit", async event => {
  event.preventDefault();
  const entered = el.password.value.trim();
  const numeric = Number.parseInt(entered, 10);
  const secret = numeric - new Date().getDate() - (new Date().getMonth() + 1);
  if (entered !== session.password) {
    wrongAttempts += 1;
    el.status.textContent = wrongAttempts >= 4 ? "Service temporarily unavailable. Refresh to try again." : "Incorrect code.";
    el.form.classList.remove("shake");
    requestAnimationFrame(() => el.form.classList.add("shake"));
    return;
  }
  el.status.textContent = "Decrypting vault...";
  try {
    state.vault = await decryptVault(secret);
    el.status.textContent = "";
    el.lock.classList.add("hidden");
    el.vault.classList.remove("hidden");
    renderFolders();
  } catch {
    el.status.textContent = "Vault could not be decrypted.";
  }
});

el.search.addEventListener("input", () => {
  renderFolders();
  if (state.activeFolder) renderFiles();
});

el.closeFolder.addEventListener("click", () => {
  state.activeFolder = null;
  el.fileSection.classList.add("hidden");
});

el.closePreview.addEventListener("click", () => el.preview.close());

function startCanvas() {
  const canvas = document.querySelector("#field");
  const ctx = canvas.getContext("2d");
  const particles = [];
  let width = 0;
  let height = 0;
  const pointer = { x: 0, y: 0, active: false };

  function resize() {
    width = canvas.width = window.innerWidth * devicePixelRatio;
    height = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }

  function reset() {
    particles.length = 0;
    for (let i = 0; i < session.count; i += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (0.35 + (session.seed % 8) / 10),
        vy: (Math.random() - 0.5) * (0.35 + (session.seed % 8) / 10),
        r: 1.2 + Math.random() * 2.8
      });
    }
  }

  function frame() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = `hsla(${session.hue}, 90%, 70%, 0.62)`;
    ctx.strokeStyle = `hsla(${session.accent}, 90%, 62%, 0.16)`;
    for (const p of particles) {
      if (pointer.active) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d = Math.hypot(dx, dy);
        if (d < 150 * devicePixelRatio) {
          p.vx += dx / Math.max(d, 1) * 0.02;
          p.vy += dy / Math.max(d, 1) * 0.02;
        }
      }
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i];
        const b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130 * devicePixelRatio) {
          ctx.globalAlpha = 1 - d / (130 * devicePixelRatio);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", () => { resize(); reset(); });
  window.addEventListener("pointermove", event => {
    pointer.x = event.clientX * devicePixelRatio;
    pointer.y = event.clientY * devicePixelRatio;
    pointer.active = true;
  });
  window.addEventListener("pointerleave", () => { pointer.active = false; });
  resize();
  reset();
  frame();
}

startCanvas();
