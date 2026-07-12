# Handoff — Aishwarya's Educator Website

A starting handoff for continuing the personal website in a **new folder / new conversation**.

## What this project is
A polished, **self-contained personal website** for Aishwarya as a computer-science educator.
One file, no build step, ready for GitHub Pages.

## Where the file is now (MOVE IT)
- `course_COA/teacher-website/index.html`  ← the website (and this handoff)
- **Action:** copy the `teacher-website` folder into your **new website folder/repo**, then connect
  that folder at the start of the new conversation. The site does not depend on anything in
  `course_COA`, so it moves cleanly.

## Decisions already locked (from our Q&A)
- **Sections:** About · Subjects I teach · Courses & resources · Contact
- **Style:** Modern dark (matches the COA course palette, so it feels like one family)
- **Hosting:** GitHub Pages
- **Content rules:** no "where I work" details; **you will write the subject descriptions**

## What's DONE vs what YOU should fill in
Done: full responsive layout, sticky glass nav, animated hero, About, a 6-card Subjects grid
(COA seeded with a real blurb), Courses & resources cards, Contact with your email, scroll-reveal
animations, mobile menu.

To personalise (all inside `index.html`, search for these markers):
- `EDIT:NAME` — confirm/adjust the display name (currently "Aishwarya")
- `EDIT:ABOUT` — your bio + hero tagline (placeholder text is in your voice; refine it)
- `EDIT:SUBJECTS` — write real descriptions for AI/ML, Cybersecurity, IoT, Digital Logic; add/remove cards
- `EDIT:LINKS` — set the real URLs for the Foothold course, classroom slides, notes (currently `#`)
- `EDIT:CONTACT` — email is set to `aishwarya.bramma@gmail.com`

## How to deploy to GitHub Pages
1. Put `index.html` at the **root** of a new GitHub repo (e.g. `aishwarya-site`).
2. Push to `main`.
3. Repo → **Settings → Pages** → Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Live at `https://<username>.github.io/<repo>/` in ~1 minute.
   (Because it's a plain static file, no Actions/Vite config needed — unlike the COA course.)

## Nice next steps (ideas for the new conversation)
- Real subject write-ups + a photo/avatar in the hero.
- A "Teaching approach" section, or a small "Student projects / gallery".
- Link the live Foothold course + deck once their URLs are known.
- Optional: light/dark toggle; a favicon; social/academic links (Google Scholar, LinkedIn) if wanted.

## Sidebar: state of the COA course (so context isn't lost)
Separate project in `course_COA` — already in good shape:
- Classroom deck: `classroom/Unit0/Unit0_Deck.html` (49 slides; has a "Download as PDF" button).
- Foothold interactive course: `src/lessons/Unit0_1..0_4.jsx`; config in `config/course.config.js`.
- **Build caveat:** in this sandbox the Linux shell served stale cached copies of freshly-edited
  files, so `esbuild`/`npm run build` could not verify the JSX here. Files are correct on disk
  (verified via the editor). Always run `npm run dev` / `npm run build` locally as the real check.
- Shrink section images live in `public/shrink/*.jpg`, referenced with base `"/course_COA/"`.
