const SECRET_NUMBER = 10;
const state = {
  vault: null,
  activeFolder: "", // empty string is Root level
  isGuest: false,
  urls: new Map(),
  unlockedFolders: new Set()
};

// Web Audio API Sound Engine (Zero-Network SFX)
const VaultAudio = {
  ctx: null,
  muted: false,
  
  init() {
    localStorage.removeItem("vault_sfx_muted");
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  },
  
  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem("vault_sfx_muted", this.muted);
    this.updateButtonUI();
    this.playChirp();
  },
  
  updateButtonUI() {
    const btn = document.querySelector("#audio-toggle-btn");
    if (btn) {
      btn.textContent = this.muted ? "UNMUTE SFX" : "MUTE SFX";
    }
  },
  
  playChirp() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(650 + Math.random() * 150, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);
      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {
      console.warn("Audio context not allowed or failed to start:", e);
    }
  },
  
  playUnlock() {
    if (this.muted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 987.77, 1046.50];
      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, now + idx * 0.07);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.07 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.12);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.15);
      });
    } catch (e) {
      console.warn(e);
    }
  },
  
  playWarning() {
    if (this.muted) return;
    this.init();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.linearRampToValueAtTime(45, now + 0.45);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.55);
      
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1000, now);
      osc2.frequency.setValueAtTime(300, now + 0.06);
      osc2.frequency.setValueAtTime(800, now + 0.12);
      gain2.gain.setValueAtTime(0.03, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      osc2.start(now);
      osc2.stop(now + 0.22);
    } catch (e) {
      console.warn(e);
    }
  }
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
  const style = visitSeed % 9; // Pick randomly from 9 styles!
  
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
  } else if (style === 3) {
    // Solar Flare (Amber base, Crimson/Red accent)
    hue = 15 + (visitSeed % 35); // 15 - 50
    accent = 350 + (Math.floor(visitSeed / 13) % 20); // 350 - 10
  } else if (style === 4) {
    // Vectr Minimalist (Slate Navy & Blue)
    hue = 210 + (visitSeed % 15);
    accent = 220 + (Math.floor(visitSeed / 13) % 15);
  } else if (style === 5) {
    // Origami Paper (Cream & Orange)
    hue = 25 + (visitSeed % 15);
    accent = 30 + (Math.floor(visitSeed / 13) % 15);
  } else if (style === 6) {
    // Liquid Glass (Teal & Purple)
    hue = 175 + (visitSeed % 20);
    accent = 270 + (Math.floor(visitSeed / 13) % 25);
  } else if (style === 7) {
    // Retro Terminal (CRT Amber)
    hue = 35 + (visitSeed % 15);
    accent = 35;
  } else {
    // Zen Garden (Sage Green & Pebble Gray)
    hue = 100 + (visitSeed % 30);
    accent = 50 + (Math.floor(visitSeed / 13) % 30);
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
  
  // Parity rule: Even last digit -> last in alphabet. Odd last digit -> first in alphabet.
  const lastDigit = Number(session.password.slice(-1));
  const isEven = (lastDigit % 2 === 0);
  const sorted = [...chosen].sort();
  const correct = isEven ? sorted.at(-1) : sorted.at(0);
  
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

// Bind interactive 3D perspective card tilt to mouse movements
function bind3DTilt(element) {
  element.addEventListener("mousemove", (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 20; 
    const rotateX = ((y / rect.height) - 0.5) * -20;
    element.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateY(-8px) scale(1.02)`;
    element.style.transition = "transform 0.05s ease-out";
    
    // Set mouse coordinates for specular reflection glare
    element.style.setProperty("--glare-x", `${(x / rect.width) * 100}%`);
    element.style.setProperty("--glare-y", `${(y / rect.height) * 100}%`);
  });
  
  element.addEventListener("mouseleave", () => {
    element.style.transform = "";
    element.style.transition = "transform 0.4s ease-out";
  });
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
        // Soft-hide root files: do not display them on the homepage list
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
          <div class="card-glare"></div>
          <div class="folder-icon" aria-hidden="true"></div>
          <h3>${escapeHtml(folderBaseName)}</h3>
          <p class="meta" style="font-size: 0.8rem; border: 1px dashed var(--panel-border); padding: 0.35rem; text-align: center; border-radius: 6px; color: var(--muted); margin-top: 1rem;">Click to Open</p>
        `;
        card.addEventListener("click", () => openFolder(folderPath));
        bind3DTilt(card);
      } else {
        const lock = folderLetters(folderPath);
        card.innerHTML = `
          <div class="card-glare"></div>
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
              VaultAudio.playChirp();
              button.classList.add("correct");
              row.querySelectorAll("button").forEach(btn => btn.disabled = true);
              state.unlockedFolders.add(folderPath);
              setTimeout(() => openFolder(folderPath), 250);
            } else {
              VaultAudio.playWarning();
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
        bind3DTilt(card);
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
      <div class="card-glare"></div>
      <p class="eyebrow file-type">${escapeHtml(file.ext.replace(".", "") || "file")}</p>
      <h4>${escapeHtml(file.name)}</h4>
      <p class="meta">${formatSize(file.size)}</p>
    `;
    card.addEventListener("click", () => previewFile(file));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter") previewFile(file);
    });
    bind3DTilt(card);
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
  const searchName = name.trim();
  
  const normalizePath = (p) => {
    return p.toLowerCase()
            .replace(/\\/g, "/")
            .replace(/\.md$/, "")
            .replace(/[\s_\-]/g, "")
            .trim();
  };
  
  const cleanSearch = normalizePath(searchName);
  
  const file = state.vault.files.find(f => {
    const relativePath = f.folder === "Root" ? f.name : `${f.folder}/${f.name}`;
    const cleanRelPath = normalizePath(relativePath);
    const cleanFileName = normalizePath(f.name);
    return cleanRelPath === cleanSearch || cleanFileName === cleanSearch;
  });
  
  if (file) {
    const isUnlocked = state.isGuest || !file.folder || file.folder === "Root" || state.unlockedFolders.has(file.folder);
    if (isUnlocked) {
      previewFile(file);
    } else {
      showLinkLockDialog(file);
    }
  } else {
    alert(`Document "${name}" not found in this vault.`);
  }
};

function showLinkLockDialog(file) {
  const dialog = document.querySelector("#link-lock-dialog");
  const folderNameEl = document.querySelector("#link-lock-folder-name");
  const letterRow = document.querySelector("#link-lock-letter-row");
  const cancelBtn = document.querySelector("#close-link-lock");
  
  folderNameEl.textContent = file.folder;
  letterRow.innerHTML = "";
  
  const lock = folderLetters(file.folder);
  
  for (const letter of lock.display) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = letter;
    button.addEventListener("click", () => {
      if (letter === lock.correct) {
        VaultAudio.playChirp();
        button.classList.add("correct");
        state.unlockedFolders.add(file.folder);
        setTimeout(() => {
          dialog.close();
          previewFile(file);
        }, 250);
      } else {
        VaultAudio.playWarning();
        button.classList.add("wrong");
        dialog.classList.remove("shake");
        requestAnimationFrame(() => dialog.classList.add("shake"));
        
        const glitchOverlay = document.querySelector("#glitch-overlay");
        glitchOverlay.classList.remove("hidden");
        
        setTimeout(() => {
          glitchOverlay.classList.add("hidden");
          dialog.close();
          lockVault("Intrusion detected. Vault locked.");
        }, 1000);
      }
    });
    letterRow.append(button);
  }
  
  cancelBtn.onclick = () => dialog.close();
  dialog.showModal();
}

