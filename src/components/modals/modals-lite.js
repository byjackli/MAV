let body = undefined,           // HTMLElement of document body
    modalManager = undefined,   // HTMLElement containing all active modals
    trackDepth = 0,             // number of active modals
    trackButton = [],           // treated as stack
    trackBackdrop = [],         // treated as stack
    trackModal = [],            // treated as stack
    trackResume = [],           // treated as stack
    focusable = undefined;      // list of focusable elements

// setp up automatic modal manager
function init() {
    body = document.getElementsByTagName('html')[0];
    body.addEventListener('click', observeClicks);
    if (!document.getElementById('modal-manager')) {
        modalManager = createModalManager();
        body.prepend(modalManager);
    }
    if (!document.getElementById('modal-css')) initCSS()
    hideModals()
}

// create CSS classes
function initCSS() {
    const styles = document.createTextNode(`
        .modal-inactive { display: none; }
        a.modal-close {
            padding: 10px;
            color: white;
            opacity: 0;
        }
        a.modal-close:focus { opacity: 1; } 
    `),
        styleNode = document.createElement("style"),
        head = document.getElementsByTagName("head")[0];

    styleNode.setAttribute("id", "modal-css")
    styleNode.appendChild(styles)
    head.appendChild(styleNode)
}

function hideModals() {
    const modals = Array.from(document.querySelectorAll(`*[role="dialog"]`))

    for (const modal of modals) {
        if (!modal.classList.contains("modal-inactive")) {
            modal.classList.add("modal-inactive")
            modal.setAttribute("aria-hidden", "true")
        }
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
function createCloseBtn() {
    const content = document.createTextNode('close modal'),
        ariaClose = document.createElement('a');

    ariaClose.appendChild(content);
    ariaClose.setAttribute('class', 'modal-close');
    ariaClose.setAttribute('tabindex', '0');
    ariaClose.setAttribute('style', 'position: absolute; top: -75px; right: 0;');
    return ariaClose
}

// toggle aria-hide for all other elements
function ariaHideRest(bool) {
    const body = document.getElementsByTagName('body')[0];
    body.setAttribute('aria-hidden', `${bool}`);
}

// return a list of focusable elements baed on passed in modal (html element)
function updateFocusable(modal) {
    // temporarily remove nested dialogs
    const modals = modal.querySelectorAll('*[role="dialog"]'),
        temp = [];
    for (const modal of modals) {
        temp.push({ sibling: modal.previousElementSibling, modal });
        modal.remove();
    }

    // update focusable with list of focusables from most recent modal
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

    // if modal does not have a close button, automatically create and add one
    if (!modal.querySelectorAll('.modal-close').length) modal.prepend(createCloseBtn);

    updateFocusable(modal);
    if (trackDepth < 2) body.addEventListener('keydown', trapFocus);
    else pausePreviousModal()

    modal.remove();                             // remove modal from where its original location

    trackResume.push(document.activeElement);   // track previous element in focus before a modal was activated
    trackButton.push(button);                   // track the original container of each modal
    trackModal.push(modal);                     // track each all active modals and most recent modal
    trackBackdrop.push(backdrop);               // track backdrop created for all current active modals

    modal.setAttribute(
        'style',
        `position: fixed; top: 50%; left: 50%; transform: translate3d(-50%, -50%, 0); z-index: ${trackDepth * 2
        };`
    );
    modal.classList.remove("modal-inactive")    // expose modal to visual users
    modal.setAttribute("aria-hidden", "false")  // expose modal to assist tech
    modalManager.prepend(backdrop);             // add backdrop to Modal Manager
    modalManager.prepend(modal);                // add modal to Modal Manager
    ariaHideRest(true);

    modal.firstChild.focus()
}
function closeModal() {
    trackDepth -= 1; // current level of modal
    const button = trackButton.pop(),
        modal = trackModal.pop(),
        resume = trackResume.pop(),
        backdrop = trackBackdrop.pop();

    backdrop.remove();
    button.after(modal);                        // put modal back where it was found
    modal.classList.add("modal-inactive")       // hide modal from visual users
    modal.setAttribute("aria-hidden", "true")   // hide modal from assist tech

    if (trackDepth) resumePreviousModal()       // if there are still modals, update focusable
    else {                                      // remove all listeners when no modals are active
        body.removeEventListener('keydown', trapFocus);
        backdrop.removeEventListener('click', closeModal);
        ariaHideRest(false);
    }

    resume.focus();
}
function pausePreviousModal() {
    trackModal[trackDepth - 2].setAttribute("aria-hidden", "true")
}
function resumePreviousModal() {
    trackModal[trackDepth - 1].setAttribute("aria-hidden", "false")
    updateFocusable(trackModal[trackDepth - 1]);
}

window.onload = init;

export default init