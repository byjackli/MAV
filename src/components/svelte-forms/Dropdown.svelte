<script lang="ts">
	import { onMount } from 'svelte';
	import NameStore from './NameStore';

	export let id: string,
		name: string,
		type: string = '',
		placeholder: string,
		disabled: boolean,
		multiple: boolean = false,
		value: { uid: string; name: string },
		options: [{ uid: string; name: string }],
		focus: Function,
		blur: Function,
		input: Function;

	let container = undefined,
		data: Record<string, boolean> = {},
		expanded: boolean = false,
		prevId: string,
		cur: number = 0,
		curMax: number = 0;

	function updateCur(uid: string): void {
		// toggle prev
		// toggle current
		// set prev to current

		const current = document.getElementById(`${$NameStore.optionHeader}${id}${uid}`),
			previous = document.getElementById(`${$NameStore.optionHeader}${id}${prevId}`);

		previous.classList.toggle('active');
		current.classList.toggle('active');
	}
	function updateChecked(uid: string): void {
		if (!multiple) data = {};
		data[uid] = !data[uid];
	}
	function renderChecked(boolean: boolean): string {
		if (multiple) return boolean ? `check_box` : `check_box_outline_blank`;
		return boolean ? `radio_button_checked` : `radio_button_unchecked`;
	}
	function onInput(event): void {
		console.info(event);
		if (
			!expanded &&
			(event === 'open' ||
				['ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', 'NumpadEnter', 'Space'].includes(
					event.code
				) ||
				event.key.length === 1)
		) {
			event.preventDefault();
			expanded = false;
		} else if (expanded) {
			if (event.code !== 'Tab') event.preventDefault();
			updateCur(options[cur].uid);

			if (event.code === 'Escape') expanded = false;
			else if (['Enter', 'NumpadEnter', 'Space'].includes(event.code)) {
				if (!multiple) expanded = false;
				updateChecked(options[cur].uid);
			} else if (event.code === 'ArrowUp' && 0 <= cur - 1) cur -= 1;
			else if (event.code === 'ArrowDown' && cur + 1 <= curMax) cur += 1;
			else if (event.code === 'PageUp') cur = 0 < cur - 10 ? cur - 10 : 0;
			else if (event.code === 'PageDown') cur = cur + 10 < curMax ? cur + 10 : curMax;
			else if (event.code === 'Home') cur = 0;
			else if (event.code === 'End') cur = curMax;
			updateCur(options[cur].uid);
		}

		input({ type: 'dropdown', data });
	}
	function onClick(event): void {
		if (!multiple) expanded = false;
		else {
			updateChecked('string');
		}
	}

	onMount(() => {
		const label = document.getElementById(`${$NameStore.label}${id}`);

		label.addEventListener('click', () => {
			container.focus();
			expanded = true;
		});

		curMax = options.length - 1;
		prevId = value.uid ? value.uid : options[0].uid;
	});
</script>

<div
	bind:this={container}
	class="dropdown-container noselect"
	id={`${$NameStore.inputHeader}${id}`}
	{name}
	{disabled}
	aria-disabled={disabled}
	aria-expanded={expanded}
	aria-activedescendant={expanded ? `${$NameStore.optionHeader}${id}${options[cur].uid}` : 'false'}
	aria-labelledby={`label:${id}`}
	role="combobox"
	on:focus={() => focus}
	on:blur={() => {
		blur;
		expanded = false;
	}}
	on:keydown={(event) => onInput(event)}
	tabindex="0"
>
	<div
		class="dropdown"
		on:click={() => {
			expanded = !expanded;
			container.focus();
		}}
	>
		<span>
			{value !== undefined ? value : placeholder !== undefined ? placeholder : options[0].name}temp
			label
		</span>
		{#if type !== 'checkbox'}
			<span class="material-icons">{expanded ? 'expand_less' : 'expand_more'}</span>
		{:else}
			<span class="material-icons">{renderChecked(data[options[0].uid])}</span>
		{/if}
	</div>
	{#if type !== 'checkbox' && expanded}
		<div class="option-container" role="listbox" on:click={(event) => console.info(event)}>
			{#each options as option, i (option.uid)}
				<div
					class={`option ${cur === i ? 'active' : ''}`}
					id={`${$NameStore.optionHeader}${id}${option.uid}`}
					role="option"
					aria-selected={`${data[option.uid] !== undefined && data[option.uid]}`}
				>
					<span>{option.name}</span>
					<span class="material-icons">{renderChecked(data[option.uid])}</span>
				</div>
			{/each}
		</div>
	{/if}
</div>
