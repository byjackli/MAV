<script>
	let createForm = false;

	function toggle() {
		createForm = !createForm;
	}
</script>

<code>
	{`<Form
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
								string: 'good job, idrc, there are no sanity checks'
							},
							'second one': {
								check: 0 < value.length,
								string: 'email is not empty'
							}
						};
					}
				},
				{
					uid: 'num',
					name: 'aye bruv, whats your fav numba?',
					type: 'number',
					defaultValue: '88888888',
					tooltip: 'there are no wrong answers!',
					validity: function (value) {
						return {
							'first one': {
								check: value === '3474764944',
								true: 'sheeesh holla at me ;)',
								false: 'wrong! its my phone number.'
							}
						};
					}
				},
				{
					uid: 'color',
					name: 'wb your fav color?',
					type: 'color',
					tooltip: 'stg, there are no wrong answers for this one.',
					validity: function (value) {
						return {
							'first one': {
								check: value === '#000000',
								true: 'just kidding 😭😭 you're  amazing',
								false: 'WRONG, ITS PITCH BLACK LIKE YOUR SOUL'
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
				},
				{
					uid: 'tel',
					name: 'harddest question: what is your phone number? 😉',
					type: 'tel',
					tooltip: '10 digit number',
					required: true,
					redact: true,
					validity: function (value) {
						console.info(
							'%c INCOMING VALUE ',
							'padding: 5px; background-color: orange; color: brown;',
							value.match(/^[0-9]{10}$/)
						);
						return {
							'first one': {
								check: value.match(/^[0-9]{10}$/) !== null && value !== "3474764944",
								true: 'uwu thanks ok bye!',
								false: 'bruv, fix this asap >:(</Form>'
							},
							'bruh': {
								check: value !== "3474764944",
								true: '',
								false: 'dude.. you cant just put in my number lol'
							}
						};
					}
				}
			]
		]}
	/>`}
</code>

<style>
	code {
		width: 25%;
		color: black;
		font-size: small;
		font-family: monospace;

		white-space: pre-wrap; /* Since CSS 2.1 */
		white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
		white-space: -pre-wrap; /* Opera 4-6 */
		white-space: -o-pre-wrap; /* Opera 7 */
		word-wrap: break-word; /* Internet Explorer 5.5+ */
	}
</style>