function parseMarkdownTable(rows) {
  if (rows.length < 2) return "";
  
  let html = "<table>";
  
  const cleanedRows = rows.filter((row, idx) => {
    if (idx === 1 && row.includes("-")) {
      return false; // Skip the separator row
    }
    return true;
  });
  
  cleanedRows.forEach((row, idx) => {
    const cells = row.split("|").map(c => c.trim());
    if (cells[0] === "") cells.shift();
    if (cells[cells.length - 1] === "") cells.pop();
    
    if (idx === 0) {
      html += "<thead><tr>";
      cells.forEach(cell => {
        html += `<th>${cell}</th>`;
      });
      html += "</tr></thead><tbody>";
    } else {
      html += "<tr>";
      cells.forEach(cell => {
        html += `<td>${cell}</td>`;
      });
      html += "</tr>";
    }
  });
  
  html += "</tbody></table>";
  return html;
}

// Rich Markdown Parser
function renderMarkdown(md) {
  let escaped = escapeHtml(md);
  
  const lines = escaped.split(/\r?\n/);
  let inList = false;
  let listType = null; // 'ul' or 'ol'
  let inTable = false;
  let tableRows = [];
  let inCodeBlock = false;
  let codeBlockContent = [];
  let codeLanguage = "";
  let inBlockquote = false;
  
  let output = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Code blocks
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        output.push(`<div class="code-container"><div class="code-header">${escapeHtml(codeLanguage || "code")}</div><pre><code>${codeBlockContent.join("\n")}</code></pre></div>`);
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLanguage = line.trim().slice(3).trim();
      }
      continue;
    }
    
    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }
    
    // Tables
    const isTableLine = line.trim().startsWith("|") && line.trim().endsWith("|");
    if (isTableLine) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      tableRows.push(line);
      continue;
    } else if (inTable) {
      output.push(parseMarkdownTable(tableRows));
      inTable = false;
      tableRows = [];
    }
    
    // Lists
    const unorderedMatch = line.match(/^(\s*)-\s+(.*)$/);
    const orderedMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
    
    if (unorderedMatch) {
      if (!inList || listType !== "ul") {
        if (inList) output.push(`</${listType}>`);
        output.push("<ul>");
        inList = true;
        listType = "ul";
      }
      let content = unorderedMatch[2];
      if (content.startsWith("[ ] ")) {
        output.push(`<li class="task-list-item"><input type="checkbox" disabled> ${content.slice(4)}</li>`);
      } else if (content.startsWith("[x] ")) {
        output.push(`<li class="task-list-item"><input type="checkbox" checked disabled> ${content.slice(4)}</li>`);
      } else {
        output.push(`<li>${content}</li>`);
      }
      continue;
    }
    
    if (orderedMatch) {
      if (!inList || listType !== "ol") {
        if (inList) output.push(`</${listType}>`);
        output.push("<ol>");
        inList = true;
        listType = "ol";
      }
      output.push(`<li>${orderedMatch[2]}</li>`);
      continue;
    }
    
    if (inList && !unorderedMatch && !orderedMatch) {
      output.push(`</${listType}>`);
      inList = false;
      listType = null;
    }
    
    // Blockquote
    if (line.startsWith("&gt; ")) {
      if (!inBlockquote) {
        inBlockquote = true;
        output.push("<blockquote>");
      }
      output.push(line.slice(5) + "<br>");
      continue;
    } else if (inBlockquote) {
      output.push("</blockquote>");
      inBlockquote = false;
    }
    
    // Headers
    if (line.startsWith("# ")) {
      output.push(`<h1>${line.slice(2)}</h1>`);
    } else if (line.startsWith("## ")) {
      output.push(`<h2>${line.slice(3)}</h2>`);
    } else if (line.startsWith("### ")) {
      output.push(`<h3>${line.slice(4)}</h3>`);
    } else if (line.startsWith("#### ")) {
      output.push(`<h4>${line.slice(5)}</h4>`);
    } else if (line.trim() === "") {
      output.push("<br>");
    } else {
      output.push(`<p>${line}</p>`);
    }
  }
  
  if (inCodeBlock) {
    output.push(`<div class="code-container"><pre><code>${codeBlockContent.join("\n")}</code></pre></div>`);
  }
  if (inTable) {
    output.push(parseMarkdownTable(tableRows));
  }
  if (inList) {
    output.push(`</${listType}>`);
  }
  if (inBlockquote) {
    output.push("</blockquote>");
  }
  
  let finalHtml = output.join("\n");
  
  // Image links
  finalHtml = finalHtml.replace(/!\[\[(.*?)\]\]/g, (match, filename) => {
    const searchName = filename.toLowerCase().trim();
    const file = state.vault.files.find(f => f.name.toLowerCase() === searchName);
    if (file && file.mime.startsWith("image/")) {
      const url = fileUrl(file);
      return `<img src="${url}" alt="${escapeHtml(filename)}" class="embedded-image">`;
    }
    return `<span class="meta">[Attachment: ${escapeHtml(filename)} not found]</span>`;
  });
  
  // Wiki links
  finalHtml = finalHtml.replace(/\[\[(.*?)\]\]/g, (match, inner) => {
    let filename = inner;
    let alias = inner;
    if (inner.includes("|")) {
      const parts = inner.split("|");
      filename = parts[0];
      alias = parts[1];
    }
    return `<a href="#" class="wiki-link" onclick="event.preventDefault(); window.previewByName('${escapeHtml(filename.replace(/'/g, "\\'"))}')">${escapeHtml(alias)}</a>`;
  });
  
  // Bold & Italics
  finalHtml = finalHtml.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  finalHtml = finalHtml.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Inline code
  finalHtml = finalHtml.replace(/`(.*?)`/g, '<code>$1</code>');
  
  return `<div class="markdown-body">${finalHtml}</div>`;
}

