<script lang="ts">
	import { onMount } from 'svelte';
	let listener = undefined, // status of "click" event listener on body
		body = undefined, // HTMLElement of document body
		modalManager = undefined, // HTMLElement containing all active modals
		trackDepth = 0, // number of active modals
		trackButton = [], // treated as stack
		trackBackdrop = [], // treated as stack
		trackModal = [], // treated as stack
		trackResume = [], // treated as stack
		focusable = undefined; // list of focusable elements

	// setp up automatic modal manager
	function init() {
		if (!body) body = document.getElementsByTagName('body')[0];
		if (!listener) listener = body.addEventListener('click', observeClicks);
		if (!modalManager && !document.getElementById('modal-manager')) {
			modalManager = createModalManager();
			body.prepend(modalManager);
		}
	}

	// listens for click events on modal open and close buttons
	function observeClicks(event) {
		const openBtn = event.target.closest('.modal-open'),
			closeBtn = event.target.closest('.modal-close');

		if (closeBtn) closeModal();
		if (!openBtn || closeBtn) return;

		openModal(openBtn);
	}
	// traps focus within most recent active modal
	function trapFocus(event) {
		const focusEnd = focusable.length - 1,
			focusCur = focusable.indexOf(document.activeElement);

		if (event.key === `End` || (event.key === `Tab` && event.shiftKey && !focusCur)) {
			event.preventDefault();
			focusable[focusEnd].focus();
		} else if (
			event.key === `Home` ||
			(event.key === `Tab` && !event.shiftKey && focusCur === focusEnd)
		) {
			event.preventDefault();
			focusable[0].focus();
		} else if (event.key === 'Escape') {
			event.preventDefault();
			closeModal();
		}
	}

	// Modal Manager houses all active modals and their respective backdrops
	function createModalManager() {
		const div = document.createElement('div');
		div.setAttribute('id', 'modal-manager');
		div.setAttribute('style', 'position: fixed; top: 0; left: 0; z-index: 9999;');
		return div;
	}
	function createBackdrop() {
		const div = document.createElement('div');
		div.setAttribute(
			'style',
			`width: 100vw; height: 100vh; position: fixed; top: 0; left: 0; background-color: rgba(0,0,0,0.8); z-index: ${
				trackDepth * 2 - 1
			};`
		);
		div.setAttribute('class', 'modal-backdrop');
		div.addEventListener('click', closeModal);
		return div;
	}

	// toggle aria-hide for all other elements
	function ariaHideRest(bool) {
		const children = body.children;
		for (let i = 1; i < children.length; i++) children[i].setAttribute('aria-hidden', `${bool}`);
	}

	// return a list of focusable elements baed on passed in modal (html element)
	function updateFocusable(modal) {
		// temporarily remove nested dialogs
		const modals = modal.querySelectorAll('dialog'),
			temp = [];
		for (const modal of modals) {
			temp.push({ parent: modal.parentElement, modal });
			modal.remove();
		}

		// update focusable
		focusable = [
			...modal.querySelectorAll(
				`a[href]:not([disabled]), 
    button:not([disabled]), 
    textarea:not([disabled]), 
    input:not([disabled]), 
    select:not([disabled]),
    *[tabindex="0"]`
			)
		];

		// re-add nested dialogs
		for (const { parent, modal } of temp) parent.append(modal);
	}
	function openModal(openBtn) {
		trackDepth += 1; //
		const button = openBtn,
			modal = openBtn.nextElementSibling,
			backdrop = createBackdrop();

		updateFocusable(modal);
		if (trackDepth < 2) body.addEventListener('keydown', trapFocus);

		modal.remove(); // remove modal from where its original location

		trackButton.push(button); // track the original container of each modal
		trackModal.push(modal); // track each all active modals and most recent modal
		trackResume.push(document.activeElement); // track previous element in focus before a modal was activated
		trackBackdrop.push(backdrop); // track backdrop created for all current active modals

		modal.setAttribute(
			'style',
			`position: fixed; top: 50%; left: 50%; transform: translate3d(-50%, -50%, 0); z-index: ${
				trackDepth * 2
			};`
		);
		modalManager.prepend(backdrop); // add backdrop to Modal Manager
		modalManager.prepend(modal); // add modal to Modal Manager
		modal.show();
		ariaHideRest(true);
	}
	function closeModal() {
		trackDepth -= 1; // current level of modal
		const button = trackButton.pop(),
			modal = trackModal.pop(),
			resume = trackResume.pop(),
			backdrop = trackBackdrop.pop();

		modal.close();
		if (!trackDepth) {
			// remove all listeners no modals are active
			body.removeEventListener('keydown', trapFocus);
			backdrop.removeEventListener('click', closeModal);
		}
		backdrop.remove();
		button.after(modal); // put modal back where it was found

		ariaHideRest(false);
		// if there are still modals, update focusable
		if (trackDepth) updateFocusable(trackModal[trackDepth - 1]);
		resume.focus();
	}

	onMount(() => {
		init();
	});
</script>

