<script lang="ts">
	import { getAllProducts, getProduct, getPrice } from '../components/products/api';
	import { loadStripe } from '@stripe/stripe-js';
	import { onMount } from 'svelte';

	import Feed from '../components/products/Feed.svelte';
	import Card from '../components/products/Card.svelte';

	let stripe = undefined;
	// onMount(async () => {
	// 	stripe = await loadStripe(stripeConfig);

	// 	console.info(stripe);
	// });

	$: renderData = undefined;
	$: products = undefined;

	onMount(async () => {
		products = await getAllProducts({ showPrices: true });
		renderData = JSON.stringify(products, undefined, 4);
		console.info(products);
	});
</script>

<svelte:head>
	<title>Products - Experiments by Jack Li</title>
	<meta name="description" content="Understanding the Stripe API through a mini project." />
	<meta
		name="keywords"
		content="stripe, ecommerce, commerce, shopify, squarespace, wix, svelte, computer science, front end, front-end, developer, software, projects, mini-projects, svelte, sveltekit, github, fun"
	/>
	<meta name="og:title" content="Products - Experiments by Jack Li" />
	<meta name="og:description" content="Understanding the Stripe API through a mini project" />
	<meta name="og:url" content="https://experiments.byjackli.com/products" />
	<meta name="og:type" content="website" />

	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&family=Source+Serif+Pro:wght@300;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="container" id="products">
	<aside class="noselect">
		<a href="/products" title="home"><h1>Products</h1></a>
		<p>Stripe API testing grounds</p>
	</aside>
	<section id="checklists">
		<h2>checklists</h2>
		<p style="text-align:center;">
			i'll be playing with the Stripe API and practicing unit testing, killing two birds with one
			stone or something like that.
		</p>
		<div class="list-container">
			<div class="list">
				<h3>Emoji Key</h3>
				<p>for any passerbyer that is confused, this project uses emoji's to communicate</p>
				<ul>
					<li>
						<span title="to-do">🥱</span>
						<span>to-do</span>
					</li>
					<li>
						<span title="planning">📐</span>
						<span>planning</span>
					</li>
					<li>
						<span title="working">👷‍♂️</span>
						<span>working</span>
					</li>
					<li>
						<span title="abandoned">👻</span>
						<span>abandoned</span>
					</li>
					<li>
						<span title="done">✨</span>
						<span>done</span>
					</li>
				</ul>
			</div>
			<div class="list">
				<h3>Components</h3>
				<p>lets oversimplify and understand what types of components are required.</p>
				<ul>
					<li>
						<span title="planning">📐</span>
						<span>product card</span>
					</li>
					<li>
						<span title="to-do">🥱</span>
						<span>product feed</span>
					</li>
					<li>
						<span title="to-do">🥱</span>
						<span>checkout form</span>
					</li>
					<li>
						<span title="to-do">🥱</span>
						<span>batch edit products</span>
					</li>
				</ul>
			</div>
			<div class="list">
				<h3>Project Page</h3>
				<p>
					Not only does the page have to look good, but E2E testing needs interactive components
				</p>
				<ul>
					<li>
						<span title="done">✨</span>
						<span>checklists section</span>
					</li>
					<li>
						<span title="to-do">🥱</span>
						<span>product component</span>
					</li>
					<li>
						<span title="to-do">🥱</span>
						<span>product page</span>
					</li>
					<li>
						<span title="to-do">🥱</span>
						<span>feed component</span>
					</li>
					<li>
						<span title="to-do">🥱</span>
						<span>feed section</span>
					</li>
					<li>
						<span title="to-do">🥱</span>
						<span>feed page</span>
					</li>
				</ul>
			</div>
			<div class="list">
				<h3>Testing Suite</h3>
				<p>
					ahh shit, the dreaded.. testing frameworks and libraries; this should be fun and
					annoying..
				</p>
				<ul>
					<li>
						<span title="done">✨</span>
						<span>pick a testing framework</span>
					</li>
					<li>
						<span title="to-do">🥱</span>
						<span>function tests</span>
					</li>
					<li>
						<span title="working">👷‍♂️</span>
						<span>UI tests</span>
					</li>
					<li>
						<span title="to-do">🥱</span>
						<span>serverless function tests</span>
					</li>
				</ul>
			</div>
		</div>
	</section>
	<section id="product-component">
		<button on:click={() => getAllProducts()}
			><span class="material-icons">refresh</span>force refresh</button
		>

		{#if renderData}
			{#if products}
				{#each products as product (product.id)}
					<Card data={product} />
				{/each}
			{/if}
			<pre>
				<code>
					{renderData}
				</code>
			</pre>
		{/if}
	</section>
	<section id="feed-component">
		<Feed {products} />
	</section>
</div>

<style>
	* {
		color: #ff72ad;
		font-family: 'Outfit', sans-serif;
	}
	h1,
	h2,
	h3 {
		font-family: 'Source Serif Pro', serif;
	}
	div.container {
		background-color: #fff;
	}
	aside {
		width: 100vw;
		padding: 0.75em 0.25em;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #000;

		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;

		z-index: 2;
	}
	aside a {
		text-decoration: none;
	}
	aside h1 {
		padding: 0 0.5em;
		margin-right: 0.5em;
		border-right: solid 2px #ff72ad;
		font-weight: bold;
		font-size: 36px;
	}
	aside p {
		width: 11ch;
		color: #fff;
		font-weight: bold;
		font-size: 14px;
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
	pre {
		padding: 2rem;
	}
	code {
		font-family: monospace !important;
		font-weight: 200;
		font-size: 16px;
		color: #ff72ad;

		white-space: pre-wrap; /* Since CSS 2.1 */
		white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
		white-space: -pre-wrap; /* Opera 4-6 */
		white-space: -o-pre-wrap; /* Opera 7 */
		word-wrap: break-word; /* Internet Explorer 5.5+ */
	}

	#checklists {
		width: 100%;
		min-height: 100vh;
		padding: 1em;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}
	#checklists div.list-container {
		width: 100vw;
		padding: 2em;

		display: flex;
		flex-flow: row wrap;
		justify-content: center;
		gap: 2em;

		overflow-y: auto;
	}
	#checklists div.list {
		min-width: 20ch;
		width: 20ch;
		padding: 1rem;
		padding-bottom: 1.5rem;

		border: 0.15rem solid #ff72ad;
		border-radius: 6px;
	}
	#checklists div.list p {
		padding: 1em 0;
		font-size: 18px;
	}
	#checklists div.list ul {
		list-style-type: none;
		padding: 0;
	}
	#checklists div.list ul li,
	#checklists div.list ul li span:first-of-type {
		display: flex;
		gap: 0.5em;
	}
	#checklists div.list ul li span:first-of-type {
		width: 2ch;
		justify-content: center;
	}
	#checklists div.list ul li span:last-of-type {
		padding-top: 0.15em;
	}

	section#product-component {
		background-color: #d9d9d9;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}
</style>