// previewFile(file) is declared below with tab-view navigation support.

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
    VaultAudio.playWarning();
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
          initVaultUI(); // Initialize home dashboard and stats
          VaultAudio.playUnlock();
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
      initVaultUI(); // Initialize public stats and dashboard
      VaultAudio.playUnlock();
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
    if (el.search.value.trim() !== "") {
      navigateToSection("02"); // Focus explorer to show search results
    }
  });

  el.closePreview.addEventListener("click", () => el.preview.close());

  // Global Section Router
  let currentSection = "01";

  window.navigateToSection = function(sectionId) {
    currentSection = sectionId;
    
    // Update active sidebar nav button classes
    document.querySelectorAll(".nav-item").forEach(item => {
      if (item.getAttribute("data-section") === sectionId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
    
    // Animate indicator progress fill height
    const fill = document.querySelector("#nav-progress-fill");
    if (fill) {
      const percentage = {
        "01": 0,
        "02": 50,
        "03": 100
      }[sectionId];
      fill.style.height = `${percentage}%`;
    }
    
    // Switch visible content sections
    document.querySelectorAll(".vault-view-section").forEach(view => {
      view.classList.add("hidden");
    });
    
    const targetViewMap = {
      "01": "#view-home",
      "02": "#view-explorer",
      "03": "#view-preview"
    };
    
    const targetView = document.querySelector(targetViewMap[sectionId]);
    if (targetView) {
      targetView.classList.remove("hidden");
    }
  };

  // Setup sidebar navigation bindings
  document.querySelectorAll(".nav-item").forEach(item => {
    const sec = item.getAttribute("data-section");
    item.addEventListener("click", () => navigateToSection(sec));
  });

  document.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("navigate-to-explorer")) {
      e.preventDefault();
      navigateToSection("02");
    }
  });

  function initVaultUI() {
    navigateToSection("01"); // Default to Portal Home
    
    // Calculate and display vault statistics
    const totalFiles = state.vault.files.length;
    const folders = new Set();
    state.vault.files.forEach(f => {
      if (f.folder && f.folder !== "Root") {
        folders.add(f.folder);
      }
    });
    const totalFolders = folders.size;
    
    document.querySelector("#stat-files").textContent = totalFiles;
    document.querySelector("#stat-folders").textContent = totalFolders;
    const diagKeyEl = document.querySelector("#diag-daily-key");
    if (diagKeyEl) diagKeyEl.textContent = session.password;
    const diagUnlockedEl = document.querySelector("#diag-unlocked-count");
    if (diagUnlockedEl) diagUnlockedEl.textContent = state.unlockedFolders.size;
    
    // Render Quick Reference recent files grid
    const recentGrid = document.querySelector("#recent-files-grid");
    recentGrid.innerHTML = "";
    
    const displayFiles = state.vault.files
      .filter(f => !state.isGuest || f.path.startsWith("Public/"))
      .slice(0, 4);
      
    displayFiles.forEach(file => {
      const card = document.createElement("div");
      card.className = "file-card";
      card.style.minHeight = "auto";
      card.innerHTML = `
        <div class="card-glare"></div>
        <p class="eyebrow file-type" style="font-size: 0.6rem;">${escapeHtml(file.ext.replace(".", "") || "file")}</p>
        <h5 style="margin: 0.4rem 0 0.2rem; font-size: 0.95rem; font-weight: 700; word-break: break-all;">${escapeHtml(file.name)}</h5>
        <p class="meta" style="font-size: 0.75rem;">${file.folder || "Root"}</p>
      `;
      card.addEventListener("click", () => previewFile(file));
      bind3DTilt(card);
      recentGrid.appendChild(card);
    });
  }

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
      randomizeParams();
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

    // Style 4: Vectr Light Lines Configuration
    let vectrLines = [];
    function initVectr() {
      vectrLines = [];
      const lines = 12;
      for (let i = 0; i <= lines; i++) {
        vectrLines.push({
          ratio: i / lines,
          seed: Math.random() * 10
        });
      }
    }

    // Style 5: Origami Configuration
    let origamiNodes = [];
    function initOrigami() {
      origamiNodes = [];
      for (let i = 0; i < 18; i++) {
        origamiNodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5
        });
      }
    }

    // Style 6: Liquid Glass Configuration
    let liquidBlobs = [];
    function initLiquid() {
      liquidBlobs = [];
      for (let i = 0; i < 5; i++) {
        liquidBlobs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.8,
          vy: (Math.random() - 0.5) * 1.8,
          r: 120 + Math.random() * 120
        });
      }
    }

    // Style 8: Zen Ripples
    let zenRipples = [];
    function initZen() {
      zenRipples = [];
    }

    // Perspective 3D floor grid for Sci-fi themes
    function draw3DGrid(currentHue, currentAccent) {
      ctx.strokeStyle = `hsla(${currentAccent}, 90%, 60%, 0.07)`;
      ctx.lineWidth = 1.5;
      const horizon = height * 0.45;
      const vanishingX = pointer.active ? pointer.x : width / 2;
      const lines = 24;
      for (let i = 0; i <= lines; i++) {
        const targetX = (width / lines) * i;
        ctx.beginPath();
        ctx.moveTo(vanishingX, horizon);
        ctx.lineTo(targetX, height);
        ctx.stroke();
      }
      const horizLines = 15;
      for (let i = 0; i < horizLines; i++) {
        const ratio = Math.pow(i / horizLines, 2.5);
        const y = horizon + (height - horizon) * ratio;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // Definition of Section-based 3D models
    const buildingLines = [
      // Base Box
      {x1: -50, y1: 50, z1: -50, x2: 50, y2: 50, z2: -50},
      {x1: 50, y1: 50, z1: -50, x2: 50, y2: 50, z2: 50},
      {x1: 50, y1: 50, z1: 50, x2: -50, y2: 50, z2: 50},
      {x1: -50, y1: 50, z1: 50, x2: -50, y2: 50, z2: -50},
      {x1: -50, y1: -10, z1: -50, x2: 50, y2: -10, z2: -50},
      {x1: 50, y1: -10, z1: -50, x2: 50, y2: -10, z2: 50},
      {x1: 50, y1: -10, z1: 50, x2: -50, y2: -10, z2: 50},
      {x1: -50, y1: -10, z1: 50, x2: -50, y2: -10, z2: -50},
      {x1: -50, y1: 50, z1: -50, x2: -50, y2: -10, z2: -50},
      {x1: 50, y1: 50, z1: -50, x2: 50, y2: -10, z2: -50},
      {x1: 50, y1: 50, z1: 50, x2: 50, y2: -10, z2: 50},
      {x1: -50, y1: 50, z1: 50, x2: -50, y2: -10, z2: 50},
      // Tower Box
      {x1: -25, y1: -10, z1: -25, x2: 25, y2: -10, z2: -25},
      {x1: 25, y1: -10, z1: -25, x2: 25, y2: -10, z2: 25},
      {x1: 25, y1: -10, z1: 25, x2: -25, y2: -10, z2: 25},
      {x1: -25, y1: -10, z1: 25, x2: -25, y2: -10, z2: -25},
      {x1: -25, y1: -60, z1: -25, x2: 25, y2: -60, z2: -25},
      {x1: 25, y1: -60, z1: -25, x2: 25, y2: -60, z2: 25},
      {x1: 25, y1: -60, z1: 25, x2: -25, y2: -60, z2: 25},
      {x1: -25, y1: -60, z1: 25, x2: -25, y2: -60, z2: -25},
      {x1: -25, y1: -10, z1: -25, x2: -25, y2: -60, z2: -25},
      {x1: 25, y1: -10, z1: -25, x2: 25, y2: -60, z2: -25},
      {x1: 25, y1: -10, z1: 25, x2: 25, y2: -60, z2: 25},
      {x1: -25, y1: -10, z1: 25, x2: -25, y2: -60, z2: 25}
    ];

    const factoryLines = [
      // Base plate
      {x1: -60, y1: 50, z1: -30, x2: 60, y2: 50, z2: -30},
      {x1: 60, y1: 50, z1: -30, x2: 60, y2: 50, z2: 30},
      {x1: 60, y1: 50, z1: 30, x2: -60, y2: 50, z2: 30},
      {x1: -60, y1: 50, z1: 30, x2: -60, y2: 50, z2: -30},
      // Left Chimney
      {x1: -30, y1: 50, z1: 0, x2: -30, y2: -50, z2: 0},
      {x1: -15, y1: 50, z1: 0, x2: -15, y2: -50, z2: 0},
      {x1: -22.5, y1: 50, z1: -7.5, x2: -22.5, y2: -50, z2: -7.5},
      {x1: -22.5, y1: 50, z1: 7.5, x2: -22.5, y2: -50, z2: 7.5},
      // Ring
      {x1: -30, y1: -50, z1: 0, x2: -22.5, y2: -50, z2: 7.5},
      {x1: -22.5, y1: -50, z2: 7.5, x2: -15, y2: -50, z2: 0},
      {x1: -15, y1: -50, z1: 0, x2: -22.5, y2: -50, z2: -7.5},
      {x1: -22.5, y1: -50, z1: -7.5, x2: -30, y2: -50, z1: 0},
      // Right Chimney
      {x1: 15, y1: 50, z1: 0, x2: 15, y2: -50, z2: 0},
      {x1: 30, y1: 50, z1: 0, x2: 30, y2: -50, z2: 0},
      {x1: 22.5, y1: 50, z1: -7.5, x2: 22.5, y2: -50, z2: -7.5},
      {x1: 22.5, y1: 50, z1: 7.5, x2: 22.5, y2: -50, z2: 7.5},
      // Ring
      {x1: 15, y1: -50, z1: 0, x2: 22.5, y2: -50, z2: 7.5},
      {x1: 22.5, y1: -50, z2: 7.5, x2: 30, y2: -50, z2: 0},
      {x1: 30, y1: -50, z1: 0, x2: 22.5, y2: -50, z2: -7.5},
      {x1: 22.5, y1: -50, z1: -7.5, x2: 15, y2: -50, z1: 0}
    ];

    const arrowLines = [
      {x1: -35, y1: -30, z1: 0, x2: 5, y2: 0, z2: 0},
      {x1: 5, y1: 0, z1: 0, x2: -35, y2: 30, z2: 0},
      {x1: -5, y1: -30, z1: 0, x2: 35, y2: 0, z2: 0},
      {x1: 35, y1: 0, z1: 0, x2: -5, y2: 30, z2: 0},
      // Depth
      {x1: -35, y1: -30, z1: 0, x2: -35, y2: -30, z2: -12},
      {x1: 5, y1: 0, z1: 0, x2: 5, y2: 0, z2: -12},
      {x1: -35, y1: 30, z1: 0, x2: -35, y2: 30, z2: -12},
      {x1: -5, y1: -30, z1: 0, x2: -5, y2: -30, z2: -12},
      {x1: 35, y1: 0, z1: 0, x2: 35, y2: 0, z2: -12},
      {x1: -5, y1: 30, z1: 0, x2: -5, y2: 30, z2: -12},
      // Backside
      {x1: -35, y1: -30, z1: -12, x2: 5, y2: 0, z2: -12},
      {x1: 5, y1: 0, z1: -12, x2: -35, y2: 30, z2: -12},
      {x1: -5, y1: -30, z1: -12, x2: 35, y2: 0, z2: -12},
      {x1: 35, y1: 0, z1: -12, x2: -5, y2: 30, z2: -12}
    ];

    function draw3DLine(line, angleX, angleY, cx, cy, color, style) {
      let x1_r1 = line.x1 * Math.cos(angleY) - line.z1 * Math.sin(angleY);
      let z1_r1 = line.x1 * Math.sin(angleY) + line.z1 * Math.cos(angleY);
      let y1_r2 = line.y1 * Math.cos(angleX) - z1_r1 * Math.sin(angleX);
      let z1_r2 = line.y1 * Math.sin(angleX) + z1_r1 * Math.cos(angleX);
      
      let x2_r1 = line.x2 * Math.cos(angleY) - line.z2 * Math.sin(angleY);
      let z2_r1 = line.x2 * Math.sin(angleY) + line.z2 * Math.cos(angleY);
      let y2_r2 = line.y2 * Math.cos(angleX) - z2_r1 * Math.sin(angleX);
      let z2_r2 = line.y2 * Math.sin(angleX) + z2_r1 * Math.cos(angleX);
      
      const focal = 300;
      const scale1 = focal / (focal + z1_r2);
      const scale2 = focal / (focal + z2_r2);
      
      const px1 = x1_r1 * scale1 + cx;
      const py1 = y1_r2 * scale1 + cy;
      const px2 = x2_r1 * scale2 + cx;
      const py2 = y2_r2 * scale2 + cy;
      
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(px1, py1);
      ctx.lineTo(px2, py2);
      ctx.stroke();
      
      if (style !== 4 && style !== 5 && style !== 8) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px1, py1, Math.max(1, scale1 * 2), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    resize();
    initNeon();
    initNebula();
    initSolar();
    initVectr();
    initOrigami();
    initLiquid();

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
        initMatrix();
      } else if (currentStyle === 2) {
        nebulaConfig.count = 4 + Math.floor(Math.random() * 4);
        nebulaConfig.speedCoeff = 2.0 + Math.random() * 3.0; 
        nebulaConfig.baseRadius = 120 + Math.floor(Math.random() * 150);
        initNebula();
      } else if (currentStyle === 3) {
        solarConfig.count = 80 + Math.floor(Math.random() * 60);
        solarConfig.speedCoeff = 2.5 + Math.random() * 3.0; 
        solarConfig.maxRadius = 2.0 + Math.random() * 3;
        initSolar();
      } else if (currentStyle === 4) {
        initVectr();
      } else if (currentStyle === 5) {
        initOrigami();
      } else if (currentStyle === 6) {
        initLiquid();
      } else if (currentStyle === 8) {
        initZen();
      }
    }

    // Changed visual theme cycle speed to exactly 67 seconds!
    setInterval(() => {
      currentStyle = (currentStyle + 1) % 9; // Cycle between all 9 styles!
      randomizeParams();
    }, 67000);

    randomizeParams();

    let lastMatrixTime = 0;
    function animate(nowTime) {
      ctx.clearRect(0, 0, width, height);
      
      const currentHue = getComputedStyle(document.documentElement).getPropertyValue("--hue").trim();
      const currentAccent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
      const accentRgb = getComputedStyle(document.documentElement).getPropertyValue("--accent-rgb").trim();
      
      // Draw theme specific backgrounds
      if (currentStyle === 0) {
        draw3DGrid(currentHue, currentAccent);
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
          p.vx *= 0.97; p.vy *= 0.97;
          p.vx += (Math.random() - 0.5) * 0.22;
          p.vy += (Math.random() - 0.5) * 0.22;
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * devicePixelRatio, 0, Math.PI * 2); ctx.fill();
        }
        for (let i = 0; i < neonParticles.length; i++) {
          for (let j = i + 1; j < neonParticles.length; j++) {
            const a = neonParticles[i]; const b = neonParticles[j];
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < neonConfig.maxDist * devicePixelRatio) {
              ctx.globalAlpha = 1 - d / (neonConfig.maxDist * devicePixelRatio);
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            }
          }
        }
        ctx.globalAlpha = 1;
        
      } else if (currentStyle === 1) {
        const interval = 40 / matrixConfig.speedCoeff;
        if (nowTime - lastMatrixTime > interval) {
          lastMatrixTime = nowTime;
        }
        ctx.fillStyle = "rgba(0, 8, 0, 0.15)";
        ctx.fillRect(0, 0, width, height);
        const fontSizePx = matrixConfig.fontSize * devicePixelRatio;
        ctx.font = `bold ${fontSizePx}px monospace`;
        for (let i = 0; i < matrixDrops.length; i++) {
          const text = matrixConfig.chars[Math.floor(Math.random() * matrixConfig.chars.length)];
          const x = i * fontSizePx;
          const y = matrixDrops[i] * fontSizePx;
          if (Math.random() > 0.982) { ctx.fillStyle = "#ffffff"; }
          else { ctx.fillStyle = `hsla(${currentHue}, 100%, 50%, 0.8)`; }
          if (y > 0) { ctx.fillText(text, x, y); }
          if (y > height && Math.random() > matrixConfig.density) { matrixDrops[i] = 0; }
          matrixDrops[i]++;
        }
        
      } else if (currentStyle === 2) {
        draw3DGrid(currentHue, currentAccent);
        for (const b of nebulaBlobs) {
          b.x += b.vx; b.y += b.vy;
          if (b.x - b.r < 0 || b.x + b.r > width) b.vx *= -1;
          if (b.y - b.r < 0 || b.y + b.r > height) b.vy *= -1;
          const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
          const targetHue = (Number(currentHue) + b.hueShift + 360) % 360;
          grad.addColorStop(0, `hsla(${targetHue}, 80%, 50%, 0.12)`);
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
        }
        
      } else if (currentStyle === 3) {
        for (let i = 0; i < solarSparks.length; i++) {
          const s = solarSparks[i];
          if (pointer.active) {
            const dx = s.x - pointer.x; const dy = s.y - pointer.y;
            const d = Math.hypot(dx, dy);
            if (d < 150 * devicePixelRatio) {
              s.vx += (dx / Math.max(d, 1)) * 0.12; s.vy -= 0.05;
            }
          }
          s.x += s.vx; s.y += s.vy; s.alpha -= s.decay;
          if (s.alpha <= 0 || s.y < 0 || s.x < 0 || s.x > width) {
            solarSparks[i] = createSolarSpark(true);
          } else {
            ctx.fillStyle = `hsla(${Number(currentHue) + (s.alpha * 20)}, 95%, 60%, ${s.alpha * 0.6})`;
            ctx.beginPath(); ctx.arc(s.x, s.y, s.r * devicePixelRatio, 0, Math.PI * 2); ctx.fill();
          }
        }
        
      } else if (currentStyle === 4) {
        // Theme 4: Vectr Light minimal lines wiggling
        ctx.strokeStyle = `rgba(${accentRgb}, 0.05)`;
        ctx.lineWidth = 1;
        vectrLines.forEach(l => {
          const offset = Math.sin(nowTime * 0.001 + l.seed) * 30 * devicePixelRatio;
          const y = l.ratio * height + offset;
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        });
        
      } else if (currentStyle === 5) {
        // Theme 5: Origami geometric facets wiggling
        ctx.strokeStyle = `rgba(${accentRgb}, 0.06)`;
        ctx.lineWidth = 1;
        origamiNodes.forEach(node => {
          node.x += node.vx; node.y += node.vy;
          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;
        });
        for (let i = 0; i < origamiNodes.length; i++) {
          for (let j = i + 1; j < origamiNodes.length; j++) {
            const d = Math.hypot(origamiNodes[i].x - origamiNodes[j].x, origamiNodes[i].y - origamiNodes[j].y);
            if (d < 180 * devicePixelRatio) {
              ctx.beginPath(); ctx.moveTo(origamiNodes[i].x, origamiNodes[i].y);
              ctx.lineTo(origamiNodes[j].x, origamiNodes[j].y); ctx.stroke();
            }
          }
        }
        
      } else if (currentStyle === 6) {
        // Theme 6: Liquid Glass morphing blobs
        for (const b of liquidBlobs) {
          b.x += b.vx; b.y += b.vy;
          if (b.x - b.r < 0 || b.x + b.r > width) b.vx *= -1;
          if (b.y - b.r < 0 || b.y + b.r > height) b.vy *= -1;
          const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
          grad.addColorStop(0, `hsla(${currentAccent}, 90%, 60%, 0.07)`);
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
        }
        
      } else if (currentStyle === 7) {
        // Theme 7: Retro scan lines & concentric circular radar grids
        ctx.strokeStyle = `rgba(255, 140, 0, 0.06)`;
        ctx.lineWidth = 1.5;
        const radarCenterY = height * 0.5;
        const radarCenterX = width * 0.5;
        for (let r = 80; r < Math.max(width, height); r += 120) {
          const oscR = r + Math.sin(nowTime * 0.002) * 15;
          ctx.beginPath(); ctx.arc(radarCenterX, radarCenterY, oscR, 0, Math.PI * 2); ctx.stroke();
        }
        
      } else if (currentStyle === 8) {
        // Theme 8: Zen Garden concentric ripple waves wiggling
        if (pointer.active && Math.random() > 0.94) {
          zenRipples.push({ x: pointer.x, y: pointer.y, r: 5, alpha: 0.8 });
        }
        ctx.lineWidth = 1.2;
        zenRipples.forEach((rip, idx) => {
          rip.r += 1.5; rip.alpha -= 0.007;
          if (rip.alpha <= 0) {
            zenRipples.splice(idx, 1);
          } else {
            ctx.strokeStyle = `rgba(${accentRgb}, ${rip.alpha * 0.15})`;
            ctx.beginPath(); ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2); ctx.stroke();
          }
        });
      }
      
      // Draw 3D shape matching active section
      const isMobile = window.innerWidth <= 768;
      const cx = isMobile ? width * 0.5 : width * 0.7;
      const cy = isMobile ? height * 0.5 : height * 0.55;
      const opacityCoeff = isMobile ? 0.28 : 0.85;
      
      let activeLines = [];
      let isGrid = false;
      
      if (currentSection === "01") {
        activeLines = buildingLines;
      } else if (currentSection === "02") {
        activeLines = factoryLines;
      } else if (currentSection === "03") {
        isGrid = true;
      } else {
        activeLines = arrowLines;
      }
      
      const rotTime = nowTime * 0.0006;
      const rotMouseX = pointer.active ? ((pointer.x / width) - 0.5) * 0.8 : 0;
      const rotMouseY = pointer.active ? ((pointer.y / height) - 0.5) * -0.8 : 0;
      
      const angleY = rotTime + rotMouseX;
      const angleX = rotMouseY + Math.sin(nowTime * 0.0003) * 0.25;
      
      const shapeColor = (currentStyle === 4 || currentStyle === 5 || currentStyle === 8) 
        ? `rgba(${accentRgb}, ${opacityCoeff * 0.35})`
        : `hsla(${currentAccent}, 100%, 65%, ${opacityCoeff})`;
        
      if (isGrid) {
        // Draw 3D tiled grid
        const sizeVal = 22 * devicePixelRatio;
        const gapVal = 12 * devicePixelRatio;
        const range = 2;
        const cosY = Math.cos(angleY); const sinY = Math.sin(angleY);
        const cosX = Math.cos(angleX); const sinX = Math.sin(angleX);
        const focal = 350;
        
        for (let r = -range; r <= range; r++) {
          for (let c = -range; c <= range; c++) {
            const origX = c * (sizeVal + gapVal);
            const origZ = r * (sizeVal + gapVal);
            const d = Math.hypot(origX, origZ);
            const origY = Math.sin(d * 0.008 - nowTime * 0.0035) * 16 * devicePixelRatio;
            
            let rx = origX * cosY - origZ * sinY;
            let rz = origX * sinY + origZ * cosY;
            let ry = origY * cosX - rz * sinX;
            rz = origY * sinX + rz * cosX;
            
            const scale = focal / (focal + rz);
            const projX = rx * scale + cx;
            const projY = ry * scale + cy;
            
            ctx.strokeStyle = shapeColor;
            ctx.lineWidth = 1;
            ctx.strokeRect(projX - (sizeVal * scale)/2, projY - (sizeVal * scale)/2, sizeVal * scale, sizeVal * scale);
          }
        }
      } else {
        ctx.lineWidth = 1.5;
        activeLines.forEach(line => {
          const scaledLine = {
            x1: line.x1 * devicePixelRatio, y1: line.y1 * devicePixelRatio, z1: line.z1 * devicePixelRatio,
            x2: line.x2 * devicePixelRatio, y2: line.y2 * devicePixelRatio, z2: line.z2 * devicePixelRatio
          };
          draw3DLine(scaledLine, angleX, angleY, cx, cy, shapeColor, currentStyle);
        });
      }
      
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  // 3D Owner Name Typography Particle Canvas Engine
  class NameParticleEngine {
    constructor() {
      this.particles = [];
      this.text = "Tushar Mathapati";
      this.styleIndex = 0;
      this.canvases = [];
      this.offscreen = document.createElement("canvas");
      this.offCtx = this.offscreen.getContext("2d");
      this.time = 0;
      this.mouse = { x: 0, y: 0, active: false };
      
      this.updateCanvases();
      this.generateParticles();
      
      window.addEventListener("mousemove", (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.mouse.active = true;
      });
      window.addEventListener("mouseleave", () => {
        this.mouse.active = false;
      });
      
      setInterval(() => {
        this.styleIndex = (this.styleIndex + 1) % 4;
      }, 10000);
      
      this.tick();
    }
    
    updateCanvases() {
      this.canvases = [
        document.querySelector("#lock-name-canvas"),
        document.querySelector("#home-name-canvas")
      ].filter(c => c !== null);
      
      this.canvases.forEach(canvas => {
        if (!canvas.dataset.initialized) {
          canvas.dataset.initialized = "true";
          const resize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * devicePixelRatio;
            canvas.height = rect.height * devicePixelRatio;
          };
          resize();
          window.addEventListener("resize", resize);
        }
      });
    }
    
    generateParticles() {
      this.offscreen.width = 440;
      this.offscreen.height = 110;
      this.offCtx.fillStyle = "white";
      this.offCtx.font = "900 36px 'Outfit', sans-serif";
      this.offCtx.textAlign = "center";
      this.offCtx.textBaseline = "middle";
      this.offCtx.fillText(this.text, 220, 55);
      
      const imgData = this.offCtx.getImageData(0, 0, 440, 110);
      this.particles = [];
      const step = 4;
      
      for (let y = 0; y < 110; y += step) {
        for (let x = 0; x < 440; x += step) {
          const idx = (y * 440 + x) * 4;
          if (imgData.data[idx] > 200) {
            this.particles.push({
              origX: x - 220, origY: y - 55, origZ: 0,
              x: x - 220, y: y - 55, z: 0,
              vx: 0, vy: 0, vz: 0
            });
          }
        }
      }
    }
    
    tick() {
      this.time += 16.67;
      this.updateCanvases();
      
      this.canvases.forEach(canvas => {
        if (canvas.offsetWidth === 0) return;
        
        const ctx = canvas.getContext("2d");
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        
        const cx = w / 2;
        const cy = h / 2;
        
        const currentHue = getComputedStyle(document.documentElement).getPropertyValue("--hue").trim() || 190;
        const currentAccent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || 320;
        
        const rotY = (this.time * 0.001);
        const rotX = this.mouse.active ? ((this.mouse.y / window.innerHeight) - 0.5) * 0.5 : 0;
        
        const cosY = Math.cos(rotY); const sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX); const sinX = Math.sin(rotX);
        const focal = 250;
        
        this.particles.forEach(p => {
          let targetX = p.origX;
          let targetY = p.origY;
          let targetZ = p.origZ;
          let color = `hsla(${currentHue}, 90%, 65%, 0.8)`;
          
          if (this.styleIndex === 0) {
            const skewVal = this.mouse.active ? ((this.mouse.x / window.innerWidth) - 0.5) * 45 : 0;
            targetZ = skewVal;
            color = `hsla(${currentHue}, 100%, 70%, 0.85)`;
          } else if (this.styleIndex === 1) {
            if (this.mouse.active) {
              const canvasRect = canvas.getBoundingClientRect();
              const mouseCanvasX = (this.mouse.x - canvasRect.left) * (w / canvasRect.width) - cx;
              const mouseCanvasY = (this.mouse.y - canvasRect.top) * (h / canvasRect.height) - cy;
              const dx = p.x - mouseCanvasX; const dy = p.y - mouseCanvasY;
              const dist = Math.hypot(dx, dy);
              if (dist < 100) {
                const force = (100 - dist) * 0.55;
                targetX += (dx / dist) * force; targetY += (dy / dist) * force; targetZ += force;
                color = `hsla(${currentAccent}, 100%, 65%, 0.95)`;
              }
            }
          } else if (this.styleIndex === 2) {
            const speed = this.time * 0.003;
            const theta = p.origX * 0.05 + speed;
            targetZ = Math.sin(theta) * 20;
            targetY = p.origY + Math.cos(theta) * 10;
            color = `hsla(${(Number(currentHue) + Math.sin(theta) * 30) % 360}, 95%, 65%, 0.85)`;
          } else {
            const compileTime = (this.time % 10000) / 10000;
            if (compileTime < 0.3) {
              const fallY = ((p.origX + 220) * 0.015 + this.time * 0.02) % 110 - 55;
              targetY = fallY; targetZ = Math.sin(p.origX * 0.1) * 30;
              color = `rgba(0, 255, 102, ${Math.random() * 0.9})`;
            } else {
              targetZ = Math.sin(this.time * 0.005 + p.origX * 0.1) * 10;
              color = `hsla(${120 + Math.sin(this.time * 0.001) * 30}, 100%, 50%, 0.8)`;
            }
          }
          
          p.vx += (targetX - p.x) * 0.15;
          p.vy += (targetY - p.y) * 0.15;
          p.vz += (targetZ - p.z) * 0.15;
          p.vx *= 0.82; p.vy *= 0.82; p.vz *= 0.82;
          p.x += p.vx; p.y += p.vy; p.z += p.vz;
          
          let rx = p.x * cosY - p.z * sinY;
          let rz = p.x * sinY + p.z * cosY;
          let ry = p.y * cosX - rz * sinX;
          rz = p.y * sinX + rz * cosX;
          
          const scale = focal / (focal + rz);
          const projX = rx * scale + cx;
          const projY = ry * scale + cy;
          
          const sizeVal = Math.max(1, scale * 2.2);
          ctx.fillStyle = color;
          ctx.fillRect(projX - sizeVal/2, projY - sizeVal/2, sizeVal, sizeVal);
        });
      });
      requestAnimationFrame(() => this.tick());
    }
  }

  // Update active file viewer to use embedded View 03 instead of fallback Dialog
  function previewFile(file) {
    // If the folder is locked, show the secure link lock dialog first
    const isUnlocked = state.isGuest || !file.folder || file.folder === "Root" || state.unlockedFolders.has(file.folder);
    if (!isUnlocked) {
      showLinkLockDialog(file);
      return;
    }
    
    const url = fileUrl(file);
    
    const titleEl = document.querySelector("#active-preview-title");
    const downloadEl = document.querySelector("#active-download-link");
    const closeEl = document.querySelector("#close-active-preview");
    const bodyEl = document.querySelector("#active-preview-body");
    
    titleEl.textContent = file.name;
    downloadEl.href = url;
    downloadEl.download = file.name;
    downloadEl.classList.remove("hidden");
    closeEl.classList.remove("hidden");
    bodyEl.innerHTML = "";
    
    const textExtensions = [".json", ".js", ".css", ".html", ".xml", ".csv", ".yaml", ".yml", ".py", ".sh", ".ini", ".conf"];
    
    if (file.ext === ".md") {
      const rawText = bytesToText(base64ToBytes(file.content));
      bodyEl.innerHTML = renderMarkdown(rawText);
    } else if (file.mime.startsWith("text/") || textExtensions.includes(file.ext)) {
      const pre = document.createElement("pre");
      pre.textContent = bytesToText(base64ToBytes(file.content));
      bodyEl.append(pre);
    } else if (file.mime.startsWith("image/")) {
      const img = document.createElement("img");
      img.src = url;
      img.alt = file.name;
      bodyEl.append(img);
    } else if (file.ext === ".pdf") {
      const frame = document.createElement("iframe");
      frame.src = url;
      frame.title = file.name;
      bodyEl.append(frame);
    } else {
      const p = document.createElement("p");
      p.textContent = "Preview is not available for this file type. Use Download.";
      bodyEl.append(p);
    }
    
    navigateToSection("03"); // Open Section 03: DOC PREVIEW
  }

  // Clear current document viewer
  const clearPreviewBtn = document.querySelector("#close-active-preview");
  if (clearPreviewBtn) {
    clearPreviewBtn.addEventListener("click", () => {
      document.querySelector("#active-preview-title").textContent = "No document loaded";
      document.querySelector("#active-download-link").classList.add("hidden");
      document.querySelector("#close-active-preview").classList.add("hidden");
      document.querySelector("#active-preview-body").innerHTML = `
        <div class="empty-preview-placeholder">
          <div class="placeholder-icon"></div>
          <p>Select a document from the <a href="#" class="navigate-to-explorer">Vault Explorer</a> to view its decrypted contents here.</p>
        </div>
      `;
    });
  }

  // Start visual effects & typography name engine
  startCanvas();
  const nameEngine = new NameParticleEngine();

  // Setup audio toggle button binding
  const audioBtn = document.querySelector("#audio-toggle-btn");
  if (audioBtn) {
    VaultAudio.updateButtonUI();
    audioBtn.addEventListener("click", () => {
      VaultAudio.toggleMute();
    });
  }

  // Bind keypress sounds to passcode input
  if (el.password) {
    el.password.addEventListener("input", () => {
      VaultAudio.playChirp();
    });
  }

  // Trailing Spring Cursor Lerp System
  let cursorX = 0, cursorY = 0;
  let targetX = 0, targetY = 0;
  const spring = 0.18;
  const cursorEl = document.querySelector("#custom-cursor");

  window.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function updateCursor() {
    cursorX += (targetX - cursorX) * spring;
    cursorY += (targetY - cursorY) * spring;
    if (cursorEl) {
      cursorEl.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    }
    requestAnimationFrame(updateCursor);
  }
  requestAnimationFrame(updateCursor);

  // Custom cursor hover expansions
  document.addEventListener("mouseover", (e) => {
    const interactive = e.target.closest("a, button, input, .folder-card, .file-card, .crumb, .nav-item");
    if (cursorEl) {
      if (interactive) {
        cursorEl.classList.add("hovering");
      } else {
        cursorEl.classList.remove("hovering");
      }
    }
  });

  // Document Viewer Full Screen Option
  const fullscreenBtn = document.querySelector("#active-fullscreen-btn");
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", () => {
      const viewerBody = document.querySelector("#active-preview-body");
      if (viewerBody) {
        if (!document.fullscreenElement) {
          viewerBody.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
          });
        } else {
          document.exitFullscreen();
        }
      }
    });
  }
