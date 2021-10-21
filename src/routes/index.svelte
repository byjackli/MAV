<script>
	import Warn from '../components/Warn.svelte';
</script>

<svelte:head>
	<title>Experiments by Jack Li</title>
	<meta name="description" content="A group of computer-based mini-projects by Jack" />
	<meta
		name="keywords"
		content="computer science, front end, front-end, developer, software, projects, mini-projects, svelte, sveltekit, github, fun, leetcode"
	/>
	<meta name="og:title" content="Experiments by Jack Li" />
	<meta name="og:description" content="A group of computer-based mini-projects by Jack" />
	<meta name="og:url" content="https://experiments.byjackli.com" />
	<meta name="og:type" content="website" />
</svelte:head>

<div class="container">
	<header>
		<h1 aria-label="Experiments">
			<span class="noselect">*</span>Experiments<span class="noselect">*</span>
		</h1>
		<br />
		<span>by Jack Li</span>
		<p>
			On this page, you'll find me either testing ideas, exploring leetcode problems, and other
			miscellaneous stuff.
		</p>
	</header>
	<main>
		<section>
			<h2>explore the projects:</h2>
			<Warn message="All mini-projects are, by default, not maintained. Clone at your own risk!" />
			<div class="list-container">
				<a href="https://github.com/byjackli/experiments" title="view code">GitHub Repo</a>
				<a href="/modular-arithmetic-visualizer" title="Not maintained."
					>Modular Arithmetic Visualizer</a
				>
				<a title="Work in progress." href="/svelte-forms">Svelte Forms</a>
				<a title="Work in progress." href="/color-builder">Color Builder</a>
				<a
					class="disabled"
					title="coming soon"
					on:click|preventDefault={null}
					href="/bulk-image-compression">Bulk Image Compression</a
				>
			</div>
		</section>
		<section>
			<h2>connect with jack:</h2>
			<div class="list-container">
				<a
					target="_blank"
					title="how I keep up with developer news"
					href="https://twitter.com/byjackli">Twitter</a
				>
				<a target="_blank" title="how I stay motivated" href="https://www.linkedin.com/in/byjackli/"
					>LinkedIn</a
				>
				<a target="_blank" title="how I manage my projects" href="https://github.com/byjackli"
					>GitHub</a
				>
				<a
					target="_blank"
					title="how I stay calm while coding"
					href="https://open.spotify.com/user/primeno17">Spotify</a
				>
				<a target="_blank" title="how I unwind after work" href="https://instagram.com/byjackli"
					>Instagram</a
				>
			</div>
		</section>
	</main>
</div>

<style>
	header {
		padding-top: 4em;

		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: var(--large);
	}
	h1,
	h1 span {
		font-family: var(--hero);
		font-weight: normal;
		color: var(--primary);
	}
	h1 {
		background-color: var(--text);
		padding: 0.5em;
		padding-bottom: 0.4em;
		border-radius: 5px;

		font-size: var(--largest);
	}
	p {
		padding: 2ch;
		padding-top: 1.5em;
	}
	div.container {
		padding: 5em;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5em;
	}

	main {
		display: flex;
		flex-direction: column;
		gap: 5em;
	}
	section {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}
	div.list-container {
		width: 50vw;

		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 1em 1.25em;
	}

	a {
		padding: 0.5em;
		border-radius: 5px;
		background-color: var(--accent1);
	}

	a,
	a:visited {
		color: var(--text);
		text-decoration: none;
	}
	a:hover {
		transform: scale(1.05);
	}
	a:active {
		transform: scale(0.95);
	}
</style>
