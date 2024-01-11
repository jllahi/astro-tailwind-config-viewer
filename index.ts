import type { AstroConfig, AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";
import { joinURL } from "ufo";
import { setupViewer } from "./src/viewer";
import { virtualImportsPlugin } from "./src/virtual-imports";
import { dirname, join } from "node:path";

export type Options = {
	viewer:
	| {
		endpoint: string;
		overlayMode: "embed" | "redirect";
	}
	| boolean;
};

const DEFAULT_OPTIONS = {
	viewer: {
		endpoint: "/_tailwind",
		overlayMode: "redirect",
	},
} satisfies Options;

export const tailwindConfigViewer = ({
	viewer = true,
}: Partial<Options> = {}): AstroIntegration => {
	const options = { viewer };
	const viewerOptions: Exclude<Options["viewer"], true> = options.viewer
		? options.viewer === true
			? DEFAULT_OPTIONS.viewer
			: { ...DEFAULT_OPTIONS.viewer, ...options.viewer }
		: false;

	let config: AstroConfig;
	let viewerPrefix: string;

	return {
		name: "astro-tailwind-config-viewer",
		hooks: {
			"astro:config:setup": ({
				config: _config,
				addWatchFile,
				addDevToolbarApp,
				updateConfig,
				logger,
			}) => {
				addWatchFile(fileURLToPath(import.meta.url));
				config = _config;

				if (viewerOptions) {
					viewerPrefix = joinURL(config.base, viewerOptions.endpoint);
					logger.info(`Tailwind config viewer is available at ${viewerPrefix}`);
					// https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
					const __filename = fileURLToPath(import.meta.url);
					const __dirname = dirname(__filename);
					addDevToolbarApp(join(__dirname, "./src/plugin.ts"));

					updateConfig({
						vite: {
							plugins: [
								virtualImportsPlugin({
									viewerLink: viewerPrefix,
									overlayMode: viewerOptions.overlayMode,
								}),
							],
						},
					});
				}
			},
			"astro:server:setup": async ({ server }) => {
				if (viewerOptions) {
					await setupViewer({ server, root: config.root, viewerPrefix });
				}
			},
		},
	};
};
