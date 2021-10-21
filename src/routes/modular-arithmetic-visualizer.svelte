<script>
	let canvas,
		dividend = 0,
		divisor = 0,
		uiPrimes = 0,
		uiArray = [],
		gotMod = [];

	let primes = true;

	const wide = 2000,
		center = 1000;

	function countPrimes(n, g) {
		const primesAr = new Set(),
			doNothing = g;
		primesAr.add(2).add(3).add(5).add(7);
		let primesCt = 0,
			root;

		// track primes, divide n by primes
		function divisibleByPrime(n) {
			for (const prime of primesAr) {
				if (n % prime === 0) return true;
			}
			return false;
		}

		if (n < 2) return 0;
		if (7 < n) primesCt = 4;
		else if (5 < n) primesCt = 3;
		else if (3 < n) primesCt = 2;
		else if (2 < n) primesCt = 1;

		let cursor = 7;
		while (cursor < n) {
			root = Math.pow(cursor, 0.5);

			if (!divisibleByPrime(cursor)) {
				primesCt += 1;
				primesAr.add(cursor);
			}

			if (cursor % 30 === 1 || cursor % 30 === 23) {
				cursor += 6;
			} else if (cursor % 30 === 7 || cursor % 30 === 13 || cursor % 30 === 19) {
				cursor += 4;
			} else if (cursor % 30 === 11 || cursor % 30 === 17 || cursor % 30 === 29) {
				cursor += 2;
			}
		}

		uiPrimes = primesCt;
		uiArray = toArray(primesAr);
		// setup();
		gotMod = getMod();
		console.info(gotMod);

		return primesCt;
	}

	function getMod() {
		if (!dividend || !divisor) return;
		const arr = [];

		for (let i = 0; i < dividend; i++) {
			if (!arr[i % divisor]) arr.push([]);
			arr[i % divisor].push(i);
		}
		return arr;
	}

	function setup() {
		if (!dividend || !divisor) return;

		const ctx = canvas.getContext('2d'),
			arcs = dividend / divisor,
			width = 5 * divisor;

		ctx.clearRect(0, 0, wide, wide);

		// drawing circles
		for (let i = 1; i <= arcs + 1; i++) {
			ctx.beginPath();
			ctx.arc(center, center, i * width, 2 * Math.PI, false);
			ctx.stroke();
		}

		// drawing sections
		const angle = (2 * Math.PI) / divisor;
		console.info(`angle:${angle}  |  divisor:${divisor}  |`);
		for (let k = 1; k < divisor + 1; k++) {
			const h = 500 + width * arcs,
				x = (h * Math.sin(angle * k) * 180) / Math.PI,
				y = (h * Math.cos(angle * k) * 180) / Math.PI;

			ctx.beginPath();
			ctx.moveTo(center, center);
			ctx.lineTo(x, y);
			ctx.stroke();
		}
	}

	function toArray(set) {
		const arr = [];
		for (const el of set) {
			arr.push(el);
		}
		return arr;
	}
</script>

<svelte:head>
	<title>Modular Arithmetic Visualizer - Experiments by Jack Li</title>
	<meta name="description" content="Visualize modular arithmetic with primes highlighted." />
	<meta
		name="keywords"
		content="modulo, modular, arithmetic, modular arithmetic, primes, count primes, prime numbers, computer science, front end, front-end, developer, software, projects, mini-projects, svelte, sveltekit, github, fun, leetcode"
	/>
	<meta name="og:title" content="Modular Arithmetic Visualizer - Experiments by Jack Li" />
	<meta name="og:description" content="Visualize modular arithmetic with primes highlighted." />
	<meta name="og:url" content="https://experiments.byjackli.com/modular-arithmetic-visualizer" />
	<meta name="og:type" content="website" />
</svelte:head>

<div class="container">
	<div id="header">
		<h1>Modular Arithmetic Visualizer</h1>
		<p>A rabbit-hole project that snowballed from an "easy" Counting Primes LeetCode question.</p>
		<ol>
			<li>Primes are highlighted.</li>
			<li>All calculations are done on your device.</li>
			<li>
				View the <a href="https://leetcode.com/problems/count-primes/" target="_blank"
					>LeetCode question</a
				>
			</li>
			<li>
				Learn more about the
				<a href="https://en.wikipedia.org/wiki/Modulo_operation" target="_blank">
					Modulo operation
				</a>
			</li>
		</ol>
	</div>
	<main>
		<div id="inputs">
			<div>
				<label for="dividend">dividend</label>
				<input name="dividend" bind:value={dividend} placeholder="dividend" />
			</div>
			<div>mod</div>
			<div>
				<label for="divisor">divisor</label>
				<input name="divisor" bind:value={divisor} placeholder="divisor" />
			</div>
		</div>
		<hr />
		<strong>number of primes: {countPrimes(dividend, divisor)} </strong>
		{#if uiArray}
			<ul id="list-primes">
				{#each uiArray as prime (prime)}
					<li>{prime}</li>
				{/each}
			</ul>
		{/if}

		{#if gotMod}
			<ul id="list-mod">
				{#each gotMod as bigMod (bigMod)}
					<li>
						{#each bigMod as tinyMod (tinyMod)}
							{#if uiArray.includes(tinyMod)}
								<span class="prime">{tinyMod}</span>
							{:else}
								<span>{tinyMod}</span>
							{/if}
						{/each}
					</li>
				{/each}
			</ul>
		{/if}
		{#if false}
			<canvas width={`${wide}px`} height={`${wide}px`} bind:this={canvas} />
		{/if}
	</main>
</div>

<style>
	div.container,
	#header {
		display: flex;
		flex-direction: column;
	}
	div.container {

		align-items: center;

		background-color: darkslateblue;
		border: 0.5em solid midnightblue;
		border-right-width: 0.9em;
	}
	div.container * {
		color: white;
		font-family: var(--body);
	}

	#header {
		padding: 1em;
		margin-bottom: 2em;
		gap: 1em;
		/* align-items: center; */

		width: 100%;
		background-color: midnightblue;
	}
	#header p,
	#header ol {
		margin-left: 1em;
	}
	div.container h1 {
		font-family: var(--title);
	}

	main {
		width: 80vw;
		padding-bottom: 2em;
	}
	div#inputs {
		display: flex;
		flex-direction: row;
		gap: 1em;
		flex-wrap: wrap;
	}
	div#inputs > div {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	div.container input {
		color: darkslateblue;
	}

	hr {
		margin: 3em 0 1em 0;
	}

	.prime,
	#list-primes li {
		background-color: midnightblue;
	}
	ul,
	#list-primes li,
	#list-mod li,
	span {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
	}
	ul {
		width: 100%;
		padding: 0;
		margin-bottom: 2em;

		overflow-x: auto;
		gap: 1em;
	}

	ul#list-primes {
		flex-direction: row;
		gap: 0em;
	}
	#list-mod li {
		min-width: 100%;
		width: fit-content;
		flex-direction: row;
		background-color: rgba(255, 255, 255, 0.15);
	}
	#list-mod span,
	#list-primes li {
		width: 2.5em;
		height: 2.5em;
		border: solid midnightblue 2px;

		padding: 0.25em;
		margin: 10px;

		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
