# seption.org

The public website for **Seption** — a relational computing ecosystem.
Software to be in better relationship with ourselves, our computers, and each other.

## Structure

Plain static HTML/CSS with no build step:

- `index.html` — landing page: the what, why, and how
- `compass.html` — our values: right relationship, natural law, the seven values
- `work.html` — design interventions, the RDF editor prototype, the technical thesis
- `assets/` — stylesheet, self-hosted fonts (Newsreader, Public Sans, IBM Plex Mono), logo, and the hero constellation script

## Deployment

Pushed to `main` → deployed to [seption.org](https://seption.org) by the GitHub Pages
workflow in `.github/workflows/deploy.yml`. No dependencies, no build.

To preview locally:

```sh
python3 -m http.server 8080
```
