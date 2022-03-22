<script lang="ts">
	import { onMount } from 'svelte';

	import NameStore from './NameStore';

	export let id: string,
		name: string,
		type: string,
		placeholder: string,
		disabled: boolean,
		redact: boolean,
		data: boolean,
		input: Function;

	let container = undefined;

	function updateChecked() {
		data = !data;
	}
	function renderChecked(boolean: boolean): string {
		return boolean ? `check_box` : `check_box_outline_blank`;
	}
	function onInput(event): void {
		if (event.type === 'pointerdown' || ['Enter', 'NumpadEnter', 'Space'].includes(event.code)) {
			event.preventDefault();
			updateChecked();
			input({ target: { value: data } });
		}
	}

	onMount(() => {
		const label = document.getElementById(`${$NameStore.label}${id}`);

		label.addEventListener('click', () => {
			container.focus();
		});
	});
</script>

<div
	bind:this={container}
	class={`checkbox noselect ${redact ? $NameStore.redact : ''}`}
	{id}
	{name}
	{disabled}
	aria-disabled={disabled}
	aria-labelledby={`${$NameStore.label}${id}`}
	role="checkbox"
	on:pointerdown={onInput}
	on:keydown={(event) => onInput(event)}
	tabindex="0"
>
	<span>{placeholder}</span>
	<span class="material-icons">{renderChecked(data)}</span>
</div>
