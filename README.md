# rezar771.github.io

Personal portfolio of Amirreza Rahimi — AI / ML Engineer. Astro 5 + three.js, static output.

```bash
npm install
npm run data      # re-export CV facts from ~/cv/cv_render.py and copy the latest CV PDF
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
```

- `src/data/cv.json` is generated from `~/cv/cv_render.py` — edit the CV there, then `npm run data`.
- `src/data/projects.ts` holds site-only project metadata (pipelines, metrics, media).
- Media lives in `public/media/` (WebP stills, short muted MP4 loops).
