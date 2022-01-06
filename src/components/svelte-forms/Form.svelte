<script>
	import { onMount } from 'svelte';
	import Extensions from './extensions.json';
	// NOTES: implement saveToCloud at critical points
	//  ie setInterval, onVisibilityChange, onbeforeunload, changePage, manual saves

	export let title,
		id = null,
		fullscreen = false,
		saveToLocal = false, // managed by Form (automatic)
		saveToCloud = false, // managed by developer (manual)
		fields,
		debug = false;

	let loading = true,
		submitting = false,
		section = null,
		autoNav = [];

	let page = 0,
		data = {},
		required = {},
		validity = {},
		verdict = {},
		preview = {},
		redact = {},
		touched = {},
		active = {},
		dontSave = {};

	// CUSTOMIZATION FEATURES (CSS NAMES)
	const warn = 'warn',
		blockHeader = 'form:block/',
		inputHeader = 'form:input/',
		inputValidate = 'form:input-validate/',
		inputPreview = 'form:input-preview/';

	function updateSave() {
		const saveData = { page, data };

		if (saveToLocal) {
			for (const field of Object.keys(dontSave)) data[field] = undefined;
			localStorage.setItem(`form[localSave]: ${title}`, JSON.stringify(saveData));
		}
	}
	async function getSave() {
		if (saveToLocal) {
			const saveData = localStorage.getItem(`form[localSave]: ${title}`);
			if (saveData) ({ page, data } = JSON.parse(saveData));
		}
		// if (saveToCloud) ({ page, data } = await saveToCloud.getSave());
	}

	// function changePage(value) {
	//     const navShow = this.state.navShow,
	//         navHide = this.state.navHide,
	//         navAuto = this.state.navAuto,
	//         maxPage = navShow.length + navHide.length,
	//         prev = this.state.cursor - 1;

	//     if (!navAuto.includes(cursor) || auto) {
	//         if (value === `-1` && 0 < cursor) {
	//             if (navHide.includes(prev)) {
	//                 for (const [i, el] of navShow.entries()) {
	//                     if (prev < el && 0 <= i - 1) {
	//                         cursor = navShow[i - 1];
	//                         break;
	//                     }
	//                 }
	//             } else {
	//                 cursor -= 1;
	//             }
	//         } else if (
	//             value === `+1` &&
	//             cursor + 1 < maxPage &&
	//             this.checkValidity(cursor)
	//         ) {
	//             cursor += 1;
	//         } else if (value !== `+1` && value !== `-1`) {
	//             if (value < cursor) {
	//                 cursor = value;
	//             } else if (cursor < value && this.checkValidity(value - 1)) {
	//                 cursor = value;
	//             }
	//         }
	//         this.setState({ cursor });
	//     }
	// }
	// function changePageShortcut(event) {
	//     if (!fullscreen) return;
	//     if (event.key === `Enter`) {
	//         event.preventDefault();
	//         if (event.ctrlKey && event.shiftKey) changePage(`-1`);
	//         else if (event.shiftKey) changePage(`+1`);
	//     }
	// }

	function checkEmpty(uid) {
		const field = data[uid];
		return !(field !== '' && field !== undefined && field !== null);
	}

	function checkValidity(group) {
		let localVerdict = undefined;
		if (!group)
			return Object.values(validity).reduce(
				(localVerdict, currentVerdict) => localVerdict && currentVerdict
			);

		for (const uid of group) {
			localVerdict =
				localVerdict ??
				required[uid] ??
				validity[uid] ??
				(data[uid] !== undefined && data[uid] !== '');
		}
		return localVerdict;
	}

	async function updateFeedback(uid) {
		const conditions = validity[uid](data[uid]),
			ivBlock = document.getElementById(`${inputValidate}${uid}`);

		let localVerdict = true,
			strings = ``;

		for (const condition of Object.values(conditions)) {
			const check = await condition.check;

			localVerdict = localVerdict && check;
			strings += `<p class='condition-${check}'>${condition.string}</p>`;
		}
		// required, touched, empty ==>

		ivBlock.innerHTML = strings;
		verdict[uid] = localVerdict;
	}
	function updatePreview(uid) {
		const files = data[uid],
			ipBlock = document.getElementById(`${inputPreview}${uid}`);

		let strings = ``;
		for (const { base64, meta } of files) {
			console.info('%c BLOB OF FILE', 'background-color: red; color: white;', getBlob(base64));
			let ext = meta.name.split('.');
			ext = Extensions[ext[ext.length - 1]];

			if (ext === undefined) ext = 'insert_drive_file';
			strings += `<div class="preview" title="${meta.name}"><span class="material-icons">${ext}</span><p>${meta.name}</p></div>`;
		}
		console.info('%c Preview ', 'background-color: indigo; color: skyblue; ', files);

		ipBlock.innerHTML = strings;
	}
	function updateWarn(uid) {
		const block = document.getElementById(`${blockHeader}${uid}`);
		if (required[uid] && checkEmpty(uid)) block.classList.add(warn);
		else block.classList.remove(warn);
	}
	function onFocus(uid) {
		touched[uid] = true;
		active[uid] = true;
		updateWarn(uid);
	}
	function onBlur(uid) {
		active[uid] = false;
	}
	async function updateField(event, uid) {
		if (event.type === 'drop' || event.target.files) {
			console.info(`Hello! Looks like you're uploading a file!`, event.target.files);

			data[uid] =
				event.type === 'drop' ? event.dataTransfer.files[0] : await getData(event.target.files);
		} else {
			data[uid] = event.target.value;
		}

		if (required[uid]) updateWarn(uid);
		if (validity[uid]) updateFeedback(uid);
		if (preview[uid]) updatePreview(uid);
		updateSave();
	}
	async function getData(input) {
		let arr = [];
		for (const file of Object.values(input)) {
			console.info(file);
			const meta = {
					name: file.name,
					lastModified: file.lastModified,
					lastModifiedDate: file.lastModifiedDate
				},
				base64 = await getBase64(file);
			console.info('%c file: ', 'background-color: brown; color: orange; ', base64);
			arr.push({ base64, meta });
		}

		return arr;
	}

	async function getBase64(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);

			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	}
	async function getBlob(base64) {
		const res = await fetch(base64),
			blob = await res.blob();
		return blob;
	}

	function loadFields() {
		section = fields.flat();
		section.forEach((field) => {
			data[field.uid];
			active[field.uid] = false;
			if (field.required) required[field.uid] = field.required;
			if (field.validity) {
				validity[field.uid] = field.validity;
				verdict[field.uid] = false;
			}
			if (field.preview) preview[field.uid] = true;
			if (field.redact) redact[field.uid] = true;
			if (field.defaultValue) data[field.uid] = field.defaultValue;

			if (field.preview && data[field.uid]) updatePreview(field.uid);
			if (field.dontSave) dontSave[field.uid] = true;
		});
	}

	onMount(async () => {
		console.info(
			'This app takes advantage of Sad Form technology.\nLearn more at https://sadform.com'
		);
		loading = false;

		loadFields();
		await getSave();

		if (fullscreen) section = fields[0];
	});
