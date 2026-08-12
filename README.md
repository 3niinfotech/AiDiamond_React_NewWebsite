# AiDiamond React New Website (Royal Rays BV)

Official marketing website for **Royal Rays BV** — diamond manufacturing and lapidary, built as a modern single-page React application.

## Tech Stack

- **React 18** with **Vite 4**
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **GSAP** + **Framer Motion** for animations and scroll effects
- **Lenis** for smooth scrolling
- **Swiper** for carousels

## Prerequisites

- Node.js 18+ recommended
- npm (project uses `package-lock.json`)

## Installation

```bash
npm install
```

## Environment Variables

Copy the example file and configure API endpoints:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Base URL for Royal Rays API services |
| `VITE_BLOG_API_URL` | Blog API endpoint (used by blog pages) |

Values are optional for local development if defaults in code are sufficient.

## Development

```bash
npm run dev
```

Runs Vite dev server (default port **3000**, opens browser).

## Production Build

```bash
npm run build
```

Output is generated in the `dist/` folder.

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
src/
  components/   # Shared UI and layout
  pages/        # Route-level pages (Home, About, Diamonds, Events, etc.)
  assets/       # Images, SVGs, fonts
  routes/       # Application routing
  services/     # API / data services
public/         # Static public assets
```

## Deployment Notes

- Build with `npm run build` and deploy the `dist/` directory to any static host (Vercel, Netlify, S3, etc.).
- Set `VITE_*` environment variables in your hosting provider before building.
- Do not commit `.env` files to version control.

## License

Proprietary — Royal Rays BV / 3ni Infotech.
