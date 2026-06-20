# Knowledge OS ChronoVault

Private static document portal for Tushar Mathapati's Knowledge OS vault.

## How it works

- Push changes to `main`.
- GitHub Actions builds the site.
- The build script scans supported vault files and encrypts them into `dist/vault-data.json`.
- GitHub Pages deploys the static site.
- In the browser, enter today's code: `DD + MM + 10`, padded to 4 digits.

Example for June 20: `20 + 6 + 10 = 36`, so the code is `0036`.

Folder cards use a second simple lock: choose the letter that comes last alphabetically.

## Deploy

1. Commit and push these files to GitHub.
2. In GitHub, open the repository settings.
3. Go to **Pages**.
4. Set **Source** to **GitHub Actions**.
5. Push to `main`, or run the workflow manually from the **Actions** tab.

Your site will be available at:

`https://tushar-470.github.io/Knowledge-OS/`

## Local build

```bash
npm ci
npm run build
npm run dev
```

The preview server runs at `http://localhost:4173`.

## Security note

This is strong privacy for a static GitHub Pages portal, but no static website can provide the same secrecy as a server-controlled private account. The deployed files are encrypted, but the app code is public, so use this for personal convenience rather than highly sensitive secrets.
