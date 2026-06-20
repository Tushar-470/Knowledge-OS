const SECRET_NUMBER = 11;
const state = {
  vault: null,
  activeFolder: null,
  isGuest: false,
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
  closePreview: document.querySelector("#close-preview"),
  
  guestBtn: document.querySelector("#guest-btn"),
  lockVaultBtn: document.querySelector("#lock-vault-btn"),
  vaultMode: document.querySelector("#vault-mode")
};

function todaySession() {
  const now = new Date();
  const dd = now.getDate();
  const mm = now.getMonth() + 1;
  const yy = now.getFullYear() % 100;
  
  // Daily access password
  const password = String(dd + mm + SECRET_NUMBER).padStart(4, "0");
  
  // Visit-based seed (changes every visit/load)
  const visitSeed = Math.floor(Math.random() * 1000000);
  
  return {
    password,
    visitSeed,
    hue: visitSeed % 360,
    accent: (visitSeed + 142) % 360,
    count: (visitSeed % 40) + 30,
    style: visitSeed % 4
  };
}

const session = todaySession();
const visitSeed = session.visitSeed;

// Set root custom variables and dynamic classes
document.documentElement.style.setProperty("--hue", session.hue);
document.documentElement.style.setProperty("--accent", session.accent);
document.body.classList.add(`theme-${session.style}`);
document.body.classList.add(`layout-${session.style}`);

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
  let seed = 0;
  const combinedStr = folderName + visitSeed;
  for (let i = 0; i < combinedStr.length; i++) {
    seed = (seed << 5) - seed + combinedStr.charCodeAt(i);
    seed |= 0;
  }
  
  function random() {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }
  
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const chosen = [];
  const available = alphabet.split("");
  for (let i = 0; i < 5; i++) {
    const idx = Math.floor(random() * available.length);
    chosen.push(available.splice(idx, 1)[0]);
  }
  
  const correct = [...chosen].sort().at(-1);
  const shuffled = [];
  while (chosen.length > 0) {
    const idx = Math.floor(random() * chosen.length);
    shuffled.push(chosen.splice(idx, 1)[0]);
  }
  return { display: shuffled, correct };
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
  
  if (folders.length === 0) {
    el.folderGrid.innerHTML = `<p class="meta" style="grid-column: 1/-1; text-align: center; padding: 2rem;">No matching folders found.</p>`;
    return;
  }

  for (const [index, folder] of folders.entries()) {
    const card = document.createElement("article");
    card.className = "folder-card";
    card.style.animationDelay = `${Math.min(index * 35, 420)}ms`;
    
    if (state.isGuest) {
      // Guest Mode: direct click opens folder, no letter lock
      card.style.cursor = "pointer";
      card.innerHTML = `
        <div class="folder-icon" aria-hidden="true"></div>
        <h3>${escapeHtml(folder.name)}</h3>
        <p class="meta">${folder.count} file${folder.count === 1 ? "" : "s"}</p>
        <p class="meta" style="font-size: 0.8rem; border: 1px dashed var(--panel-border); padding: 0.35rem; text-align: center; border-radius: 6px; color: var(--muted); margin-top: 1rem;">Click to Open</p>
      `;
      card.addEventListener("click", () => openFolder(folder.name));
    } else {
      // Private Mode: requires letter lock
      const lock = folderLetters(folder.name);
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
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          if (letter === lock.correct) {
            button.classList.add("correct");
            // Disable row immediately so they can't double tap
            row.querySelectorAll("button").forEach(btn => btn.disabled = true);
            setTimeout(() => openFolder(folder.name), 250);
          } else {
            button.classList.add("wrong");
            card.classList.remove("shake");
            requestAnimationFrame(() => card.classList.add("shake"));
            row.querySelectorAll("button").forEach(btn => btn.disabled = true);
            
            // Show lockout glitch overlay
            const glitchOverlay = document.querySelector("#glitch-overlay");
            glitchOverlay.classList.remove("hidden");
            
            setTimeout(() => {
              glitchOverlay.classList.add("hidden");
              lockVault("Intrusion detected. Vault locked.");
            }, 1000);
          }
        });
        row.append(button);
      }
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
  
  if (files.length === 0) {
    el.fileGrid.innerHTML = `<p class="meta" style="grid-column: 1/-1; text-align: center; padding: 2rem;">No matching files found.</p>`;
    return;
  }
  
  for (const [index, file] of files.entries()) {
    const card = document.createElement("article");
    card.className = "file-card";
    card.tabIndex = 0;
    card.style.animationDelay = `${Math.min(index * 30, 350)}ms`;
    card.innerHTML = `
      <p class="eyebrow file-type">${escapeHtml(file.ext.replace(".", "") || "file")}</p>
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

function lockVault(message = "") {
  state.vault = null;
  state.activeFolder = null;
  state.isGuest = false;
  el.password.value = "";
  el.status.textContent = message;
  el.lock.classList.remove("hidden");
  el.vault.classList.add("hidden");
  el.fileSection.classList.add("hidden");
  el.search.value = "";
  
  for (const url of state.urls.values()) {
    URL.revokeObjectURL(url);
  }
  state.urls.clear();
}

// Private Decrypt Submit
let wrongAttempts = 0;
el.form.addEventListener("submit", async event => {
  event.preventDefault();
  const entered = el.password.value.trim();
  const numeric = Number.parseInt(entered, 10);
  const secret = numeric - new Date().getDate() - (new Date().getMonth() + 1);
  
  if (entered !== session.password) {
    wrongAttempts += 1;
    el.status.textContent = wrongAttempts >= 4 ? "Access denied. Temporary lockout active." : "Incorrect passcode.";
    el.form.classList.remove("shake");
    requestAnimationFrame(() => el.form.classList.add("shake"));
    return;
  }
  
  el.status.textContent = "Deriving key...";
  try {
    const decrypted = await decryptVault(secret);
    el.status.textContent = "";
    state.vault = decrypted;
    state.isGuest = false;
    el.vaultMode.textContent = "Private Portal (Unlocked)";
    
    // Play Decrypt HUD overlay
    const scannerOverlay = document.querySelector("#scanner-overlay");
    const progressEl = scannerOverlay.querySelector(".scanner-progress");
    scannerOverlay.classList.remove("hidden");
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          scannerOverlay.classList.add("hidden");
          el.lock.classList.add("hidden");
          el.vault.classList.remove("hidden");
          renderFolders();
        }, 400);
      }
      progressEl.textContent = `${progress}%`;
    }, 70);
    
  } catch (error) {
    console.error(error);
    el.status.textContent = "Decryption failure. Invalid secret key.";
  }
});

// Guest Mode Toggle
el.guestBtn.addEventListener("click", async () => {
  el.status.textContent = "Loading public records...";
  try {
    const data = await fetch("./public-data.json", { cache: "no-store" }).then(r => r.json());
    el.status.textContent = "";
    state.vault = data;
    state.isGuest = true;
    el.vaultMode.textContent = "Guest Access (Public Notes)";
    el.lock.classList.add("hidden");
    el.vault.classList.remove("hidden");
    renderFolders();
  } catch (error) {
    console.error(error);
    el.status.textContent = "Failed to load public data.";
  }
});

// Lock Button Click
el.lockVaultBtn.addEventListener("click", () => {
  lockVault("System locked securely.");
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

// Canvas Animations
function startCanvas() {
  const canvas = document.querySelector("#field");
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  const pointer = { x: 0, y: 0, active: false };

  function resize() {
    width = canvas.width = window.innerWidth * devicePixelRatio;
    height = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", event => {
    pointer.x = event.clientX * devicePixelRatio;
    pointer.y = event.clientY * devicePixelRatio;
    pointer.active = true;
  });
  window.addEventListener("pointerleave", () => { pointer.active = false; });
  
  resize();

  const style = session.style; // 0 to 3
  
  if (style === 0) {
    // Style 0: Cyber Neon network
    const particles = [];
    const count = session.count;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        r: 1.5 + Math.random() * 2
      });
    }

    function frame() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = `hsla(${session.hue}, 90%, 70%, 0.6)`;
      ctx.strokeStyle = `hsla(${session.accent}, 90%, 60%, 0.15)`;
      
      for (const p of particles) {
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < 150 * devicePixelRatio) {
            p.vx += (dx / Math.max(d, 1)) * 0.05;
            p.vy += (dy / Math.max(d, 1)) * 0.05;
          }
        }
        
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.vx += (Math.random() - 0.5) * 0.1;
        p.vy += (Math.random() - 0.5) * 0.1;
        
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
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
    frame();
    
  } else if (style === 1) {
    // Style 1: Matrix Digital Rain
    const fontSize = 14 * devicePixelRatio;
    ctx.font = `bold ${fontSize}px monospace`;
    const columns = Math.floor(width / fontSize) + 1;
    const drops = Array(columns).fill(1);
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@%&*+-/<>".split("");

    function frame() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, width, height);
      
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        if (Math.random() > 0.985) {
          ctx.fillStyle = "#ffffff";
        } else {
          ctx.fillStyle = "#00ff41";
        }
        
        ctx.fillText(text, x, y);
        
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      
      if (pointer.active) {
        ctx.fillStyle = "rgba(0, 255, 65, 0.15)";
        ctx.fillRect(Math.floor(pointer.x / fontSize) * fontSize, Math.floor(pointer.y / fontSize) * fontSize, fontSize, fontSize);
      }
      
      setTimeout(() => requestAnimationFrame(frame), 33);
    }
    frame();
    
  } else if (style === 2) {
    // Style 2: Cosmic Nebula blobs
    const blobs = [];
    const blobCount = 4;
    for (let i = 0; i < blobCount; i++) {
      blobs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        r: 150 + Math.random() * 150,
        hue: (session.hue + i * 30) % 360
      });
    }

    function frame() {
      ctx.fillStyle = "rgba(6, 2, 18, 0.15)";
      ctx.fillRect(0, 0, width, height);
      
      for (const b of blobs) {
        b.x += b.vx;
        b.y += b.vy;
        
        if (b.x - b.r < 0 || b.x + b.r > width) b.vx *= -1;
        if (b.y - b.r < 0 || b.y + b.r > height) b.vy *= -1;
        
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grad.addColorStop(0, `hsla(${b.hue}, 80%, 50%, 0.18)`);
        grad.addColorStop(0.5, `hsla(${b.hue}, 80%, 40%, 0.05)`);
        grad.addColorStop(1, "transparent");
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      
      if (pointer.active) {
        const grad = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 100 * devicePixelRatio);
        grad.addColorStop(0, "rgba(255, 0, 255, 0.12)");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 100 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }
      
      requestAnimationFrame(frame);
    }
    frame();
    
  } else {
    // Style 3: Solar Flare Sparks rising
    const sparks = [];
    const count = 60;
    
    function createSpark(atBottom = false) {
      return {
        x: Math.random() * width,
        y: atBottom ? height + Math.random() * 20 : Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.5 - Math.random() * 1.2,
        r: 1 + Math.random() * 2.5,
        alpha: 0.1 + Math.random() * 0.8,
        decay: 0.002 + Math.random() * 0.005
      };
    }
    
    for (let i = 0; i < count; i++) {
      sparks.push(createSpark());
    }

    function frame() {
      ctx.fillStyle = "rgba(5, 2, 0, 0.25)";
      ctx.fillRect(0, 0, width, height);
      
      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        
        if (pointer.active) {
          const dx = s.x - pointer.x;
          const dy = s.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < 120 * devicePixelRatio) {
            s.vx += (dx / Math.max(d, 1)) * 0.08;
            s.vy -= 0.04;
          }
        }
        
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;
        
        if (s.alpha <= 0 || s.y < 0 || s.x < 0 || s.x > width) {
          sparks[i] = createSpark(true);
        } else {
          ctx.fillStyle = `hsla(${session.hue + (s.alpha * 15)}, 90%, 55%, ${s.alpha})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * devicePixelRatio, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      requestAnimationFrame(frame);
    }
    frame();
  }
}

startCanvas();
