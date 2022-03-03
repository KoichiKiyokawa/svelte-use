import 'zx/globals';

const routes = glob.globbySync('src/routes/**/[!index]*.svelte');
const links = routes
	.map((route) => {
		const [, filename] = route.match(/src\/routes\/(.*)\.svelte/);
		return `<a href="${filename}">${filename}</a>`;
	})
	.join('\n');

fs.writeFileSync('src/routes/index.svelte', links);
