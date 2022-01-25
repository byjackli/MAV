<script>
	export let id,
		name,
		type = '',
		placeholder,
		disabled,
		multiple = false,
		value = undefined,
		options = [],
		focus,
		blur,
		input;

	const data = {};
	let expanded = false,
		expandedIcon = 'expand_more';

	export function getData() {
		return data;
	}
	function toggle(event) {
		if (
			event.type === 'click' ||
			(event.type === 'keydown' && ['Enter', 'NumpadEnter', 'Space'].includes(event.code))
		) {
			expanded = !expanded;
			updateIcon();
		}
	}
	function updateIcon() {
		expandedIcon = expanded ? 'expand_less' : 'expand_more';
	}
	function onInput(event) {
		if (!expanded && ['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.code)) expanded = true;
		// Select something, if type is radio/dropdown, then close. otherwise, keep it open.
		// update aria-label or something to let them know where cursor is (read into aria-activedescendant)
		// update css to let them know where cursor is
		// more help at https://www.w3.org/TR/wai-aria-practices/examples/combobox/combobox-select-only.html
		else if (expanded && ['Enter', 'NumpadEnter', 'Space'].includes(event.code)) return null;

		// focus without using .focus(),, use aria-label or something
		if (['Home', 'End'].includes(event.key)) document.getElementById('temp').focus();

		input({ type: 'dropdown', data });
		updateIcon();
	}
</script>

<div
	class="dropdown"
	{id}
	{name}
	{disabled}
	aria-disabled={disabled}
	on:focus={focus}
	on:blur={blur}
	on:keydown={(event) => onInput(event)}
	tabindex="0"
>
	<div class="option" tabindex="-1" on:click={(event) => toggle(event)}>
		<span>
			{value !== undefined ? value : placeholder !== undefined ? placeholder : options[0].name}
		</span>
		{#if type !== 'checkbox'}
			<span class="material-icons">{expandedIcon}</span>
		{:else}
			<span class="material-icons">check_box_outline_blank</span>
		{/if}
	</div>
	{#if type !== 'checkbox' && expanded}
		{#each options as option (option.uid)}
			<div class="option" id={option.uid}>
				<span>{option.name}</span>
				{#if multiple}<span class="material-icons">check_box_outline_blank</span>{/if}
			</div>
		{/each}
	{/if}
</div>
