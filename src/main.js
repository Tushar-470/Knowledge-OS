const SECRET_NUMBER = 11;
const state = {
  vault: null,
  activeFolder: "", // empty string is Root level
  isGuest: false,
  urls: new Map(),
  unlockedFolders: new Set()
};

const el = {
  form: document.querySelector("#unlock-form"),
  password: document.querySelector("#password"),
  status: document.querySelector("#status"),
  lock: document.querySelector("#lock"),
  vault: document.querySelector("#vault"),
  breadcrumbs: document.querySelector("#breadcrumbs"),
  folderGrid: document.querySelector("#folder-grid"),
  fileSection: document.querySelector("#file-section"),
  fileGrid: document.querySelector("#file-grid"),
  folderTitle: document.querySelector("#folder-title"),
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
  
  // Daily access password formula
  const password = String(dd + mm + SECRET_NUMBER).padStart(4, "0");
  
  // Visit-based seed (changes every visit/load)
  const visitSeed = Math.floor(Math.random() * 1000000);
  const style = visitSeed % 4;
  
  // Scoped randomized colors to ensure distinct vibes per visit
  let hue = 0;
  let accent = 0;
  
  if (style === 0) {
    // Cyber Neon (Cyan base, Magenta accent)
    hue = 180 + (visitSeed % 40); // 180 - 220
    accent = 300 + (Math.floor(visitSeed / 13) % 40); // 300 - 340
  } else if (style === 1) {
    // Matrix Green
    hue = 100 + (visitSeed % 40); // 100 - 140
    accent = hue;
  } else if (style === 2) {
    // Nebula Purple (Violet base, Fuchsia accent)
    hue = 250 + (visitSeed % 40); // 250 - 290
    accent = 310 + (Math.floor(visitSeed / 13) % 40); // 310 - 350
  } else {
    // Solar Flare (Amber base, Crimson/Red accent)
    hue = 15 + (visitSeed % 35); // 15 - 50
    accent = 350 + (Math.floor(visitSeed / 13) % 20); // 350 - 10
  }
  
  return {
    password,
    visitSeed,
    hue,
    accent,
    count: (visitSeed % 40) + 30,
    style,
    dd,
    mm
  };
}

const session = todaySession();
const visitSeed = session.visitSeed;

// Apply dynamic theme custom properties and body class layers
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

function getFolderContents(currentPath) {
  const subfolders = new Set();
  const files = [];
  
  if (!state.vault || !state.vault.files) {
    return { subfolders: [], files: [] };
  }
  
  for (const file of state.vault.files) {
    const filePath = file.path;
    
    if (state.isGuest) {
      if (!filePath.startsWith("Public/") && filePath !== "Public") {
        continue;
      }
    }
    
    if (currentPath === "") {
      if (filePath.includes("/")) {
        const firstSegment = filePath.split("/")[0];
        subfolders.add(firstSegment);
      } else {
        files.push(file);
      }
    } else {
      const prefix = currentPath + "/";
      if (filePath.startsWith(prefix)) {
        const remaining = filePath.substring(prefix.length);
        if (remaining.includes("/")) {
          const nextSegment = remaining.split("/")[0];
          subfolders.add(currentPath + "/" + nextSegment);
        } else {
          files.push(file);
        }
      }
    }
  }
  
  return {
    subfolders: Array.from(subfolders).sort(),
    files: files.sort((a, b) => a.name.localeCompare(b.name))
  };
}

