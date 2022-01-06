<script>
	import Form from '../components/svelte-forms/Form.svelte';
	let toggleForm = true;
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

<div class="container">
	<h1>Forms on Svelte</h1>
	<button on:click={() => (toggleForm = !toggleForm)}>Toggle Form</button>

	<!-- 

    :: FORM ::
    title
    type
    saveToLocal
    saveToCloud
        save()
        getSave()
    fields
    style


    :: FIELDS ::
    id
    title
    type
    defaultValue
    placeholder
    tooltip
    validation
        expression
        feedback
    required
    disabled
    hidden

    :: GROUPS ::
    auto
    hidden

 -->
	{#if toggleForm}
		<Form
			title="Sample form"
			id="this-is-optional"
			debug
			saveToLocal
			fields={[
				[
					{
						uid: 'asddds',
						name: 'Your email -.-',
						type: 'email',
						defaultValue: 'hmm',
						tooltip: 'haha good luck',
						validity: function (value) {
							return {
								'first one': {
									check: true,
									string: 'good job'
								},
								'second one': {
									check: 0 < value.length,
									string: 'email is not empty'
								}
							};
						}
					},
					{
						uid: 'dadffa',
						name: 'First Name',
						type: 'text',
						defaultValue: 'hmm',
						required: true,
						redact: true
					},
					{
						uid: 'idk',
						name: 'Last Name',
						type: 'text',
						defaultValue: 'hmm',
						required: true,
						redact: true
					},
					{
						uid: 'filetype24',
						name: 'upload 1 file',
						type: 'file',
						defaultValue: '',
						preview: true
					},
					{
						uid: 'filetype234',
						name: 'uploading file(s)',
						type: 'file',
						defaultValue: '',
						preview: true,
						multiple: true,
						dontSave: true
					},
					{
						uid: 'id234k',
						name: 'some text block stuff',
						type: 'textarea',
						defaultValue: 'hmm',
						required: true,
						redact: true
					}
				]
			]}
		/>
	{/if}
</div>

<style>
	* {
		overflow: hidden;

		font-size: 16px;
		font-family: Verdana, Geneva, Tahoma, sans-serif;
		color: black;
	}
	div.container {
		width: 100%;
		min-height: 100vh;
		background-color: white;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		overflow-y: scroll;
	}
	h1 {
		padding-top: 2em;
		font-size: 2em;
	}
	button {
		margin: 1em 0 2em 0;
	}
</style>
