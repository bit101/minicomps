import { Component } from "./component.js";
import { Label } from "./label.js";
import { Style } from "./style.js";

/**
 * Creates a clickable checkbox with a label that toggles on and off when clicked.
 * <div><img src="https://www.minicomps.org/images/checkbox.png"/></div>
 * @example
 * const panel = new Panel(document.body, 20, 20, 200, 200);
 * new Checkbox(panel, 20, 20, "Check it", false, event => console.log(event.target.checked));
 * @extends Component
 */
export class Checkbox extends Component {
  /**
   * Constructor
   * @param {HTMLElement} parent - The element to add this checkbox to.
   * @param {number} x - The x position of the checkbox.
   * @param {number} y - The y position of the checkbox.
   * @param {string} label - The label label of the checkbox.
   * @param {boolean} checked - The initial checked state of the checkbox.
   * @param {function} defaultHandler - A function that will handle the "click" event.
   */
  constructor(parent, x, y, label, checked, defaultHandler) {
    super(parent, x, y);
    this._label = label;

    this._createChildren();
    this._createStyle();
    this._createListeners();

    this.setSize(100, 10);
    this.checked = checked;
    this.addEventListener("click", defaultHandler);
    this._addToParent();
    this._updateWidth();
  }

  //////////////////////////////////
  // Core
  //////////////////////////////////

  _createChildren() {
    this._setWrapperClass("MinimalCheckbox");
    this._wrapper.tabIndex = 0;
    this.check = this._createDiv(this._wrapper, "MinimalCheckboxCheck");
    this._textLabel = new Label(this._wrapper, 15, 0, this._label);
  }

  _createStyle() {
    const style = document.createElement("style");
    style.textContent = Style.checkbox;
    this.shadowRoot.append(style);
  }

  _createListeners() {
    this._onClick = this._onClick.bind(this);
    this._onKeyPress = this._onKeyPress.bind(this);
    this._wrapper.addEventListener("click", this._onClick);
    this._wrapper.addEventListener("keypress", this._onKeyPress);
  }

  //////////////////////////////////
  // Handlers
  //////////////////////////////////

  _onClick(event) {
    event.stopPropagation();
    if (this.enabled) {
      this.toggle();
      this.dispatchEvent(new CustomEvent("click", { detail: this.checked }));
    }
  }

  _onKeyPress(event) {
    if (event.keyCode === 13 && this.enabled) {
      this._wrapper.click();
    }
  }

  //////////////////////////////////
  // Private
  //////////////////////////////////

  _updateCheckStyle() {
    let className = this.checked
      ? "MinimalCheckboxCheckChecked "
      : "MinimalCheckboxCheck ";

    if (!this.enabled) {
      className += "MinimalCheckboxCheckDisabled";
    }
    this.check.setAttribute("class", className);
    if (this.enabled) {
      this._setWrapperClass("MinimalCheckbox");
    } else {
      this._setWrapperClass("MinimalCheckboxDisabled");
    }
  }

  _updateWidth() {
    this.style.width = this._textLabel.x + this._textLabel.width + "px";
  }

  //////////////////////////////////
  // Public
  //////////////////////////////////

  /**
   * Adds a handler function for the "click" event on this checkbox.
   * @param {function} handler - A function that will handle the "click" event.
   * @returns This instance, suitable for chaining.
   */
  addHandler(handler) {
    this.addEventListener("click", handler);
    return this;
  }

  /**
   * Automatically changes the value of a property on a target object with the main value of this component changes.
   * @param {object} target - The target object to change.
   * @param {string} prop - The string name of a property on the target object.
   * @return This instance, suitable for chaining.
   */
  bind(target, prop) {
    this.addEventListener("click", event => {
      target[prop] = event.detail;
    });
    return this;
  }

  /**
   * Gets whether or not this checkbox is checked.
   * @returns Whether or not this checkbox is checked.
   */
  getChecked() {
    return this._checked;
  }

  /** Gets the label on this checkbox.
   * @returns The text of the label of this checkbox.
   */
  getLabel() {
    return this._label;
  }

  getWidth() {
    return this._textLabel.x + this._textLabel.width;
  }

  /**
   * Sets the checked state of this checkbox.
   * @params {boolean} checked - Whether or not this checkbox will be checked.
   * @returns This instance, suitable for chaining.
   */
  setChecked(checked) {
    this._checked = checked;
    this._updateCheckStyle();
    return this;
  }

  setEnabled(enabled) {
    if (this.enabled !== enabled) {
      super.setEnabled(enabled);
      this._updateCheckStyle();
      this._textLabel.enabled = enabled;
      if (this.enabled) {
        this._wrapper.tabIndex = 0;
      } else {
        this._wrapper.tabIndex = -1;
      }
    }
    return this;
  }

  setHeight(height) {
    super.setHeight(height);
    this._textLabel.height = height;
    this.check.style.top = Math.round((this.height - 10) / 2) + "px";
    return this;
  }

  /**
   * Sets the label of this checkbox.
   * @param {string} label - The label to set on this checkbox.
   * @returns this instance, suitable for chaining.
   */
  setLabel(label) {
    this._label = label;
    this._textLabel.text = label;
    this._updateWidth();
    return this;
  }

  /**
   * Sets the width of this checkbox. In fact, setting the width does nothing because it is automatically determined by the width of the label.
   */
  setWidth() {
    return this;
  }

  /**
   * Toggles the state of the checkbox between checked and not checked.
   * @returns This instance, suitable for chaining.
   */
  toggle() {
    this.setChecked(!this._checked);
    return this;
  }

  //////////////////////////////////
  // Getters/Setters
  // alphabetical. getter first.
  //////////////////////////////////

  /**
   * Sets and gets the checked state of the checkbox.
   */
  get checked() {
    return this.getChecked();
  }
  set checked(checked) {
    this.setChecked(checked);
  }

  /**
   * Sets and gets the label shown in the button's label.
   */
  get label() {
    return this.getLabel();
  }
  set label(label) {
    this.setLabel(label);
  }
}

customElements.define("minimal-checkbox", Checkbox);

