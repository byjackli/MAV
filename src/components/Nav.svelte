<nav>
	<div>
		<span class="barcode">
			<span class="noselect">*</span><span>experiments</span><span class="noselect">*</span>
		</span>
		<p>hover for menu</p>
	</div>
	<ul>
		<li>
			<a href="/" title="homepage">home</a>
		</li>
		<li>
			<a href="https://github.com/byjackli/experiments" title="GitHub Repository">git repo</a>
		</li>
		<li>
			<a href="/modular-arithmetic-visualizer" title="Modular Arithmetic Visualizer">MAV</a>
		</li>

		<li>
			<a class="disabled" title="coming soon" on:click|preventDefault={null} href="/svelte-forms"
				>Svelte Forms</a
			>
		</li>
		<li>
			<a class="disabled" title="coming soon" on:click|preventDefault={null} href="/color-contrast"
				>Color Contrast</a
			>
		</li>
		<li>
			<a
				class="disabled"
				title="coming soon"
				on:click|preventDefault={null}
				href="/media-query-vars">Media Query Vars</a
			>
		</li>
	</ul>
</nav>

<style>
	nav,
	ul,
	li,
	div {
		display: flex;
	}
	nav,
	div,
	ul {
		flex-direction: column;
		align-items: center;
	}

	div {
		height: 9vh;
		gap: .25em;
	}

	nav {
		height: 30vh;
		position: fixed;
		bottom: -21.5vh;
		right: 2em;

		justify-content: flex-start;

		padding: 0.3em 0.1em;
		background-color: var(--text);
		z-index: 99999;
	}
	nav:hover,
	nav *:active,
	nav:focus-within {
		bottom: 0;
		box-shadow: var(--shadow);
	}

	span,
	p {
		color: var(--primary);
		font-size: var(--small);
	}
	span.barcode span {
		font-size: var(--larger);
	}

	ul {
		width: 100%;
		height: 21vh;
		padding: .5em 0;

		gap: 0.5em;

		list-style: none;
		overflow-y: scroll;
		overflow-x: hidden;
	}
	li {
		width: 90%;
	}
	a {
		width: 100%;
		padding: 0.5em;
		border-radius: 5px;
		background-color: var(--accent1);
		text-decoration: none;
	}

	a,
	a:visited {
		color: var(--text);
		text-decoration: none;
	}
	a:hover {
		transform: scale(1.02);
	}
	a:active {
		transform: scale(0.97);
	}
</style>
