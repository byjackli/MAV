let listener = undefined,       // status of "click" event listener on body
    body = undefined,           // HTMLElement of document body
    modalManager = undefined,   // HTMLElement containing all active modals
    trackDepth = 0,             // number of active modals
    trackButton = [],           // treated as stack
    trackBackdrop = [],         // treated as stack
    trackModal = [],            // treated as stack
    trackResume = [],           // treated as stack
    focusable = undefined;      // list of focusable elements

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
        `width: 100vw; height: 100vh; position: fixed; top: 0; left: 0; background-color: rgba(0,0,0,0.8); z-index: ${trackDepth * 2 - 1
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
        temp.push({ sibling: modal.previousElementSibling, modal });
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
    for (const { sibling, modal } of temp) sibling.after(modal);
}
function openModal(openBtn) {
    trackDepth += 1; //
    const button = openBtn,
        modal = openBtn.nextElementSibling,
        backdrop = createBackdrop();

    if (!modal.querySelectorAll('.modal-close').length) {
        const content = document.createTextNode('close modal'),
            ariaClose = document.createElement('button');

        ariaClose.appendChild(content);
        ariaClose.setAttribute('class', 'modal-close');
        ariaClose.setAttribute('style', 'position: fixed; left: 0; top: 0; opacity: 0; z-index: -1;');
        ariaClose.addEventListener('click', closeModal);
        modal.prepend(ariaClose);
    }
    updateFocusable(modal);
    if (trackDepth < 2) body.addEventListener('keydown', trapFocus);
    if (!modal.querySelectorAll(".close-modal")) {
        backdrop.setAttribute("tabindex", "0")
        backdrop.setAttribute("aria-label", "Close modal.")
    }

    modal.remove();                             // remove modal from where its original location

    trackButton.push(button);                   // track the original container of each modal
    trackModal.push(modal);                     // track each all active modals and most recent modal
    trackResume.push(document.activeElement);   // track previous element in focus before a modal was activated
    trackBackdrop.push(backdrop);               // track backdrop created for all current active modals

    modal.setAttribute(
        'style',
        `position: fixed; top: 50%; left: 50%; transform: translate3d(-50%, -50%, 0); z-index: ${trackDepth * 2
        };`
    );
    modalManager.prepend(backdrop);             // add backdrop to Modal Manager
    modalManager.prepend(modal);                // add modal to Modal Manager
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

window.onload = init;