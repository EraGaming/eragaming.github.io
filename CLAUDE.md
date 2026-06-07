# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Local development
bundle exec jekyll serve

# Production build
bundle exec jekyll build

# Install dependencies
bundle install
```

## Architecture

This is a Jekyll 4.3.2 static site for Endless ERA Gaming, deployed to GitHub Pages via GitHub Actions.

### Creator Pages

Creator data lives in `_data/ContentCreators.yml` — edit this file directly to add, update, or remove creators. Creator images are stored locally under `assets/images/creators/<creator-slug>/`.

`_config.yml` uses `jekyll-datapage-generator` to auto-generate one page per creator entry in `ContentCreators.yml`, rendered with `_layouts/creator.html`.

The GitHub Actions workflow (`.github/workflows/jekyll.yml`) runs on push to `main` only.

### Store / Shopify integration

Each product page lives in `_store/` with `layout: merch` and a `product-id` front matter field. `_layouts/merch.html` embeds the Shopify Buy Button SDK pointing to `endlessera.myshopify.com`, injecting the `product-id` at render time. The storefront access token is hardcoded in the merch layout (it's a public Shopify storefront token, not a secret).

### Collections

Six collections are defined in `_config.yml`: `creators`, `posts`, `store`, `uploads`, `jobs`, `gallery`. All output pages. The `store` collection sorts by `date`.

### Creator page conditional sections

`_layouts/creator.html` renders sections conditionally based on front matter fields set in `ContentCreators.yml`:
- `showtwitchonpage: true` → embeds live Twitch player (allowed origins: `eragaming.ca`, `127.0.0.1`, `localhost`)
- `merch: true` → shows a carousel of `_store/` items whose `tags` contain the creator's `displayname`
- `showgallery: true` → renders the creator's `gallery` image array as a lightbox grid

### Navigation

Site navigation is defined in `_data/menu.yml` and supports one level of submenus. Creator sublinks are manually maintained in this file and must be updated when creators are added/removed.
