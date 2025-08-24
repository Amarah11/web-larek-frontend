import { ensureElement } from "../utils/utils";
import { Component } from "./base/component";

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected totalContainer: HTMLElement;
    protected closeContainer: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
      super(container);

      this.totalContainer = ensureElement<HTMLElement>('.order-success__description', this.container);
      this.closeContainer = ensureElement<HTMLElement>('.order-success__close', this.container);

      if (actions?.onClick) {
        this.closeContainer.addEventListener('click', actions.onClick);
      }
    }

    set total(value:Number) {
      this.setText(this.totalContainer, `Списано ${value} синапсов`);
    }
}