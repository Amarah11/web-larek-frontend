import {IEvents} from "../base/events";
import {ensureElement} from "../../utils/utils";
import { Component } from "./component";

interface IFormState {
    valid: boolean;
    errors: string[];
}

export class Form<T> extends Component<IFormState> {
    protected submitContainer: HTMLButtonElement;
    protected errorsContainer: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this.submitContainer = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this.errorsContainer = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:changed`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this.submitContainer.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this.errorsContainer, value);
    }

    render(state: Partial<T> & IFormState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;

    }
}