<svelte:head>
	<title>Modals - Experiments by Jack Li</title>
	<meta
		name="description"
		content="Create accessible modals with a stress-free developer experience."
	/>
	<meta
		name="keywords"
		content="a11y, accessibility, modals, dialog, popup, wcag, ada, svelte, computer science, front end, front-end, developer, software, projects, mini-projects, svelte, sveltekit, github, fun"
	/>
	<meta name="og:title" content="Modals - Experiments by Jack Li" />
	<meta
		name="og:description"
		content="Create accessible modals with a stress-free developer experience"
	/>
	<meta name="og:url" content="https://experiments.byjackli.com/modals" />
	<meta name="og:type" content="website" />

	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Noto+Serif:wght@400;700&family=Roboto+Mono&display=swap"
		rel="stylesheet"
	/>

	<script src="../components/modals/modals.js"></script>
</svelte:head>

<div class="container" id="modals">
	<aside class="noselect">
		<a href="/modals" title="home">
			<div class="logo">
				<span class="bow">x</span>
				<span class="smile">:)</span>
			</div>
			<div class="logo-text">
				<h1>Modals</h1>
				<p>make modals assistive-technology-friendly</p>
			</div>
		</a>
	</aside>
	<section>
		<h2>modal stuff</h2>
		<div>
			<button class="modal-open">open modal</button>
			<dialog>
				<button class="modal-close">close</button>
				<p>the modal</p>
				<input type="text" />
				<input type="text" />
				<input type="text" />
				<input type="text" />
				<input type="text" />
				<input type="text" />
				<div>
					<button class="modal-open">modal 1</button>
					<dialog>
						<button class="modal-close">close</button>
						<p>nested modal 1</p>
						<input type="text" />
						<input type="text" />
						<input type="text" />
						<input type="text" />
					</dialog>
				</div>
				<div>
					<button class="modal-open">second modal</button>
					<dialog>
						<button class="modal-close">close</button>
						<p>nested modal 2</p>
						<input type="text" />
						<input type="text" />
					</dialog>
				</div>
			</dialog>
		</div>
	</section>
</div>

<style>
	* {
		color: #1c1c1c;
		font-family: 'Noto Sans', sans-serif;
	}
	*:focus {
		outline: solid 5px #d9c7ff;
	}
	h1,
	h2,
	h3 {
		font-family: 'Roboto Mono', serif;
	}
	div.container {
		background-color: #fff8be;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}
	aside {
		padding: 2em;

		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;

		z-index: 2;
	}
	aside a {
		text-decoration: none;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 2rem;
	}
	aside h1 {
		font-size: 32px;
	}
	aside p {
		font-size: 16px;
	}
	div.logo {
		min-width: 50px;
		max-width: 50px;
		min-height: 50px;
		max-height: 50px;
		background-color: #d9c7ff;
		border-radius: 15px;

		display: flex;
		justify-content: center;
		align-items: flex-end;
	}
	div.logo .bow {
		position: absolute;
		top: -20px;
		right: -5px;

		font-size: 32px;
		font-weight: bold;
	}
	div.logo .smile {
		padding-bottom: 8px;
		transform: rotate3d(0, 0, 1, 90deg);
		font-weight: bold;
	}
	div.logo-text {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	button {
		background-color: #ff72ad;
		padding: 0.25rem 0.5rem;
		border: none;
		border-radius: 4px;
		font-size: 18px;

		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.25rem;
	}
	button,
	button * {
		color: #fff;
	}
	pre {
		padding: 2rem;
	}
	code {
		font-family: monospace !important;
		font-weight: 200;
		font-size: 16px;
		color: #ff72ad;

		white-space: pre-wrap; /* Since CSS 2.1 */
		white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
		white-space: -pre-wrap; /* Opera 4-6 */
		white-space: -o-pre-wrap; /* Opera 7 */
		word-wrap: break-word; /* Internet Explorer 5.5+ */
	}

	#checklists {
		width: 100%;
		min-height: 100vh;
		padding: 1em;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}
	#checklists div.list-container {
		width: 100vw;
		padding: 2em;

		display: flex;
		flex-flow: row wrap;
		justify-content: center;
		gap: 2em;

		overflow-y: auto;
	}
	#checklists div.list {
		min-width: 20ch;
		width: 20ch;
		padding: 1rem;
		padding-bottom: 1.5rem;

		border: 0.15rem solid #ff72ad;
		border-radius: 6px;
	}
	#checklists div.list p {
		padding: 1em 0;
		font-size: 18px;
	}
	#checklists div.list ul {
		list-style-type: none;
		padding: 0;
	}
	#checklists div.list ul li,
	#checklists div.list ul li span:first-of-type {
		display: flex;
		gap: 0.5em;
	}
	#checklists div.list ul li span:first-of-type {
		width: 2ch;
		justify-content: center;
	}
	#checklists div.list ul li span:last-of-type {
		padding-top: 0.15em;
	}

	section#product-component {
		background-color: #d9d9d9;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}
</style>