function renderBreadcrumbs() {
  el.breadcrumbs.innerHTML = "";
  
  const pathParts = state.activeFolder ? state.activeFolder.split("/") : [];
  
  const homeCrumb = document.createElement("span");
  homeCrumb.className = state.activeFolder === "" || (state.isGuest && state.activeFolder === "Public") ? "crumb active" : "crumb";
  homeCrumb.textContent = state.isGuest ? "Public (Home)" : "Home";
  if (state.activeFolder !== "" && !(state.isGuest && state.activeFolder === "Public")) {
    homeCrumb.addEventListener("click", () => {
      state.activeFolder = state.isGuest ? "Public" : "";
      renderVaultView();
    });
  }
  el.breadcrumbs.appendChild(homeCrumb);
  
  let currentAccumulated = "";
  const startIdx = state.isGuest ? 1 : 0;
  
  for (let i = startIdx; i < pathParts.length; i++) {
    const separator = document.createElement("span");
    separator.className = "separator";
    separator.textContent = " / ";
    el.breadcrumbs.appendChild(separator);
    
    const part = pathParts[i];
    currentAccumulated = pathParts.slice(0, i + 1).join("/");
    
    const crumb = document.createElement("span");
    const isActive = i === pathParts.length - 1;
    crumb.className = isActive ? "crumb active" : "crumb";
    crumb.textContent = part;
    
    if (!isActive) {
      const targetPath = currentAccumulated;
      crumb.addEventListener("click", () => {
        state.activeFolder = targetPath;
        renderVaultView();
      });
    }
    el.breadcrumbs.appendChild(crumb);
  }
}

function renderVaultView() {
  const query = el.search.value.trim().toLowerCase();
  
  if (query) {
    el.breadcrumbs.classList.add("hidden");
    el.folderGrid.classList.add("hidden");
    el.fileSection.classList.remove("hidden");
    el.folderTitle.textContent = `Search Results for "${query}"`;
    
    const matchingFiles = state.vault.files.filter(file => {
      if (state.isGuest && !file.path.startsWith("Public/")) return false;
      return `${file.name} ${file.path}`.toLowerCase().includes(query);
    });
    
    renderFilesList(matchingFiles);
    return;
  }
  
  el.breadcrumbs.classList.remove("hidden");
  renderBreadcrumbs();
  
  const { subfolders, files } = getFolderContents(state.activeFolder);
  
  el.folderGrid.innerHTML = "";
  if (subfolders.length === 0) {
    el.folderGrid.classList.add("hidden");
  } else {
    el.folderGrid.classList.remove("hidden");
    
    for (const [index, folderPath] of subfolders.entries()) {
      const card = document.createElement("article");
      card.className = "folder-card";
      card.style.animationDelay = `${Math.min(index * 35, 420)}ms`;
      
      const folderBaseName = folderPath.split("/").pop();
      const isUnlocked = state.isGuest || state.unlockedFolders.has(folderPath);
      
      if (isUnlocked) {
        card.style.cursor = "pointer";
        card.innerHTML = `
          <div class="folder-icon" aria-hidden="true"></div>
          <h3>${escapeHtml(folderBaseName)}</h3>
          <p class="meta" style="font-size: 0.8rem; border: 1px dashed var(--panel-border); padding: 0.35rem; text-align: center; border-radius: 6px; color: var(--muted); margin-top: 1rem;">Click to Open</p>
        `;
        card.addEventListener("click", () => openFolder(folderPath));
      } else {
        const lock = folderLetters(folderPath);
        card.innerHTML = `
          <div class="folder-icon" aria-hidden="true"></div>
          <h3>${escapeHtml(folderBaseName)}</h3>
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
              row.querySelectorAll("button").forEach(btn => btn.disabled = true);
              state.unlockedFolders.add(folderPath);
              setTimeout(() => openFolder(folderPath), 250);
            } else {
              button.classList.add("wrong");
              card.classList.remove("shake");
              requestAnimationFrame(() => card.classList.add("shake"));
              row.querySelectorAll("button").forEach(btn => btn.disabled = true);
              
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
  
  if (files.length === 0) {
    el.fileSection.classList.add("hidden");
  } else {
    el.fileSection.classList.remove("hidden");
    el.folderTitle.textContent = "Files";
    renderFilesList(files);
  }
}

function openFolder(folderPath) {
  state.activeFolder = folderPath;
  renderVaultView();
  el.vault.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderFilesList(files) {
  el.fileGrid.innerHTML = "";
  
  if (files.length === 0) {
    el.fileGrid.innerHTML = `<p class="meta" style="grid-column: 1/-1; text-align: center; padding: 2rem;">No files found.</p>`;
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

window.previewByName = (name) => {
  const searchName = name.toLowerCase().trim();
  const file = state.vault.files.find(f => 
    f.name.toLowerCase() === searchName || 
    f.name.toLowerCase().replace(/\.md$/, "") === searchName
  );
  if (file) {
    el.preview.close();
    setTimeout(() => previewFile(file), 150);
  } else {
    alert(`Document "${name}" not found in this vault.`);
  }
};

function renderMarkdown(md) {
  let html = escapeHtml(md);
  
  html = html.replace(/!\[\[(.*?)\]\]/g, (match, filename) => {
    const searchName = filename.toLowerCase().trim();
    const file = state.vault.files.find(f => f.name.toLowerCase() === searchName);
    if (file && file.mime.startsWith("image/")) {
      const url = fileUrl(file);
      return `<img src="${url}" alt="${escapeHtml(filename)}" class="embedded-image">`;
    }
    return `<span class="meta">[Attachment: ${escapeHtml(filename)} not found]</span>`;
  });
  
  html = html.replace(/\[\[(.*?)\]\]/g, (match, inner) => {
    let filename = inner;
    let alias = inner;
    if (inner.includes("|")) {
      const parts = inner.split("|");
      filename = parts[0];
      alias = parts[1];
    }
    return `<a href="#" class="wiki-link" onclick="event.preventDefault(); window.previewByName('${escapeHtml(filename.replace(/'/g, "\\'"))}')">${escapeHtml(alias)}</a>`;
  });
  
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>)+/gs, '<ul>$&</ul>');
  
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');
  
  return `<div class="markdown-body"><p>${html}</p></div>`;
}

