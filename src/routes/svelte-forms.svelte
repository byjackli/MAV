<script>
	import Form from '../components/svelte-forms/Form.svelte';
	let toggleForm = true,
		createForm = false,
		cfContainer = undefined;

	async function toggleCreate() {
		createForm = !createForm;
		if (createForm)
			cfContainer = (await import('../components/svelte-forms/create-form.svelte')).default;
	}

	let formDeets;
	function printContents() {
		console.info('PRINTING FROM /svelte-forms ', { spit: formDeets.spit(), formDeets });
	}
</script>

<svelte:head>
	<title>Svelte Forms - Experiments by Jack Li</title>
	<meta name="description" content="Form creator for Svelte projects." />
	<meta
		name="keywords"
		content="svelte, forms, formik, form generator, form creator, computer science, front end, front-end, developer, software, projects, mini-projects, svelte, sveltekit, github, fun, leetcode"
	/>
	<meta name="og:title" content="Svelte Forms - Experiments by Jack Li" />
	<meta name="og:description" content="Form creator for Svelte projects." />
	<meta name="og:url" content="https://experiments.byjackli.com/svelte-forms" />
	<meta name="og:type" content="website" />
</svelte:head>

<div class="container" id="svelte-forms">
	<h1>Forms on Svelte</h1>
	<br />
	<p>
		UPDATE: This project has now matured into its own full blown <a
			href="https://github.com/byjackli/sadforms"
			rel="noreferrer">repository</a
		>.
	</p>
	<br />
	<p>
		I am excited to share <a href="https://sadforms.com" rel="noreferrer">Sad Forms</a> with you! It
		is a Svelte Form package and a form builder tool!
	</p>
	<br />
	<button on:click={() => (toggleForm = !toggleForm)}>Toggle Form</button>
	<button on:click={printContents}>Print Deets to Console</button>

	<!-- 

    :: FORM ::
    title
    type
	autocomplete
    saveToLocal
    saveToCloud
        save()
        getSave()
    fields
    style


	:: GROUPS ::
	id
	title
	hidden
	feedback


    :: FIELDS ::
    id
    title
    type
    defaultValue
    placeholder
	autocomplete
    tooltip
    validation
        expression
        feedback
    required
    disabled
    hidden

    :: SUPPORTED FIELDS ::
	textarea
    text
	email
	tel
	password
	number
	file


	:: UNSUPPORTED - COMING SOON ::
	dropdown (can cover radio + checkbox)
	radio
	checkbox
	url
	slider
	color
	datetime-local
	date
	time

	:: UNSUPPORTED - NO PLANS ::
	search
	submit
	reset
	image
 -->
	<div>
		<button on:click={toggleCreate}> create form + </button>
		{#if createForm}
			<!-- <svelte:component this={cfContainer} /> -->
		{/if}
	</div>
	{#if toggleForm}
		<Form
			bind:this={formDeets}
			title="Sample form"
			id="this-is-optional"
			debug
			saveToLocal
			onSubmit={null}
			fields={[
				{
					uid: 'myemailfield',
					name: 'Your email -.-',
					type: 'email',
					defaultValue: 'hmm',
					tooltip: 'haha good luck',
					dontSave: true,
					validity: function (value) {
						return {
							'first one': {
								check: true,
								true: 'good job, idrc, there are no sanity checks'
							},
							'second one': {
								check: value !== undefined && 0 < value.length,
								true: 'email is not empty'
							}
						};
					}
				},
				{
					uid: 'mynumberfield',
					name: 'aye bruv, whats your fav numba?',
					type: 'number',
					defaultValue: '88888888',
					tooltip: `there are no wrong answers!`,
					validity: function (value) {
						return {
							'first one': {
								check: value !== undefined && value === '3474764944',
								true: 'sheeesh holla at me ;)',
								false: 'wrong! its my phone number.'
							}
						};
					}
				},
				{
					uid: 'mycolorfield',
					name: 'wb your fav color?',
					type: 'color',
					tooltip: `stg, there are no wrong answers for this one.`,
					validity: function (value) {
						return {
							'first one': {
								check: value !== undefined && value === '#000000',
								true: `just kidding 😭😭 you're  amazing`,
								false: 'WRONG, ITS PITCH BLACK LIKE YOUR SOUL'
							}
						};
					}
				},
				{
					uid: 'myfirstnamefield',
					name: 'First Name',
					type: 'text',
					defaultValue: 'hmm',
					required: true,
					redact: true
				},
				{
					uid: 'mylastnamefield',
					name: 'Last Name',
					type: 'text',
					defaultValue: 'hmm',
					required: true,
					redact: true
				},
				{
					uid: 'singlefile',
					name: 'upload 1 file',
					type: 'file',
					defaultValue: '',
					preview: true,
					dontSave: true
				},
				{
					uid: 'multifiles',
					name: 'uploading file(s)',
					type: 'file',
					defaultValue: '',
					preview: true,
					multiple: true,
					dontSave: true,
					redact: true
				},
				{
					uid: 'justtextarea',
					name: 'some text block stuff',
					type: 'textarea',
					defaultValue: 'hmm',
					required: true,
					redact: true
				},
				{
					uid: 'mytimefield',
					name: 'sooo what time are you available?',
					type: 'time',
					required: true
				},
				{
					uid: 'mytelfield',
					name: 'harddest question: what is your phone number? 😉',
					type: 'tel',
					tooltip: `10 digit number`,
					required: true,
					redact: true,
					validity: function (value) {
						return {
							'first one': {
								check:
									value !== undefined &&
									value.match(/^[0-9]{10}$/) !== null &&
									value !== '3474764944',
								true: `uwu thanks ok bye!`,
								false: '<strong>bruv, fix this asap >:(</strong>'
							},
							bruh: {
								check: value !== undefined && value !== '3474764944',
								true: ``,
								false: 'dude.. you cant just put in my number lol'
							}
						};
					}
				},
				[
					{
						uid: 'mycardinformationgroup',
						name: 'Card information',
						feedback: true,
						required: true,
						redact: true
					},
					{
						uid: 'ccnumber',
						name: 'Card number',
						hideLabel: true,
						type: 'text',
						placeholder: 'Card number',
						autocomplete: 'cc-number',
						dontSave: true,
						validity: function (value) {
							return {
								good: {
									check: value !== undefined && 0 < value.length,
									true: `CC number, is not empty`
								}
							};
						}
					},
					{
						uid: 'ccexp',
						name: 'Expiration Date',
						hideLabel: true,
						type: 'text',
						placeholder: 'Expiration Date',
						autocomplete: 'cc-exp',
						validity: function (value) {
							return {
								good: {
									check: value !== undefined && value.match(/^[0-9]{3}$/) !== null,
									true: `CC expire, is a 3 digit number`
								}
							};
						}
					},
					{
						uid: 'cccsc',
						name: 'CVC',
						hideLabel: true,
						type: 'text',
						placeholder: 'CVC',
						autocomplete: 'cc-csc',
						validity: function (value) {
							return {
								good: {
									check: value !== undefined && !!value.length,
									true: `👍 CVC is not empty`,
									false: `👎 CVC cannot be empty.`,
									loading: `⏳ confirming with the bank... please wait.`
								}
							};
						}
					},
					{
						uid: 'ccname',
						name: 'Name on card',
						defaultValue: 'Bill Gates',
						hideLabel: true,
						type: 'text',
						placeholder: 'Name on card',
						autocomplete: 'cc-number'
					}
				],
				{
					uid: 'mydropdown',
					name: 'Favorite Ice Cream Brand(s)',
					type: 'dropdown',
					multiple: true,
					dontSave: false,
					required: true,
					redact: true,
					compact: true,
					options: [
						{ uid: 'option1', name: 'Klondike bar' },
						{ uid: 'option2', name: "Ben & Jerry's" },
						{ uid: 'option3', name: "Breyer's" },
						{ uid: 'option4', name: 'Haagen-Dazs' },
						{ uid: 'option5', name: 'Turkey Hill' },
						{ uid: 'option6', name: 'Dairy Queen' }
					]
				},
				{
					uid: 'mydropdown2',
					name: 'Favorite Car',
					type: 'dropdown',
					dontSave: false,
					required: true,
					placeholder: 'You can only pick one.',
					options: [
						{ uid: 'option1', name: 'Honda Odyssey' },
						{ uid: 'option2', name: 'Nissan GTR R34' },
						{ uid: 'option3', name: 'Corvette CR1' },
						{ uid: 'option4', name: 'Corvette CR4' },
						{ uid: 'option5', name: 'F-150 Lightning' },
						{ uid: 'option6', name: 'Nissan Altima' }
					]
				},
				{
					uid: 'mycheckbox',
					name: 'Should I bring my camera?',
					type: 'checkbox',
					redact: true,
					placeholder: 'errrr',
					options: [{ uid: 'ok', name: 'yes' }]
				}
			]}
		/>
	{/if}
</div>

<style>
	#svelte-forms * {
		overflow: hidden;

		font-size: 16px;
		font-family: Verdana, Geneva, Tahoma, sans-serif;
		color: black;
	}
	#svelte-forms {
		width: 100%;
		min-height: 100vh;
		background-color: white;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		overflow-y: scroll;
	}
	#svelte-forms h1 {
		padding-top: 2em;
		font-size: 2em;
	}
	#svelte-forms button {
		margin: 1em 0 2em 0;
	}
</style>
