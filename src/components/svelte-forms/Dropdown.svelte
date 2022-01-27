<script lang="ts">
	import { onMount } from 'svelte';
	import { belongs } from './FormStore';
	import NameStore from './NameStore';

	export let id: string,
		name: string,
		type: string = '',
		placeholder: string,
		disabled: boolean,
		multiple: boolean = false,
		compact: boolean,
		value: string | [string],
		data: Record<string, string> = {},
		options: [{ uid: string; name: string }],
		focus: Function,
		blur: Function,
		input: Function;

	let container = undefined,
		expanded: boolean = false,
		prevId: string,
		cur: number = 0,
		curMax: number = 0;

	function updateExpanded(boolean?: boolean): void {
		const verdict = boolean === undefined ? !expanded : boolean;
		expanded = verdict;

		if (!expanded) blur();
		else focus();
	}
	function updateCursor(uid: string): string {
		for (const [i, option] of options.entries())
			if (uid === option.uid || uid === option.name) return (cur = i) && option.uid;

		cur = 0;
		return options[0].uid;
	}
	function updateFocus(uid: string): void {
		const current = document.getElementById(`${$NameStore.optionHeader}${id}${uid}`),
			previous = document.getElementById(`${$NameStore.optionHeader}${id}${prevId}`);

		previous.classList.toggle('active');
		current.classList.toggle('active');
		prevId = uid;
		updateCursor(uid);
	}
	function updateChecked(uid: string): void {
		if (!multiple) data = {};
		if (belongs(data, uid)) delete data[uid];
		else data[uid] = options[cur].name;
	}
	function renderChecked(boolean: boolean): string {
		if (multiple) return boolean ? `check_box` : `check_box_outline_blank`;
		return boolean ? `radio_button_checked` : `radio_button_unchecked`;
	}
	function onInput(event: KeyboardEvent): void {
		console.info(event);
		if (
			!expanded &&
			(['ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', 'NumpadEnter', 'Space'].includes(
				event.code
			) ||
				event.key.length === 1)
		) {
			event.preventDefault();
			updateExpanded(true);
		} else if (expanded) {
			if (event.code !== 'Tab') event.preventDefault();

			if (event.code === 'Escape') updateExpanded(false);
			else if (['Enter', 'NumpadEnter', 'Space'].includes(event.code)) {
				if (!multiple) updateExpanded(false);
				// updateFocus(options[cur].uid);
				updateChecked(options[cur].uid);
			} else if (event.code === 'ArrowUp' && 0 <= cur - 1) cur -= 1;
			else if (event.code === 'ArrowDown' && cur + 1 <= curMax) cur += 1;
			else if (event.code === 'PageUp') cur = 0 < cur - 10 ? cur - 10 : 0;
			else if (event.code === 'PageDown') cur = cur + 10 < curMax ? cur + 10 : curMax;
			else if (event.code === 'Home') cur = 0;
			else if (event.code === 'End') cur = curMax;
			updateFocus(options[cur].uid);
		}

		input({ target: { value: data } });
	}
	function onPoint(event): void {
		const uid = event.target
			.closest('.option')
			.getAttribute('id')
			.split(`${$NameStore.optionHeader}${id}`)[1];

		if (!multiple) updateExpanded(false);

		updateFocus(uid);
		updateChecked(uid);
		input({ target: { value: data } });
	}

	onMount(() => {
		const label = document.getElementById(`${$NameStore.label}${id}`);

		label.addEventListener('click', () => {
			container.focus();
			updateExpanded(true);
		});

		curMax = options.length - 1;
		prevId = updateCursor(value[value.length - 1]);
	});
</script>

<div
	bind:this={container}
	class={`dropdown-container noselect ${value === '[redacted]' ? $NameStore.redact : ''}`}
	id={`${$NameStore.inputHeader}${id}`}
	{name}
	{disabled}
	aria-disabled={disabled}
	aria-expanded={expanded}
	aria-activedescendant={expanded ? `${$NameStore.optionHeader}${id}${options[cur].uid}` : 'false'}
	aria-labelledby={`${$NameStore.label}${id}`}
	role="combobox"
	on:focus={focus()}
	on:blur={() => {
		blur();
		updateExpanded(false);
	}}
	on:keydown={(event) => onInput(event)}
	tabindex="0"
>
	<div
		class="dropdown"
		on:pointerdown={() => {
			updateExpanded(!expanded);
			container.focus();
		}}
	>
		<span class={value.length ? '' : 'option-empty'}>
			{compact && typeof value !== 'string' && 1 < value.length
				? `Multiple Selections (${value.length})`
				: value.length
				? value
				: placeholder
				? placeholder
				: 'Select an option'}
		</span>
		{#if type !== 'checkbox'}
			<span class="material-icons">{expanded ? 'expand_less' : 'expand_more'}</span>
		{:else}
			<span class="material-icons">{renderChecked(belongs(data, options[0].uid))}</span>
		{/if}
	</div>
	{#if type !== 'checkbox' && expanded}
		<div class="option-container" role="listbox" on:pointerdown={(event) => onPoint(event)}>
			{#each options as option (option.uid)}
				<div
					class={`option ${prevId === option.uid ? 'active' : ''}`}
					id={`${$NameStore.optionHeader}${id}${option.uid}`}
					role="option"
					aria-selected={`${belongs(data, option.uid)}`}
				>
					<span>{option.name}</span>
					<span class="material-icons">{renderChecked(belongs(data, option.uid))}</span>
				</div>
			{/each}
		</div>
	{/if}
</div>