function previewFile(file) {
  const url = fileUrl(file);
  el.previewTitle.textContent = file.name;
  el.download.href = url;
  el.download.download = file.name;
  el.previewBody.innerHTML = "";
  
  const textExtensions = [".json", ".js", ".css", ".html", ".xml", ".csv", ".yaml", ".yml", ".py", ".sh", ".ini", ".conf"];
  
  if (file.ext === ".md") {
    const rawText = bytesToText(base64ToBytes(file.content));
    el.previewBody.innerHTML = renderMarkdown(rawText);
  } else if (file.mime.startsWith("text/") || textExtensions.includes(file.ext)) {
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
  state.activeFolder = "";
  state.isGuest = false;
  state.unlockedFolders.clear();
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

let wrongAttempts = 0;
let cooldownTime = 0;

function startCooldown(seconds) {
  cooldownTime = seconds;
  el.password.disabled = true;
  el.form.querySelector("button[type='submit']").disabled = true;
  
  const interval = setInterval(() => {
    cooldownTime--;
    if (cooldownTime <= 0) {
      clearInterval(interval);
      el.password.disabled = false;
      el.form.querySelector("button[type='submit']").disabled = false;
      el.status.textContent = "";
      wrongAttempts = 0;
    } else {
      el.status.textContent = `Too many attempts. Locked out for ${cooldownTime}s.`;
    }
  }, 1000);
}

el.form.addEventListener("submit", async event => {
  event.preventDefault();
  if (cooldownTime > 0) return;
  
  const entered = el.password.value.trim().padStart(4, "0");
  const numeric = Number.parseInt(entered, 10);
  const secret = numeric - session.dd - session.mm;
  
  if (entered !== session.password) {
    wrongAttempts += 1;
    if (wrongAttempts >= 4) {
      startCooldown(30);
    } else {
      el.status.textContent = `Incorrect code. Attempt ${wrongAttempts}/4.`;
    }
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
    state.activeFolder = "";
    state.unlockedFolders.clear();
    el.vaultMode.textContent = "Private Portal (Unlocked)";
    
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
          renderVaultView();
        }, 400);
      }
      progressEl.textContent = `${progress}%`;
    }, 70);
    
  } catch (error) {
    console.error(error);
    el.status.textContent = "Decryption failure. Invalid secret key.";
  }
});

