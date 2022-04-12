import { writable } from 'svelte/store';
import { belongs } from './FormStore'

const names = {
    warn: 'warn',
    redact: 'redact',
    label: 'label',
    blockHeader: 'form:block/',
    inputHeader: 'form:input/',
    inputFeedback: 'form:input-feedback/',
    inputPreview: 'form:input-preview/',
    groupHeader: 'form:group/',
    groupFeedback: 'form:group-feedback/',
    optionHeader: 'option'
};

export const FormStore = writable({ ...names });

export function changeName(type: string, name: string): boolean {
    if (!belongs(names, type)) return false

    names[type] = name
    FormStore.update(() => ({ ...names }))

    return true
}



export default FormStore;