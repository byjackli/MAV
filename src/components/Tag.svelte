<a href="/">
	<span class="barcode">
		<span class="noselect">*</span><span>experiments</span><span class="noselect">*</span>
	</span>
	<span>return to homepage</span>
</a>

<style>
	a {
		position: fixed;
		bottom: 0;
		right: 2em;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		padding: 0.3em;
		padding-bottom: 0.1em;
		background-color: var(--text);
		
		z-index: 99999;
	}
	a span {
		color: var(--primary);
		font-size: var(--small);
	}
	a span.barcode {
		height: 1.5em;
	}
	a span.barcode span {
		font-size: var(--larger);
	}
</style>
