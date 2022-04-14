<script lang="ts">
	import { afterUpdate } from 'svelte';
	import initModal from '../components/modals/modals-lite';

	afterUpdate(() => {
		initModal();
	});
</script>

<svelte:head>
	<title>Modals - Experiments by Jack Li</title>
	<meta
		name="description"
		content="Create accessible modals with a stress-free developer experience."
	/>
	<meta
		name="keywords"
		content="a11y, accessibility, modals, dialog, popup, wcag, ada, svelte, computer science, front end, front-end, developer, software, projects, mini-projects, svelte, sveltekit, github, fun"
	/>
	<meta name="og:title" content="Modals - Experiments by Jack Li" />
	<meta
		name="og:description"
		content="Create accessible modals with a stress-free developer experience"
	/>
	<meta name="og:url" content="https://experiments.byjackli.com/modals" />
	<meta name="og:type" content="website" />

	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Noto+Serif:wght@400;700&family=Roboto+Mono&display=swap"
		rel="stylesheet"
	/>

	<script src="../static/modals/modals-lite"></script>
</svelte:head>

<div class="container" id="modals">
	<aside class="noselect">
		<a href="/modals" title="home">
			<div class="logo">
				<span class="bow">x</span>
				<span class="smile">:)</span>
			</div>
			<div class="logo-text">
				<h1>Modals</h1>
				<p>make modals assistive-technology-friendly</p>
			</div>
		</a>
	</aside>
	<section>
		<h2>modal stuff</h2>
		<div>
			<button class="modal-open">open modal</button>
			<div role="dialog" class="tallBoy">
				<button class="modal-close">close</button>
				<p>the modal</p>
				<input type="text" />
				<input type="text" />
				<input type="text" />
				<input type="text" />
				<input type="text" />
				<input type="text" />
				<div>
					<button class="modal-open">modal 1</button>
					<div role="dialog">
						<button class="modal-close">close</button>
						<p>nested modal 1</p>
						<input type="text" />
						<input type="text" />
						<input type="text" />
						<input type="text" />
					</div>
				</div>
				<div>
					<button class="modal-open">second modal</button>
					<div role="dialog">
						<button class="modal-close">close</button>
						<p>nested modal 2</p>
						<input type="text" />
						<input type="text" />
						<button class="modal-open">nested in 2</button>
						<div role="dialog">
							<button class="modal-close">close</button>
							<p>nested inside the nested..?</p>
							<input type="text" />
							<input type="text" />
							<input type="text" />
						</div>
						<div class="modal-backdrop noBackdrop" />
					</div>
					<div class="modal-backdrop noBackdrop" />
					<button class="modal-open">modal no3</button>
					<div role="dialog" class="tallBoy">
						<p>😊 auto-generated close button</p>
						<input type="text" />
						<input type="text" />
						<input type="text" />
						<input type="text" />
						<input type="text" />
						<input type="text" />
						<input type="text" />
						<input type="text" />
						<input type="text" />
						<input type="text" />
						<input type="text" />
						<input type="text" />
					</div>
					<div class="modal-backdrop myBackdrop" />
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	* {
		color: #1c1c1c;
		font-family: 'Noto Sans', sans-serif;
	}
	*:focus {
		outline: solid 5px #d9c7ff;
	}
	h1,
	h2,
	h3 {
		font-family: 'Roboto Mono', serif;
	}
	div.container {
		background-color: #fff8be;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}
	aside {
		padding: 2em;

		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;

		z-index: 2;
	}
	aside a {
		text-decoration: none;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 2rem;
	}
	aside h1 {
		font-size: 32px;
	}
	aside p {
		font-size: 16px;
	}
	div.logo {
		min-width: 50px;
		max-width: 50px;
		min-height: 50px;
		max-height: 50px;
		background-color: #d9c7ff;
		border-radius: 15px;

		display: flex;
		justify-content: center;
		align-items: flex-end;
	}
	div.logo .bow {
		position: absolute;
		top: -20px;
		right: -5px;

		font-size: 32px;
		font-weight: bold;
	}
	div.logo .smile {
		padding-bottom: 8px;
		transform: rotate3d(0, 0, 1, 90deg);
		font-weight: bold;
	}
	div.logo-text {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	button {
		background-color: #ff72ad;
		padding: 0.25rem 0.5rem;
		border: none;
		border-radius: 4px;
		font-size: 18px;

		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.25rem;
	}
	button,
	button * {
		color: #fff;
	}

	.tallBoy {
		height: 100vh;
		overflow-y: scroll;
	}
	.noBackdrop {
		width: 0;
		height: 0;
		overflow: hidden;
	}
	.myBackdrop {
		background-color: rgb(217, 199, 255, 0.2);
		width: 50%;
		height: 50%;
	}
</style>
