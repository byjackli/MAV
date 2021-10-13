import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {

	kit: {
		target: '#root',
		adapter: adapter({ fallback: "index.html" }),
		vite: {
			ssr: {
				external: ['firebase']
			}
		}
	}
};

export default config;
