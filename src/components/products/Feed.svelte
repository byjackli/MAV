<script lang="ts">
	import Card from './Card.svelte';
	export let products;
</script>

<div class="feed">
	{#if products}
		{#each $$props && products as product (product.id)}
			<Card data={product} />
		{/each}
	{:else}
		<div class="loading">loading...</div>
	{/if}
</div>
