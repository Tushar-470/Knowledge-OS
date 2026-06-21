import { createCipheriv, pbkdf2Sync, randomBytes } from "node:crypto";
import { copyFile, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const vaultRoot = path.join(root, "Knowledge-OS");
const srcDir = path.join(root, "src");
const distDir = path.join(root, "dist");
const secretNumber = String(process.env.CHRONOVAULT_SECRET_NUMBER || "11");
const owner = process.env.CHRONOVAULT_OWNER || "Tushar Mathapati";
const salt = "chronovault:knowledge-os:tushar:v1";
const iterations = 600000;
const excludeDirs = new Set([".git", ".github", ".obsidian", "dist", "node_modules", "public", "scripts", "src"]);
const excludeFiles = new Set(["package.json", "package-lock.json", "robots.txt", "sitemap.xml"]);
const includeExtensions = new Set([
  ".md", ".txt", ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".csv",
  ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg",
  ".json", ".js", ".css", ".html", ".xml", ".yaml", ".yml", ".py", ".sh"
]);

function toWebPath(filePath) {
  return filePath.split(path.sep).join("/");
}

function mimeFor(ext) {
  const map = {
    ".md": "text/markdown; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".csv": "text/csv; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".json": "application/json; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".xml": "application/xml; charset=utf-8",
    ".yaml": "text/yaml; charset=utf-8",
    ".yml": "text/yaml; charset=utf-8",
    ".py": "text/x-python; charset=utf-8",
    ".sh": "text/x-shellscript; charset=utf-8"
  };
  return map[ext] || "application/octet-stream";
}

async function walk(dir, base = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory() && excludeDirs.has(entry.name)) continue;
    const absolute = path.join(dir, entry.name);
    const relative = path.join(base, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(absolute, relative));
      continue;
    }
    if (!entry.isFile()) continue;
    if (excludeFiles.has(entry.name)) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!includeExtensions.has(ext)) continue;
    files.push({ absolute, relative });
  }
  return files;
}

function encryptJson(payload) {
  const iv = randomBytes(12);
  const key = pbkdf2Sync(secretNumber, salt, iterations, 32, "sha256");
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    version: 1,
    app: "ChronoVault",
    owner,
    kdf: { name: "PBKDF2", hash: "SHA-256", iterations, salt },
    cipher: { name: "AES-GCM", iv: iv.toString("base64"), tag: tag.toString("base64") },
    data: encrypted.toString("base64"),
    generatedAt: new Date().toISOString()
  };
}

async function copyDir(from, to) {
  await mkdir(to, { recursive: true });
  const entries = await readdir(from, { withFileTypes: true });
  for (const entry of entries) {
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);
    if (entry.isDirectory()) {
      await copyDir(source, target);
    } else if (entry.isFile()) {
      await copyFile(source, target);
    }
  }
}

console.log("Scanning vault files...");
const files = await walk(vaultRoot);
console.log(`Found ${files.length} candidate files.`);
const privateFiles = [];
const publicFiles = [];
const privateFolderMap = new Map();
const publicFolderMap = new Map();

for (const file of files) {
  const data = await readFile(file.absolute);
  const info = await stat(file.absolute);
  const ext = path.extname(file.relative).toLowerCase();
  const folder = toWebPath(path.dirname(file.relative) === "." ? "Root" : path.dirname(file.relative));
  
  const record = {
    id: Buffer.from(file.relative).toString("base64url"),
    name: path.basename(file.relative),
    path: toWebPath(file.relative),
    folder,
    ext,
    mime: mimeFor(ext),
    size: info.size,
    modified: info.mtime.toISOString(),
    content: data.toString("base64")
  };
  
  const isPublic = folder === "Public" || folder.startsWith("Public/");
  if (isPublic) {
    publicFiles.push(record);
    if (!publicFolderMap.has(folder)) publicFolderMap.set(folder, { name: folder, count: 0 });
    publicFolderMap.get(folder).count += 1;
  }
  
  // All files (both public and private) are included in the private owner payload
  privateFiles.push(record);
  if (!privateFolderMap.has(folder)) privateFolderMap.set(folder, { name: folder, count: 0 });
  privateFolderMap.get(folder).count += 1;
}

const privatePayload = {
  owner,
  generatedAt: new Date().toISOString(),
  files: privateFiles,
  folders: [...privateFolderMap.values()].sort((a, b) => a.name.localeCompare(b.name))
};

const publicPayload = {
  owner,
  generatedAt: new Date().toISOString(),
  files: publicFiles,
  folders: [...publicFolderMap.values()].sort((a, b) => a.name.localeCompare(b.name))
};

console.log("Encrypting private vault payload...");
const encryptedPayload = encryptJson(privatePayload);
console.log("Writing static site...");
await rm(distDir, { recursive: true, force: true });
await copyDir(srcDir, distDir);
await writeFile(path.join(distDir, "vault-data.json"), JSON.stringify(encryptedPayload));
await writeFile(path.join(distDir, "public-data.json"), JSON.stringify(publicPayload));
await writeFile(path.join(distDir, "404.html"), await readFile(path.join(srcDir, "index.html"), "utf8"));
await writeFile(path.join(distDir, ".nojekyll"), "");
await writeFile(path.join(distDir, "robots.txt"), "User-agent: *\nAllow: /\nDisallow: /vault-data.json\nDisallow: /public-data.json\nSitemap: /sitemap.xml\n");
await writeFile(path.join(distDir, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://tushar-470.github.io/Knowledge-OS/</loc></url>\n</urlset>\n`);

console.log(`ChronoVault built with ${privateFiles.length} private encrypted files inside ${privateFolderMap.size} folders, and ${publicFiles.length} public files inside ${publicFolderMap.size} folders.`);
