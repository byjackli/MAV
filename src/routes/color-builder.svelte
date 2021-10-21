<script>
	import { onMount } from 'svelte';

	let section,
		foreground = { hex: '#000000' },
		background = { hex: '#ffffff' },
		ratio,
		filter = {
			rate: 2.5,
			range: { low: 2.4, high: 6 },
			type: `rate`,
			status: false
		},
		picker = {
			palette: {
				canvas: undefined,
				context: undefined,
				width: 256,
				height: 256,
				color: { red: 255, green: 0, blue: 0 }
			},
			slider: {
				canvas: undefined,
				context: undefined,
				width: 256,
				height: 20,
				color: { red: 255, green: 0, blue: 0 }
			}
		},
		dropper = {
			color: { red: 255, green: 0, blue: 0 },
			pos: { x: picker.palette.width, y: 0 }
		},
		colors = 0;

	onMount(() => {
		document.documentElement.style.setProperty(`--animation`, `var(--instant)`);

		picker.slider.context = picker.slider.canvas.getContext('2d');
		picker.palette.context = picker.palette.canvas.getContext('2d');
		paintSlider();
		paintPalette();
	});

	function paintSlider() {
		const { context, width, height } = picker.slider,
			off = { x: width / 1536, y: height },
			pos = {};

		for (let start = 0; start < 7; start++) {
			pos[`p${start}`] = start * (width / 6);
		}

		let index = 0,
			color = { str: undefined, red: 255, green: 0, blue: 0 };

		for (const key of Object.keys(pos)) {
			for (let cur = 0; cur < 256; cur++) {
				let operation = index % 2 ? 255 - cur : cur;
				if (index % 3 === 0) color.green = operation;
				else if (index % 3 === 1) color.red = operation;
				else if (index % 3 === 2) color.blue = operation;

				context.fillStyle = color.str = `rgb(${color.red},${color.green},${color.blue})`;
				context.fillRect(pos[key], 0, off.x + 1, off.y + 1);
				pos[key] += off.x;
			}
			index += 1;
		}
	}
	function paintPalette() {
		let { context, width, height } = picker.palette,
			{ red, green, blue } = dropper.color,
			colorsOff = {
				red: (255 - red) / 255,
				green: (255 - green) / 255,
				blue: (255 - blue) / 255
			},
			pos = { x: 0, y: 0 },
			off = {
				x: 0,
				y: height / 256
			};
		for (let rows = 255; -1 < rows; rows--) {
			off.x = width / (rows + 1);

			let colorsRaw = { red: rows, green: rows, blue: rows };

			for (let cols = rows; -1 < cols; cols--) {
				let contrast = undefined,
					color = `rgb(${colorsRaw.red},${colorsRaw.green},${colorsRaw.blue})`;

				if (filter.status) {
					contrast = checkContrast(HEXtoSRGB(background.hex), { raw: colorsRaw });
					if (
						(filter.type === 'rate' && !(filter.rate < contrast)) ||
						(filter.type === 'range' &&
							!(filter.range.low < contrast && contrast <= filter.range.high))
					)
						color = `rgb(0,0,0)`;
				}

				const newPos = { x: pos.x + off.x, y: pos.y };

				context.fillStyle = color;
				context.fillRect(pos.x, pos.y, off.x + 1, off.y + 1);
				pos = newPos;

				colorsRaw.red -= colorsOff.red;
				colorsRaw.green -= colorsOff.green;
				colorsRaw.blue -= colorsOff.blue;
			}
			pos = { x: 0, y: pos.y + off.y };
		}
		//
		return colors;
	}

	function SRGBtoCIEXYZ(color) {
		color = color / 255;
		color = color <= 0.03928 ? color / 12.92 : Math.pow((color + 0.055) / 1.055, 2.4);
		return color;
	}
	function HEXtoSRGB(hex) {
		return {
			raw: {
				red: parseInt(hex.substr(1, 2), 16),
				green: parseInt(hex.substr(3, 2), 16),
				blue: parseInt(hex.substr(-2), 16)
			}
		};
	}

	// get relative luminance, sRGB to linear
	function getRL(sRGB) {
		const red = 0.2126 * SRGBtoCIEXYZ(sRGB.red),
			green = 0.7152 * SRGBtoCIEXYZ(sRGB.green),
			blue = 0.0722 * SRGBtoCIEXYZ(sRGB.blue),
			value = red + green + blue;

		return { breakdown: { red, green, blue }, value };
	}
	function checkContrast(fore, back) {
		fore.RL = getRL(fore.raw);
		back.RL = getRL(back.raw);

		let big = fore.RL?.value + 0.05,
			smol = back.RL?.value + 0.05;
		if (big < smol) [big, smol] = [smol, big];
		const contrast = (ratio = big / smol);

		if (
			(filter.type === 'rate' && !(filter.rate < contrast)) ||
			(filter.type === 'range' && !(filter.range.low < contrast && contrast <= filter.range.high))
		)
			filter.good = false;
		else filter.good = true;

		return contrast;
	}

	function dropperState(state, element, callback) {
		if (state) element.addEventListener('pointermove', callback);
		else element.removeEventListener('pointermove', callback);
	}
	function dropperInfo(event) {
		const container = event.target.closest('#picker-container').getBoundingClientRect(),
			offsetX = event.x - container.x,
			offsetY = event.y - container.y,
			palette = picker.palette,
			mapX = palette.width / 255,
			mapY = palette.height / 255,
			y = Math.round((palette.height - offsetY) / mapY),
			chunkSize = 255 / y,
			chunkNo = offsetX / chunkSize / mapX,
			{ red, green, blue } = picker.slider.color,
			colorsOff = {
				red: (255 - red) / 255,
				green: (255 - green) / 255,
				blue: (255 - blue) / 255
			};

		if (
			event.pressure &&
			-1 < offsetX &&
			-1 < offsetY &&
			offsetX < palette.width &&
			offsetY < palette.height
		) {
			dropper.color = {
				red: Math.round(y - chunkNo * colorsOff.red),
				green: Math.round(y - chunkNo * colorsOff.green),
				blue: Math.round(y - chunkNo * colorsOff.blue)
			};
			dropper.pos = { x: offsetX, y: offsetY };
		}

		console.info({ container, event });
	}
	function updatePalette({ offsetX }) {
		const slider = picker.slider,
			factor = slider.width / 1536,
			x = Math.round(offsetX / factor),
			section = Math.trunc(x / 256),
			abs = x - 256 * section;
		let color = { red: 255, green: 0, blue: 0 };

		if (section === 0 || section === 5) color.red = 255;
		if (section === 2 || section === 3) color.red = 0;
		if (section === 1 || section === 2) color.green = 255;
		if (section === 4 || section === 5) color.green = 0;
		if (section === 3 || section === 4) color.blue = 255;
		if (section === 1 || section === 0) color.blue = 0;

		let operation = section % 2 ? 255 - abs : abs;
		if (section % 3 === 0) color.green = operation;
		else if (section % 3 === 1) color.red = operation;
		else if (section % 3 === 2) color.blue = operation;

		dropper.color = color;
		dropper.pos = { x: picker.palette.width, y: 0 };
		slider.color = color;

		// color.str = `rgb(${color.r},${color.g},${color.b})`;
		paintPalette();
		// console.info(`color is in section ${section}: ${x}`, color);
	}
