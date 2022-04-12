type Form = {
    id: string,
    title: string,
    debug?: boolean,
    saveToLocal?: boolean,
    saveToCloud?: boolean,
    fields?: [Field, Group],
    autocomplete?: string,
    fullscreen?: boolean
}

export type Field = {
    uid: string,
    name: string,
    type: string,
    defaultValue: string,
    placeholder: string,
    tooltip?: string,
    hideLabel?: boolean,
    disabled?: boolean,
    hidden?: boolean,
    required?: boolean,
    redact?: boolean,
    autocomplete?: string,
    preview?: boolean,
    multiple?: boolean,
    compact?: boolean,
    options?: [{ uid: string, name: string }],
    accept?: string,
    custom?: boolean,
    body?: [unknown],
    validity?: Validity

}

export type Group = {
    uid: string,
    name: string,
    tooltip?: string,
    feedback?: boolean,
    required?: boolean,
    redact?: boolean,
    hideLabel?: boolean,
    autocomplete?: string,
}

export type Database = {
    submit: { submitting: boolean, accepted: boolean, attempted: boolean },
    data: Record<string, (Field | Record<string, Field>)>,
    required: Record<string, (boolean | Record<string, boolean>)>,
    validity: Record<string, (Validity | Record<string, Validity>)>,
    verdict: Record<string, (Verdict | Record<string, Verdict>)>,
    preview: Record<string, (boolean | Record<string, boolean>)>,
    redact: Record<string, (boolean | Record<string, boolean>)>,
    touched: Record<string, (boolean | Record<string, boolean>)>,
    value: Record<string, (unknown | Record<string, unknown>)>,
    active: Record<string, (boolean | Record<string, boolean>)>,
    dontSave: Record<string, (DontSave | Record<string, DontSave>)>,
    group: Record<string, Group>
}

export type Rule = {
    check: boolean,
    true: string,
    false?: string,
}
export type Validity = ((value: string) => Record<string, Rule>) | boolean
export type Verdict = {
    verdict: boolean,
    raw?: [{ verdict: boolean, feedback: string }]
}
export type DontSave = {
    verdict?: boolean,
    data?: unknown,
    action: string
}

export default Form