</script>

<!-- <svelte:window on:keydown={changePageShortcut} /> -->

<div class="form-container" {id}>
	{#if section && !loading}
		{#if !fullscreen}<h2>{title}</h2>{/if}
		<form on:submit={(event) => event.preventDefault()}>
			{#each section as field (field.uid)}
				<div class="form-block" id={`${blockHeader}${field.uid}`}>
					{#if !field.hidden}
						{#if field.type && field.type === 'custom'}
							<div>{fields.body}</div>
						{:else}
							<label for={`${inputHeader}${field.uid}`}>
								{field.name}
								{#if field.required}<em>*required</em>{/if}
							</label>
							{#if field.type === 'textarea'}
								<textarea
									id={`${inputHeader}${field.uid}`}
									name={field.name}
									placeholder={field.placeholder}
									disabled={field.disabled}
									aria-disabled={field.disabled}
									value={redact[field.uid] && !active[field.uid] ? '[redacted]' : data[field.uid]}
									on:focus={() => onFocus(field.uid)}
									on:blur={() => onBlur(field.uid)}
									on:input={async (event) => await updateField(event, field.uid)}
								/>
							{:else if field.type === 'file' && field.custom}
								<!-- 
								an alternative to creating an entirely separate button with drag drop handles

								 ===== STYLE 1 (not sure how to handle preview)
								1. create invisible input
								2. custom styling underneath
								3. wrap both in a div (for easy custom styling)

								x. documentation on how to custom style


								 ===== STYLE 2 (not sure how to handle preview)
								1. button, drop off area from scratch
								2. associated button handlers
								3. associated drop off area handlers
								4. 
								
							
							-->
								{#if field.preview}
									<div id={`${inputPreview}${field.uid}`}>preview enabled</div>
								{/if}
								<!-- 
                                handle case for images and documents
                                    - should we have a preview option?
                                        - if yes, how do we differentiate docs
                                        - what type of docs can we preview?
                                        - how do we preview those docs?
                                > ANSWER:
                                    - yes, there should be a preview option
                                        - check filetype, PDF & images work fine
                                        - cannot preview any docs
                                        - online use gDocs. offline, use icon

                                
                                should we offer saving files offline?
                                    - if yes, how do we save files offline?
                                > ANSWER: 
                                    to store, convert to base64; 
                                    to read, convert to blob
                                

                                different API for
                                    - image compression?
                                    - file validation?
                                        - file size
                                        - file date
                                        - file namingBLUE
                                        - file structure..?
                            -->
								<button
									name={field.name}
									title={`click to choose ${field.multiple ? `files` : `a file`} or drag and drop ${
										field.multiple ? `files` : `a file`
									} onto the button`}
									on:click={(event) => {
										event.preventDefault();
										document.getElementById(`${inputHeader}${field.uid}`).click();
									}}
									on:drop={null}
									on:dragenter={null}
									on:dragover={null}
									on:dragleave={null}
								>
									{data[field.uid]
										? data[field.uid].name
										: `click to choose ${field.multiple ? `files` : `a file`}`}
								</button>
								<input
									id={`${inputHeader}${field.uid}`}
									name={field.name}
									type={field.type}
									accept={field.accept}
									placeholder={field.placeholder}
									disabled={field.disabled}
									aria-disabled={field.disabled}
									aria-hidden
									style={`display: none`}
									on:focus={() => onFocus(field.uid)}
									on:blur={() => onBlur(field.uid)}
									on:input={async (event) => await updateField(event, field.uid)}
								/>
							{:else}
								<input
									id={`${inputHeader}${field.uid}`}
									name={field.name}
									type={field.type}
									accept={field.accept}
									placeholder={field.placeholder}
									disabled={field.disabled}
									aria-disabled={field.disabled}
									multiple={field.multiple ? true : null}
									value={field.type === 'file'
										? null
										: redact[field.uid] && !active[field.uid]
										? '[redacted]'
										: data[field.uid]}
									on:focus={() => onFocus(field.uid)}
									on:blur={() => onBlur(field.uid)}
									on:input={async (event) => await updateField(event, field.uid)}
								/>
							{/if}
						{/if}
					{/if}
					{#if field.tooltip}
						<div class="container-tooltip">{field.tooltip}</div>
					{/if}
					{#if field.validity}
						<div class="container-validity" id={`${inputValidate}${field.uid}`} />
					{/if}
					{#if field.preview}
						<div class="container-preview" id={`${inputPreview}${field.uid}`} />
					{/if}
				</div>
			{/each}
		</form>
		{#if debug}
			<details>
				<summary>DEBUG</summary>
				<div>
					<div>
						<code>
							{JSON.stringify(
								{ data, required, validity, verdict, active, redact, touched, fields },
								null,
								4
							)}
						</code>
					</div>
				</div>
			</details>
		{/if}
	{:else if loading}
		<div>loading forms!</div>
	{:else}
		<div>
			<p>The form you are looking for is currently unavailable.</p>
			<p>
				If you believe it should be, contact the developer and the person that sent you this link!
			</p>
		</div>
	{/if}
</div>

<style>
	* {
		box-sizing: border-box;
		width: 100%;

		font-family: Verdana, Geneva, Tahoma, sans-serif;
		font-size: 16px;
		color: black;
	}
	.form-container {
		width: 60%;
	}
	.form-container h2 {
		font-size: 1.5em;
		margin: 0;
	}

	.form-container,
	form {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;

		gap: 1.5em;
	}
	.form-container {
		margin: 2em;
		padding: 3em;
		border-radius: 1em;
		background-color: lavender;
	}
	.form-block {
		display: flex;
		flex-direction: column;
		gap: 0.25em;
	}
	.form-block button {
		font-family: inherit;
		padding: 1em;
		background-color: white;
		border: solid 0.25em darkslategray;
		border-radius: 0.25em;
	}
	.form-block input,
	.form-block textarea {
		padding: 1em;
		background-color: white;
		border: solid 0.25em darkslategray;
		border-radius: 0.25em;
	}
	.form-block textarea {
		height: 20em;
		overflow-y: scroll;
		resize: none;
	}

	/* DEBUG VIEW */
	details {
		margin-top: 3em;
	}
	summary {
		padding: 1em 0.5em;
		background-color: orange;
		font-family: monospace;
		font-weight: bold;
	}
	details div {
		padding: 2em;
	}
	details div > div {
		padding: 1em;
		background-color: beige;
	}
	code {
		width: 100%;
		font-family: monospace;

		white-space: pre-wrap; /* Since CSS 2.1 */
		white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
		white-space: -pre-wrap; /* Opera 4-6 */
		white-space: -o-pre-wrap; /* Opera 7 */
		word-wrap: break-word; /* Internet Explorer 5.5+ */
	}

	@media only screen and (max-width: 400px) {
		div.form-container {
			width: 95% !important;
			border-radius: 0.5em !important;
			padding: 1em !important;
		}
	}

	@media only screen and (min-width: 400px) and (max-width: 600px) {
		div.form-container {
			width: 85% !important;
			border-radius: 0.5em !important;
		}
	}
</style>
