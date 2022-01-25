<script lang="ts">
	import Dropdown from './Dropdown.svelte';
	import FormStore from './FormStore';
	import type { Field, Group } from './types/Form';

	export let field: Field,
		group: Group = undefined,
		functions: Record<string, Function>,
		cssnames: Record<string, string>;
	let groupid = '';
	(() => (groupid = group === undefined ? '' : group.uid))();
</script>

<div class={`form-block type:${field.type}`} id={`${cssnames.blockHeader}${groupid}${field.uid}`}>
	{#if !field.hidden}
		{#if field.type && field.type === 'custom'}
			<div>{field.body}</div>
		{:else}
			{#if !field.hideLabel}
				<label for={`${cssnames.inputHeader}${groupid}${field.uid}`}>
					{field.name}
					{#if field.required}<em>*required</em>{/if}
				</label>
			{/if}
			{#if field.type === 'textarea'}
				<textarea
					id={`${cssnames.inputHeader}${groupid}${field.uid}`}
					name={field.name}
					placeholder={field.placeholder}
					disabled={field.disabled}
					aria-disabled={field.disabled}
					value={group === undefined
						? $FormStore.value[field.uid]
						: $FormStore.value[group.uid][field.uid]}
					on:focus={() => functions.onFocus(field.uid, group?.uid)}
					on:blur={() => functions.onBlur(field.uid, group?.uid)}
					on:input={async (event) => await functions.updateField(event, field.uid, group?.uid)}
				/>
			{:else if field.type === 'file' && field.custom}
				<button
					id={`${cssnames.inputHeader}${groupid}${field.uid}`}
					name={field.name}
					title={`click to choose ${field.multiple ? `files` : `a file`} or drag and drop ${
						field.multiple ? `files` : `a file`
					} onto the button`}
					on:click={(event) => {
						event.preventDefault();
						document.getElementById(`${cssnames.inputHeader}${field.uid}`).click();
					}}
					on:drop={null}
					on:dragenter={null}
					on:dragover={null}
					on:dragleave={null}
				>
					{$FormStore.data[field.uid]
						? $FormStore.data[field.uid].name
						: `click to choose ${field.multiple ? `files` : `a file`}`}
				</button>
				<input
					id={`${cssnames.inputHeader}${groupid}${field.uid}`}
					name={field.name}
					type={field.type}
					accept={field.accept}
					placeholder={field.placeholder}
					disabled={field.disabled}
					aria-disabled={field.disabled}
					aria-hidden
					style={`display: none`}
					on:focus={() => functions.onFocus(field.uid, group?.uid)}
					on:blur={() => functions.onBlur(field.uid, group?.uid)}
					on:input={async (event) => await functions.updateField(event, field.uid, group?.uid)}
				/>
			{:else if ['dropdown', 'radio', 'checkbox'].includes(field.type)}
				<Dropdown
					id={`${cssnames.inputHeader}${groupid}${field.uid}`}
					name={field.name}
					type={field.type}
					placeholder={field.placeholder}
					disabled={field.disabled}
					multiple={field.multiple}
					options={field.options}
					value={field.type === 'file'
						? null
						: group === undefined
						? $FormStore.value[field.uid]
						: $FormStore.value[group.uid][field.uid]}
					focus={() => functions.onFocus(field.uid, group?.uid)}
					blur={() => functions.onBlur(field.uid, group?.uid)}
					input={async (event) => await functions.updateField(event, field.uid, group?.uid)}
				/>
			{:else}
				<input
					id={`${cssnames.inputHeader}${groupid}${field.uid}`}
					name={field.name}
					type={field.type}
					accept={field.accept}
					placeholder={field.placeholder}
					autocomplete={field.autocomplete}
					disabled={field.disabled}
					aria-disabled={field.disabled}
					multiple={field.multiple ? true : null}
					value={field.type === 'file'
						? null
						: group === undefined
						? $FormStore.value[field.uid]
						: $FormStore.value[group.uid][field.uid]}
					on:focus={() => functions.onFocus(field.uid, group?.uid)}
					on:blur={() => functions.onBlur(field.uid, group?.uid)}
					on:input={async (event) => await functions.updateField(event, field.uid, group?.uid)}
				/>
			{/if}
		{/if}
	{/if}
	{#if field.tooltip}
		<div class="container-tooltip">{field.tooltip}</div>
	{/if}
	{#if field.validity}
		<div class="container-validity" id={`${cssnames.inputFeedback}${groupid}${field.uid}`} />
	{/if}
	{#if field.preview}
		<div
			class={`container-preview ${field.redact ? 'redact-preview' : ''}`}
			id={`${cssnames.inputPreview}${groupid}${field.uid}`}
		/>
	{/if}
</div>
