# Astro Tailwind Config Viewer: Integration Package

This is an Astro integration with Dev App Toolbar access to Tailwind config viewer. Inspired by [Florian Lefebvre](https://github.com/florian-lefebvre/astro-tailwind-config-viewer)

## Install from Github

```sh
pnpm install github:jllahi/astro-tailwind-config-viewer
```

## Configure astro.config.mjs

```js
import { defineConfig } from 'astro/config'
import tailwindConfigViewer from 'astro-tailwind-config-viewer'

// https://astro.build/config
export default defineConfig({
	integrations: [tailwindConfigViewer(
		viewer: {
		  endpoint: "/_tailwind",
		  overlayMode: "embed",
	  },
	)],
})
```
