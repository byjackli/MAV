<script>
	import { onMount } from 'svelte';
	import Extensions from './extensions.json';
	import Field from './Field.svelte';
	import NameStore from './NameStore';
	import FormStore, {
		setEntry,
		getEntry,
		existsEntry,
		updateSave,
		clearSave,
		loadSave,
		belongs
	} from './FormStore';
	// NOTES: implement saveToCloud at critical points
	//  ie setInterval, onVisibilityChange, onbeforeunload, changePage, manual saves

	export let title,
		id = null,
		autocomplete = true,
		fullscreen = false,
		saveToLocal = false, // managed by Form (automatic)
		saveToCloud = false, // managed by developer (manual)
		fields,
		debug = false,
		onSubmit;

	let loading = true,
		submitting = false,
		debugData = null,
		section = null,
		autoNav = [];

	// let page = 0,
	// 	data = {},
	// 	required = {},
	// 	validity = {},
	// 	verdict = {},
	// 	preview = {},
	// 	value = {},
	// 	redact = {},
	// 	touched = {},
	// 	active = {},
	// 	dontSave = {};

	export function spit() {
		return $FormStore;
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

	async function submit() {
		const greenlight = (await checkValidity()).verdict;

		setEntry('submit', true, 'submitting');
		setEntry('submit', true, 'attempted');

		if (!greenlight) {
			//  updateFeedback
			for (const [key, value] of Object.entries($FormStore.verdict)) {
				if (belongs(value, 'group')) {
					for (const nested of Object.entries(value))
						if (!nested[1].verdict) updateFeedback(nested[0], key, nested[1]);
				} else if (!value.verdict)
					updateFeedback(key, undefined, await checkValidity('field', key, undefined));
			}

			//  updateWarn
			for (const [key, value] of Object.entries($FormStore.required)) {
				if (typeof value !== 'boolean') {
					for (const nested of Object.entries(value))
						updateWarn(nested[0], key, !(nested[1] && checkEmpty(nested[0], key)));
				} else updateWarn(key, undefined, !(value && checkEmpty(key, undefined)));
			}

			setEntry('submit', false, 'accepted');
		} else if (onSubmit) {
			const success = await onSubmit($FormStore);
			setEntry('submit', success, 'accepted');
		} else setEntry('submit', true, 'accepted');

		setEntry('submit', false, 'submitting');
		updateDebug();
	}

	function checkEmpty(fieldid, groupid) {
		const field = fieldData({ action: 'get' }, fieldid, groupid);
		return field === '' || field === undefined || field === null;
	}

	export async function checkValidity(type, fieldid, groupid) {
		if (type === 'form' || fieldid === undefined) {
			for (const block of Object.values(getEntry('verdict'))) {
				const verdict = block.group ? block.group.verdict : block.verdict;
				if (!verdict) return { verdict };
			}
			return { verdict: true };
		}

		const isEmpty = checkEmpty(fieldid, groupid),
			isRequired = getEntry('required', fieldid, groupid);

		let verdict = isRequired ? !(isRequired && isEmpty) : true,
			raw = [],
			group = undefined;

		if (type === 'field') {
			const func = getEntry('validity', fieldid, groupid);
			if (func) {
				const conditions = func(fieldData({ action: 'get' }, fieldid, groupid));
				for (const condition of Object.values(conditions)) {
					const expression = await condition.check,
						feedback = condition[expression] === undefined ? condition.true : condition[expression];

					verdict = verdict && expression;
					raw.push({ verdict: expression, feedback });
				}
			}
		}
		setEntry('verdict', { verdict, raw }, fieldid, groupid);

		if ((groupid && getEntry('group', groupid).required) || type === 'group') {
			group = { verdict: true, raw: [] };

			for (const [key, value] of Object.entries(getEntry('verdict', groupid))) {
				if (key === 'group') continue;
				group.verdict = group.verdict && value.verdict;
				group.raw.push(...value.raw);
			}
			setEntry('verdict', group, 'group', groupid);
		}

		return { verdict, raw };
	}
	async function updateFeedback(fieldid, groupid, validation) {
		const groupOnly = groupid && getEntry('group', groupid).feedback;
		let { verdict, raw } = validation,
			block = document.getElementById(`${$NameStore.inputFeedback}${utos(groupid)}${fieldid}`);

		if (groupOnly) {
			block = document.getElementById(`${$NameStore.groupFeedback}${groupid}`);
			raw = getEntry('verdict', groupid).group.raw;
		}

		function build(feedback, expression) {
			const p = document.createElement('p'),
				t = document.createTextNode(feedback);

			p.classList.add(`condition-${expression}`);
			p.appendChild(t);
			return p;
		}

		block.innerHTML = '';
		for (const { feedback, verdict } of raw) block.appendChild(build(feedback, verdict));
		updateWarn(fieldid, groupid, verdict);
	}
	function updateWarn(fieldid, groupid, fieldVerdict) {
		const block = document.getElementById(`${$NameStore.blockHeader}${utos(groupid)}${fieldid}`),
			blockWarned = block?.classList.contains($NameStore.warn);

		if (fieldVerdict === blockWarned) block.classList.toggle($NameStore.warn);
		if (groupid && getEntry('group', groupid).required) {
			const group = document.getElementById(`${$NameStore.groupHeader}${groupid}`),
				groupWarned = group.classList.contains($NameStore.warn),
				groupVerdict = getEntry('verdict', groupid).group.verdict;
			if ((!groupWarned && !groupVerdict) || (groupWarned && groupVerdict))
				group.classList.toggle($NameStore.warn);
		}
	}
	function updatePreview(fieldid, groupid) {
		const files = fieldData({ action: 'get' }, fieldid, groupid),
			block = document.getElementById(`${$NameStore.inputPreview}${utos(groupid)}${fieldid}`);

		let strings = ``;
		for (const { base64, meta } of files) {
			console.info('%c BLOB OF FILE', 'background-color: red; color: white;', getBlob(base64));
			let ext = meta.name.split('.');
			ext = Extensions[ext[ext.length - 1]];

			if (ext === undefined) ext = 'insert_drive_file';
			strings += `<div class="preview" title="${meta.name}"><span class="material-icons">${ext}</span><p>${meta.name}</p></div>`;
		}
		console.info('%c Preview ', 'background-color: indigo; color: skyblue; ', files);

		block.innerHTML = strings;
	}
	async function updateField(event, fieldid, groupid) {
		let value = event.target.value;
		if (event.type === 'drop' || event.target.files) {
			value =
				event.type === 'drop' ? event.dataTransfer.files[0] : await getData(event.target.files);
		} else if (event.type === 'dropdown') value = event.data;
		fieldData({ action: 'set', data: value }, fieldid, groupid);

		if (getEntry('preview', fieldid, groupid)) updatePreview(fieldid, groupid);
		if (getEntry('validity', fieldid, groupid))
			updateFeedback(fieldid, groupid, await checkValidity('field', fieldid, groupid));
		else if (getEntry('required', fieldid, groupid))
			updateWarn(
				fieldid,
				groupid,
				!(getEntry('required', fieldid, groupid) && checkEmpty(fieldid, groupid))
			);

		updateSave(id, title, true, false);
		updateDebug();
	}
	function updateDebug() {
		debugData = JSON.stringify({ ...$FormStore }, null, 4);
	}

	async function onFocus(fieldid, groupid) {
		setEntry('touched', true, fieldid, groupid);
		setEntry('active', true, fieldid, groupid);
		if (getEntry('redact', fieldid, groupid))
			setEntry(
				'value',
				fieldData({ action: `exists` }, fieldid, groupid)
					? fieldData({ action: 'get' }, fieldid, groupid)
					: '',
				fieldid,
				groupid
			);
		if (getEntry('validity', fieldid, groupid)) {
			const result = await checkValidity('field', fieldid, groupid);
			if (!result.verdict) updateFeedback(fieldid, groupid, result);
		} else if (getEntry('required', fieldid, groupid))
			updateWarn(
				fieldid,
				groupid,
				!(getEntry('required', fieldid, groupid) && checkEmpty(fieldid, groupid))
			);
		updateDebug();
	}
	function onBlur(fieldid, groupid) {
		setEntry('active', false, fieldid, groupid);
		if (getEntry('redact', fieldid, groupid)) setEntry('value', '[redacted]', fieldid, groupid);

		updateDebug();
	}

	function fieldData(payload, fieldid, groupid) {
		const dontSave = existsEntry('dontSave', fieldid, groupid),
			verdict = dontSave || (payload.verdict !== undefined && payload.verdict);

		if (['set', 'init'].includes(payload.action))
			return verdict
				? setEntry('dontSave', { verdict, data: payload.data }, fieldid, groupid)
				: setEntry('data', payload.data, fieldid, groupid);
		else if (payload.action === 'get')
			return verdict
				? getEntry('dontSave', fieldid, groupid).data
				: getEntry('data', fieldid, groupid);
		else if (payload.action === 'exists') return dontSave || existsEntry('data', fieldid, groupid);
	}

	// TO DO: Turn this feature into a service worker.
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

	function loadGroup(group) {
		setEntry('group', group, group.uid);
	}
	async function loadField(field, group) {
		const verdict = field.dontSave || group?.dontSave;

		if (!fieldData({ action: 'exists' }, field.uid, group?.uid)) {
			const blank = ['file'].includes(field.type) ? undefined : '',
				data = field.defaultValue ? field.defaultValue : blank;
			fieldData({ verdict, action: 'init', data }, field.uid, group?.uid);
			setEntry('value', data, field.uid, group?.uid);
		}
		if (field.redact || (group && group.redact)) {
			setEntry('redact', group ? group.redact : field.redact, field.uid, group?.uid);
			setEntry('value', '[redacted]', field.uid, group?.uid);
		} else {
			setEntry(
				'value',
				fieldData({ verdict, action: 'exists' }, field.uid, group?.uid)
					? fieldData({ verdict, action: 'get' }, field.uid, group?.uid)
					: setEntry('value', '', field.uid, group?.uid),
				field.uid,
				group?.uid
			);
		}

		setEntry('active', false, field.uid, group?.uid);
		if (field.required || (group && group.required))
			setEntry('required', group ? group.required : field.required, field.uid, group?.uid);

		if (field.validity) {
			setEntry('validity', field.validity, field.uid, group?.uid);
			await checkValidity('field', field.uid, group?.uid);
		}

		if (field.preview) {
			setEntry('preview', true, field.uid, group?.uid);
			if (fieldData({ action: 'get' }, field.uid, group?.uid)) updatePreview(field.uid);
		}
	}
	function loadAllFields() {
		fields.forEach((block) => {
			if (Array.isArray(block)) {
				block.forEach((field, i) => {
					if (i) loadField(field, block[0]);
					else loadGroup(block[0]);
				});
			} else loadField(block);
		});
	}

	function utos(u) {
		return u === undefined ? '' : u;
	}

	onMount(() => {
		console.info(
			'This app takes advantage of Sad Form technology.\nLearn more at https://sadform.com'
		);
		loading = false;

		loadSave(id, title, true, false);
		loadAllFields();
		updateSave(id, title, true, false);
		updateDebug();

		if (fullscreen) section = fields[0];
	});
</script>

<!-- <svelte:window on:keydown={changePageShortcut} /> -->

<div class="form-container" {id}>
	{#if fields && !loading}
		{#if !fullscreen}<h2>{title}</h2>{/if}
		<form autocomplete={autocomplete ? 'on' : 'off'}>
			{#each fields as group (group)}
				{#if Array.isArray(group)}
					<div role="group" class="form-group" id={`${$NameStore.groupHeader}${group[0].uid}`}>
						{#if !group[0].hideLabel}
							<legend>
								{group[0].name}
								{#if group[0].required}<em>*required</em>{/if}
							</legend>
						{/if}
						{#each group as field, i}
							{#if i}
								<Field {field} group={group[0]} functions={{ onFocus, onBlur, updateField }} />
							{/if}
						{/each}
						{#if group[0].feedback}
							<div class="form-group-feedback" id={`${$NameStore.groupFeedback}${group[0].uid}`} />
						{/if}
					</div>
				{:else}
					<Field field={group} functions={{ onFocus, onBlur, updateField }} />
				{/if}
			{/each}
			<input type="submit" on:click|preventDefault={submit} />
		</form>
		{#if debug}
			<details>
				<summary>DEBUG</summary>
				<div>
					<div>
						<code>
							{debugData}
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
