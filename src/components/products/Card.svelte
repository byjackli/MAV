<script lang="ts">
	export let data;

	const icons = {
			front: 'redo',
			info: 'info',
			cost: 'monetization_on'
		},
		page = { 1: 'front', 2: 'cost', 3: 'info' };
	$: likes = data?.metadata?.likes && trunc(data?.metadata?.likes);
	$: isFront = page[1] === 'front';

	function trunc(number) {
		const tier = (Math.log10(Math.abs(number)) / 3) | 0;
		if (!tier) return number;

		const abbList = ['', 'k', 'm'],
			abb = abbList[tier],
			scale = Math.pow(10, tier * 3),
			scaled = number / scale;

		return `${scaled.toFixed(1)}${abb}`;
	}

	function updatePage(event: MouseEvent) {
		const target = (event.target as HTMLElement).closest('button').getAttribute('id'),
			temp = page[1];
		page[1] = page[target];
		page[target] = temp;
	}
</script>

<div class={`card${page[1] !== 'front' ? ' back' : ''}`} id={data.id}>
	<div class="top">
		<div class="bar">
			<button class="likes"
				><span class="material-icons">star_outline</span>
				<span>{likes !== undefined ? likes : 0}</span></button
			>
			<div on:click={(event) => updatePage(event)}>
				<button class="help" id="2">
					<span class="material-icons">{icons[page[2]]}</span>
				</button>
				<button class="help" id="3">
					<span class="material-icons">{icons[page[3]]}</span>
				</button>
			</div>
		</div>
		<div
			class="image-container"
			style="display: {isFront ? 'flex' : 'none'}; background-image: url({data.images[0]});"
		/>
		{#if !isFront}
			<div class="pad">
				<span class="title">{data.name}</span>
			</div>
		{/if}
	</div>
	<div class="bot">
		<div class="pad">
			{#if isFront}
				<span class="title">{data.name}</span>
			{/if}
			{#if page[1] === 'info'}
				<p>{data?.metadata?.description}</p>
			{:else if page[1] === 'cost'}
				<div>price</div>
			{/if}
		</div>
		<div class="cta">
			{#if !isFront}
				<button class="highlight"><span>reserve</span></button>
			{/if}
			<button><span>add to cart</span></button>
		</div>
	</div>
</div>
