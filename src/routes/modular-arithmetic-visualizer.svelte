<script>
	let canvas,
		num = 0,
		mod = 0,
		uiPrimes = 0,
		uiArray = [],
		gotMod = [];

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
		if (!num || !mod) return;
		const arr = [];

		for (let i = 0; i < num; i++) {
			if (!arr[i % mod]) arr.push([]);
			arr[i % mod].push(i);
		}
		return arr;
	}

	function setup() {
		if (!num || !mod) return;

		const ctx = canvas.getContext('2d'),
			arcs = num / mod,
			width = 5 * mod;

		ctx.clearRect(0, 0, wide, wide);

		// drawing circles
		for (let i = 1; i <= arcs + 1; i++) {
			ctx.beginPath();
			ctx.arc(center, center, i * width, 2 * Math.PI, false);
			ctx.stroke();
		}

		// drawing sections
		const angle = (2 * Math.PI) / mod;
		console.info(`angle:${angle}  |  mod:${mod}  |`);
		for (let k = 1; k < mod + 1; k++) {
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

<div>
	<h1>Modular Arithmetic Visualizer</h1>
	<p>A rabbit-hole project that snowballed from an "easy" LeetCode question.</p>
    <p>Primes are highlighted in yellow.</p>
</div>
<div>
	<label for="number">number</label>
	<input name="number" bind:value={num} placeholder="number" />
	<label for="modulo">modulo</label>
	<input name="modulo" bind:value={mod} placeholder="modulo" />
	<br />
	<br />
	<hr />
	<strong>number of primes: {countPrimes(num, mod)} </strong>

	{#if gotMod}
		<ul>
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

	{#if uiArray}
		<ul>
			{#each uiArray as prime (prime)}
				<li>{prime}</li>
			{/each}
		</ul>
	{/if}
	<canvas width={`${wide}px`} height={`${wide}px`} bind:this={canvas} />
</div>

<style>
	.prime {
		background-color: orange;
	}
	span {
		margin: 10px;
	}
</style>