</script>

<svelte:head>
	<title>Color Builder - Experiments by Jack Li</title>
	<meta
		name="description"
		content="Automatically generate dark mode/light mode colors in compliance with WCAG 2.1 and other color tools."
	/>
	<meta
		name="keywords"
		content="wcag, automatic generation, automatic colors, colors, Color Builder, contrast, wcag color checker, find colors, generate colors, assessibility, svelte, computer science, front end, front-end, developer, software, projects, mini-projects, svelte, sveltekit, github, fun, leetcode"
	/>
	<meta name="og:title" content="Color Builder - Experiments by Jack Li" />
	<meta
		name="og:description"
		content="Automatically generate dark mode/light mode colors in compliance with WCAG 2.1 and other color tools."
	/>
	<meta name="og:url" content="https://experiments.byjackli.com/color-contrast" />
	<meta name="og:type" content="website" />
</svelte:head>

<div class="container">
	<h1>Color Builder</h1>
	<ol>
		<li>automatic dark/light mode suggestions</li>
		<li>WCAG 2.1 filtered colors selection</li>
		<li>custom colors contrast checker</li>
		<li><a href="#about">learn more about this tool</a></li>
	</ol>

	<main>
		<section id="meat">
			<div id="picker" bind:this={section}>
				<div
					id="picker-container"
					bind:this={picker.container}
					on:pointerdown={() => dropperState(true, picker.container, dropperInfo)}
					on:pointerup={() => dropperState(false, picker.container, dropperInfo)}
				>
					<div
						id="picker-dropper"
						style={`top:${dropper.pos.y - 10}px; left:${
							dropper.pos.x - 10
						}px; background-color: rgb(${dropper.color.red}, ${dropper.color.green}, ${
							dropper.color.blue
						})`}
					/>
					<canvas
						id="picker-palette"
						bind:this={picker.palette.canvas}
						width={`${picker.palette.width}px`}
						height={`${picker.palette.height}px`}
					/>
				</div>
				<canvas
					id="picker-slider"
					on:pointerdown={() => dropperState(true, picker.slider.canvas, updatePalette)}
					on:pointerup={() => dropperState(false, picker.slider.canvas, updatePalette)}
					on:pointerleave={() => dropperState(false, picker.slider.canvas, updatePalette)}
					bind:this={picker.slider.canvas}
					width={`${picker.slider.width}px`}
					height={`${picker.slider.height}px`}
				/>
			</div>
			<div id="dropper">
				<div
					id="dropper-preview"
					style={`background-color: rgb(${dropper.color.red}, ${dropper.color.green}, ${dropper.color.blue})`}
				/>
				<div>
					<label for="red">red</label>
					<input
						id="red"
						name="red"
						type="range"
						min="0"
						max="255"
						bind:value={dropper.color.red}
					/>
					<input type="text" bind:value={dropper.color.red} />
					<label for="green">green</label>
					<input
						id="green"
						name="green"
						type="range"
						min="0"
						max="255"
						bind:value={dropper.color.green}
					/>
					<input type="text" bind:value={dropper.color.green} />
					<label for="blue">blue</label>
					<input
						id="blue"
						name="blue"
						type="range"
						min="0"
						max="255"
						bind:value={dropper.color.blue}
					/>
					<input type="text" bind:value={dropper.color.blue} />
				</div>
			</div>
			<div id="settings">
				<label for="background">Set Background Color</label>
				<input type="text" name="background" bind:value={background.hex} on:input={paintPalette} />
				<input id="background" type="color" bind:value={background.hex} on:input={paintPalette} />
				<div>
					<p>Ratio:</p>
					<p>{checkContrast(HEXtoSRGB(background.hex), { raw: dropper.color })}</p>
				</div>
				<br />
				{#if filter.status}
					{#if filter.good}
						<strong id="filter-good">color is within set bounds</strong>
					{:else}
						<strong id="filter-bad">color is out of set bounds</strong>
					{/if}
				{:else}
					<strong>turn on filter to see live results</strong>
				{/if}
			</div>
			<div id="filter">
				<h3>filter settings</h3>
				<label for="filter">filter</label>
				<input
					type="checkbox"
					name="filter"
					bind:checked={filter.status}
					on:change={paintPalette}
				/>

				<label for="type">type</label>
				<select bind:value={filter.type} on:change={paintPalette}>
					<option value="range">range</option>
					<option value="rate">rate</option>
				</select>

				<label for="rate">rate</label>
				<input type="text" name="rate" bind:value={filter.rate} on:change={paintPalette} />

				<label for="range-low">range: low</label>
				<input
					type="text"
					name="range-low"
					bind:value={filter.range.low}
					on:change={paintPalette}
				/>
				<label for="range-high">range: high</label>
				<input
					type="text"
					name="range-high"
					bind:value={filter.range.high}
					on:change={paintPalette}
				/>
			</div>
		</section>
		<section id="debugger">
			<div>
				<label for="background">Background</label>
				<input type="text" name="background" bind:value={background.hex} />
				<input id="background" type="color" bind:value={background.hex} />
				<label for="foreground">Foreground</label>
				<input type="text" name="foreground" bind:value={foreground.hex} />
				<input id="foreground" type="color" bind:value={foreground.hex} />
			</div>
			<div>
				<div>Ratio: {checkContrast(HEXtoSRGB(foreground.hex), HEXtoSRGB(background.hex))}</div>
				<div id="code-container">
					<code>
						{JSON.stringify({ ratio, foreground, background }, null, 4)}
					</code>
				</div>
			</div>
			<div id="preview">
				<p />
			</div>
		</section>
	</main>
	<section id="about">
		<p>
			<strong>Web accessibility</strong> refers to how easy it is to use a website regardless of any
			disabilities.
		</p>
		<p>
			To learn more about how contrast is, visit
			<a href="https://www.w3.org/TR/WCAG20/#relativeluminancedef">
				https://www.w3.org/TR/WCAG20/#relativeluminancedef
			</a>
		</p>
	</section>
</div>

<style>
	div.container {
		background-color: #a9d6e5;
		padding: 1em;
	}
	* {
		color: #012a4a;
		font-family: Georgia, 'Times New Roman', Times, serif;
	}
	main {
		display: flex;
		flex-direction: column;
		gap: 5em;
	}

	section#meat {
		padding: 2em;
		display: flex;
	}
	div#picker-container {
		width: fit-content;
		height: fit-content;
	}
	div#picker-dropper {
		width: 20px;
		height: 20px;
		position: absolute;

		border: 2px solid white;
		border-radius: 99em;
		z-index: 10;
		cursor: pointer;
	}

	div#filter,
	div#dropper,
	div#settings {
		width: 300px;
		padding: 0.5em;
		margin-left: 2em;
		background-color: white;

		display: flex;
		flex-direction: column;
	}

	#filter-good {
		color: green;
	}
	#filter-bad {
		color: red;
	}

	#dropper-preview {
		width: 5em;
		height: 5em;
	}

	div#visualizer {
		width: 1250px;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	div.block {
		width: 1px;
		height: 1px;
		background-color: green;
	}

	div#code-container {
		padding: 1em;
		margin: 2em;
		background-color: aliceblue;
	}
	code {
		width: 100%;
		font-family: monospace;
		white-space: pre-wrap;
		white-space: -moz-pre-wrap;
		white-space: -pre-wrap;
		white-space: -o-pre-wrap;
		word-wrap: break-word;
	}

	section#about {
		min-height: 100vh;
		padding: 3.5em 1.5em;

		display: flex;
		flex-direction: column;
		gap: 1.5em;
	}
	section#about * {
		font-size: 1.2rem;
	}
</style>
