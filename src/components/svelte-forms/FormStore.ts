import { writable } from 'svelte/store';
import type { Database } from './types/Form'

const stored: Database = {
    submit: { submitting: false, accepted: false, attempted: false },
    data: {},
    dontSave: {},
    required: {},
    validity: {},
    verdict: {},
    preview: {},
    redact: {},
    touched: {},
    value: {},
    active: {},
    group: {}
};

export const FormStore = writable({ ...stored });


export function belongs(object: Record<string, any>, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(object, key);
}
function lookup(entry: string): Record<string, any> {
    if (!belongs(stored, entry)) throw "[FormStore] stored does not have this property!";
    return stored[entry];
}

export function updateSave(uid: string, title: string, saveToLocal: boolean, saveToCloud: boolean): void {
    const { data } = stored;

    if (saveToLocal)
        localStorage.setItem(`form[localSave]:${uid} | ${title}`, JSON.stringify(data));
}
export function clearSave(uid: string, title: string, saveToLocal: boolean, saveToCloud: boolean): void {
    if (saveToLocal) localStorage.removeItem(`form[localSave]:${uid} | ${title}`);
}
export function loadSave(uid: string, title: string, saveToLocal: boolean, saveToCloud: boolean): void {
    if (saveToLocal) {
        const saveData = localStorage.getItem(`form[localSave]:${uid} | ${title}`);
        if (saveData) stored.data = JSON.parse(saveData);
    }
}

export function setEntry(entry: string, data: unknown, fieldid: string, groupid?: string): any {
    const slot: Record<string, unknown> = lookup(entry)
    if (slot === undefined) return undefined

    if (groupid !== undefined) {
        if (!belongs(slot, groupid)) slot[groupid] = {};
        slot[groupid][fieldid] = data;
    } else slot[fieldid] = data;

    FormStore.update(() => ({ ...stored }))
    return data;
}

export function getEntry(entry: string, fieldid?: string, groupid?: string): any {
    const slot: Record<string, unknown> = lookup(entry);
    if (slot === undefined) return undefined

    else if (fieldid === undefined) return slot
    if (groupid !== undefined) return existsEntry(entry, groupid) ? slot[groupid][fieldid] : undefined
    return existsEntry(entry, fieldid) ? slot[fieldid] : undefined
}

export function existsEntry(entry: string, fieldid: string, groupid?: string): boolean {
    const slot: Record<string, unknown> = lookup(entry);
    if (groupid === undefined) return belongs(slot, fieldid);
    return belongs(slot, groupid) && belongs(slot[groupid], fieldid);
}



export default FormStore;