el.guestBtn.addEventListener("click", async () => {
  el.status.textContent = "Loading public records...";
  try {
    const data = await fetch("./public-data.json", { cache: "no-store" }).then(r => r.json());
    el.status.textContent = "";
    state.vault = data;
    state.isGuest = true;
    state.activeFolder = "Public";
    el.vaultMode.textContent = "Guest Access (Public Notes)";
    el.lock.classList.add("hidden");
    el.vault.classList.remove("hidden");
    renderVaultView();
  } catch (error) {
    console.error(error);
    el.status.textContent = "Failed to load public data.";
  }
});

el.lockVaultBtn.addEventListener("click", () => {
  lockVault("System locked securely.");
});

el.search.addEventListener("input", () => {
  renderVaultView();
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
    initMatrix();
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", event => {
    pointer.x = event.clientX * devicePixelRatio;
    pointer.y = event.clientY * devicePixelRatio;
    pointer.active = true;
  });
  window.addEventListener("pointerleave", () => { pointer.active = false; });

  let currentStyle = session.style;
  
  // Neon Configuration
  let neonConfig = {
    count: 80,
    speedCoeff: 3.5,
    maxDist: 150,
    dotRadius: 2.5
  };
  let neonParticles = [];
  function initNeon() {
    neonParticles = [];
    for (let i = 0; i < neonConfig.count; i++) {
      neonParticles.push({
        x: Math.random() * window.innerWidth * devicePixelRatio,
        y: Math.random() * window.innerHeight * devicePixelRatio,
        vx: (Math.random() - 0.5) * neonConfig.speedCoeff,
        vy: (Math.random() - 0.5) * neonConfig.speedCoeff,
        r: neonConfig.dotRadius * (0.5 + Math.random())
      });
    }
  }

  // Matrix Configuration
  let matrixConfig = {
    fontSize: 16,
    speedCoeff: 1.8,
    chars: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@%&*+-/<>".split(""),
    density: 0.985
  };
  let matrixDrops = [];
  function initMatrix() {
    if (width === 0) return;
    const cols = Math.floor(width / (matrixConfig.fontSize * devicePixelRatio)) + 1;
    matrixDrops = Array(cols).fill(1).map(() => Math.floor(Math.random() * -50));
  }

  // Nebula Configuration
  let nebulaConfig = {
    count: 5,
    speedCoeff: 2.5,
    baseRadius: 220
  };
  let nebulaBlobs = [];
  function initNebula() {
    nebulaBlobs = [];
    for (let i = 0; i < nebulaConfig.count; i++) {
      nebulaBlobs.push({
        x: Math.random() * window.innerWidth * devicePixelRatio,
        y: Math.random() * window.innerHeight * devicePixelRatio,
        vx: (Math.random() - 0.5) * nebulaConfig.speedCoeff * 2,
        vy: (Math.random() - 0.5) * nebulaConfig.speedCoeff * 2,
        r: nebulaConfig.baseRadius * (0.6 + Math.random() * 0.8),
        hueShift: Math.random() * 60 - 30
      });
    }
  }

  // Solar Sparks Configuration
  let solarConfig = {
    count: 100,
    speedCoeff: 2.8,
    maxRadius: 3.5
  };
  let solarSparks = [];
  function createSolarSpark(atBottom = false) {
    return {
      x: Math.random() * width,
      y: atBottom ? height + Math.random() * 20 : Math.random() * height,
      vx: (Math.random() - 0.5) * solarConfig.speedCoeff,
      vy: (-1 - Math.random() * 2) * solarConfig.speedCoeff,
      r: (1 + Math.random() * solarConfig.maxRadius),
      alpha: 0.15 + Math.random() * 0.85,
      decay: 0.004 + Math.random() * 0.008
    };
  }
  function initSolar() {
    solarSparks = [];
    for (let i = 0; i < solarConfig.count; i++) {
      solarSparks.push(createSolarSpark());
    }
  }

  resize();
  initNeon();
  initNebula();
  initSolar();

  function randomizeParams() {
    const baseHue = Math.floor(Math.random() * 360);
    const accentHue = (baseHue + 120 + Math.floor(Math.random() * 120)) % 360;
    
    document.documentElement.style.setProperty("--hue", baseHue);
    document.documentElement.style.setProperty("--accent", accentHue);
    
    document.body.className = document.body.className
      .replace(/theme-\d/, `theme-${currentStyle}`)
      .replace(/layout-\d/, `layout-${currentStyle}`);

    if (currentStyle === 0) {
      neonConfig.count = 60 + Math.floor(Math.random() * 60);
      neonConfig.speedCoeff = 3.0 + Math.random() * 4.0; 
      neonConfig.maxDist = 120 + Math.floor(Math.random() * 80);
      neonConfig.dotRadius = 1.5 + Math.random() * 2;
      initNeon();
    } else if (currentStyle === 1) {
      matrixConfig.fontSize = 12 + Math.floor(Math.random() * 8);
      matrixConfig.speedCoeff = 1.5 + Math.random() * 2.0; 
      const charSets = [
        "01".split(""),
        "0123456789ABCDEF".split(""),
        "アカサタナハマヤラワガザダバパイウエオ".split(""),
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@%&*+-/<>".split(""),
        "☀☁☂☃☄★☆☇☈☉☊☋☌☍☎☏☐☑☒☓☕☖☗☘".split("")
      ];
      matrixConfig.chars = charSets[Math.floor(Math.random() * charSets.length)];
      matrixConfig.density = 0.97 + Math.random() * 0.02;
      initMatrix();
    } else if (currentStyle === 2) {
      nebulaConfig.count = 4 + Math.floor(Math.random() * 4);
      nebulaConfig.speedCoeff = 2.0 + Math.random() * 3.0; 
      nebulaConfig.baseRadius = 120 + Math.floor(Math.random() * 150);
      initNebula();
    } else {
      solarConfig.count = 80 + Math.floor(Math.random() * 60);
      solarConfig.speedCoeff = 2.5 + Math.random() * 3.0; 
      solarConfig.maxRadius = 2.0 + Math.random() * 3;
      initSolar();
    }
  }

  setInterval(() => {
    currentStyle = (currentStyle + 1) % 4;
    randomizeParams();
  }, 5000);

  randomizeParams();

  let lastMatrixTime = 0;
  function animate(nowTime) {
    if (currentStyle === 0) {
      ctx.clearRect(0, 0, width, height);
      const currentHue = getComputedStyle(document.documentElement).getPropertyValue("--hue").trim();
      const currentAccent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
      
      ctx.fillStyle = `hsla(${currentHue}, 90%, 70%, 0.65)`;
      ctx.strokeStyle = `hsla(${currentAccent}, 90%, 60%, 0.2)`;
      
      for (const p of neonParticles) {
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < 180 * devicePixelRatio) {
            p.vx += (dx / Math.max(d, 1)) * 0.15;
            p.vy += (dy / Math.max(d, 1)) * 0.15;
          }
        }
        
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.vx += (Math.random() - 0.5) * 0.22;
        p.vy += (Math.random() - 0.5) * 0.22;
        
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }
      
      for (let i = 0; i < neonParticles.length; i++) {
        for (let j = i + 1; j < neonParticles.length; j++) {
          const a = neonParticles[i];
          const b = neonParticles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < neonConfig.maxDist * devicePixelRatio) {
            ctx.globalAlpha = 1 - d / (neonConfig.maxDist * devicePixelRatio);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      
    } else if (currentStyle === 1) {
      const interval = 40 / matrixConfig.speedCoeff;
      if (nowTime - lastMatrixTime > interval) {
        lastMatrixTime = nowTime;
        
        ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
        ctx.fillRect(0, 0, width, height);
        
        const fontSizePx = matrixConfig.fontSize * devicePixelRatio;
        ctx.font = `bold ${fontSizePx}px monospace`;
        const currentHue = getComputedStyle(document.documentElement).getPropertyValue("--hue").trim();
        
        for (let i = 0; i < matrixDrops.length; i++) {
          const text = matrixConfig.chars[Math.floor(Math.random() * matrixConfig.chars.length)];
          const x = i * fontSizePx;
          const y = matrixDrops[i] * fontSizePx;
          
          if (Math.random() > 0.982) {
            ctx.fillStyle = "#ffffff";
          } else {
            ctx.fillStyle = `hsla(${currentHue}, 100%, 50%, 1)`;
          }
          
          if (y > 0) {
            ctx.fillText(text, x, y);
          }
          
          if (y > height && Math.random() > matrixConfig.density) {
            matrixDrops[i] = 0;
          }
          matrixDrops[i]++;
        }
        
        if (pointer.active) {
          ctx.fillStyle = `hsla(${currentHue}, 100%, 50%, 0.25)`;
          ctx.fillRect(
            Math.floor(pointer.x / fontSizePx) * fontSizePx,
            Math.floor(pointer.y / fontSizePx) * fontSizePx,
            fontSizePx,
            fontSizePx
          );
        }
      }
      
    } else if (currentStyle === 2) {
      ctx.fillStyle = "rgba(6, 2, 18, 0.12)";
      ctx.fillRect(0, 0, width, height);
      
      const currentHue = Number(getComputedStyle(document.documentElement).getPropertyValue("--hue").trim() || 250);
      
      for (const b of nebulaBlobs) {
        b.x += b.vx;
        b.y += b.vy;
        
        if (b.x - b.r < 0 || b.x + b.r > width) b.vx *= -1;
        if (b.y - b.r < 0 || b.y + b.r > height) b.vy *= -1;
        
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        const targetHue = (currentHue + b.hueShift + 360) % 360;
        grad.addColorStop(0, `hsla(${targetHue}, 80%, 50%, 0.22)`);
        grad.addColorStop(0.5, `hsla(${targetHue}, 80%, 40%, 0.06)`);
        grad.addColorStop(1, "transparent");
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      
      if (pointer.active) {
        const currentAccent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
        const grad = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 120 * devicePixelRatio);
        grad.addColorStop(0, `hsla(${currentAccent}, 100%, 50%, 0.16)`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 120 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }
      
    } else {
      ctx.fillStyle = "rgba(5, 2, 0, 0.20)";
      ctx.fillRect(0, 0, width, height);
      
      const currentHue = Number(getComputedStyle(document.documentElement).getPropertyValue("--hue").trim() || 15);
      
      for (let i = 0; i < solarSparks.length; i++) {
        const s = solarSparks[i];
        
        if (pointer.active) {
          const dx = s.x - pointer.x;
          const dy = s.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < 150 * devicePixelRatio) {
            s.vx += (dx / Math.max(d, 1)) * 0.15;
            s.vy -= 0.08;
          }
        }
        
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;
        
        if (s.alpha <= 0 || s.y < 0 || s.x < 0 || s.x > width) {
          solarSparks[i] = createSolarSpark(true);
        } else {
          ctx.fillStyle = `hsla(${currentHue + (s.alpha * 20)}, 95%, 60%, ${s.alpha})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * devicePixelRatio, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

startCanvas();
