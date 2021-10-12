<script>
	export let message;
</script>

<p>
	<span class="material-icons"> warning </span>
	<span>{message}</span>
</p>

<style>
	p {
		max-width: 60ch;
		padding: 0.5em;
		margin: .15em 1em;
		background-color: var(--accent3);

		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		gap: .6em;
	}
	span.material-icons {
		padding: 0 .5em;
	}

	span {
		color: var(--primary);
	}
</style>
