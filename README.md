# Suraj's portfolio and blog

This repository now runs the personal site at <https://freesuraj.github.io> on Astro 6.

## Stack

- Astro 6
- TypeScript (strict)
- Astro content collections for blog posts
- Static output with sitemap and RSS

## Running locally

```bash
npm install
npm run dev
```

The dev server runs at: <http://127.0.0.1:4321>

## Build

```bash
npm run build
npm run preview
```

## Structure

- `src/pages`: routes for the portfolio, blog, and legacy redirects
- `src/content/blog`: markdown blog posts migrated from the old Jekyll site
- `src/data/site.ts`: typed portfolio data for projects, talks, resume, and social links
- `public/assets`: static media such as podcast audio and images

## Contact

You can reach out at <mailto:freesuraj@gmail.com>.
