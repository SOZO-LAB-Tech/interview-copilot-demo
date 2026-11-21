# Interview Copilot · Demo

A static, self-contained demo of the SOZO LAB Interview Copilot (Nestlé Vietnam scenario).
It is plain HTML, CSS and JavaScript with no build step and no backend: the "call",
transcript, evidence capture and coverage tracking are all scripted inside `app.js`.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | Page shell: the markup regions the app renders into, plus the font and script links |
| `styles.css` | All styling. Light/dark themes via CSS variables (`prefers-color-scheme` and `data-theme`) |
| `app.js` | The whole app: icons, scripted people and dialogue, job map, copilot panel, lobby, wrap-up |
| `assets/` | Logo and the two participant stills (`.webp`) |
| `.nojekyll` | Tells GitHub Pages to serve the folder as-is |

Everything is relative-path, so the site works from the repo root or from a sub-path
such as `https://<user>.github.io/<repo>/`.

## Run locally

Any static file server works. For example:

```bash
python3 -m http.server 8765
```

Then open <http://localhost:8765>.

Opening `index.html` straight from the file system also works in most browsers,
but a server is closer to how it will be hosted.

## Deploy on GitHub Pages

1. Create a GitHub repository and push this folder to it (the files sit at the repo root).
2. In the repo go to **Settings → Pages**.
3. Under **Build and deployment** choose **Deploy from a branch**, pick your branch
   (usually `main`) and the `/ (root)` folder, then save.
4. After a minute the site is live at `https://<user>.github.io/<repo>/`.

No GitHub Actions workflow is needed because there is nothing to build.

## Put Cloudflare in front

Two common options:

**Cloudflare Pages (simplest):** in the Cloudflare dashboard choose
*Workers & Pages → Create → Pages → Connect to Git*, pick the repo, leave the build
command empty and set the output directory to `/`. Cloudflare serves the files directly
and you can attach a custom domain there.

**Cloudflare DNS in front of GitHub Pages:** add your custom domain in
*Settings → Pages → Custom domain* on GitHub, then in Cloudflare DNS add a `CNAME`
record pointing the domain at `<user>.github.io`. Keep the record proxied (orange cloud)
and set SSL/TLS mode to **Full** so the GitHub certificate is honoured.

## Demo flow

- **Lobby:** tick the consent box and press **Join Interview**.
- **Call:** the scripted conversation plays on its own. Use the right-hand **Copilot** panel to
  pick, reword or skip suggested questions and to advance the job-map framework.
- **Theme:** the **Dark mode** switch in the top bar toggles light and dark mode.
- **Wrap-up:** end the call with the red button to see the summary screen.
