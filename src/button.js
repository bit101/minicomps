import { Component } from "./component.js";
import { Label } from "./label.js";
import { Style } from "./style.js";

/**
 * Creates a clickable pushbutton with a text label.
 * <div><img src="https://www.minicomps.org/images/button.png"/></div>
 * @example
 * const panel = new Panel(document.body, 20, 20, 200, 200);
 * new Button(panel, 20, 20, "Click me", event => console.log("clicked!"));
 * @extends Component
 */
export class Button extends Component {
  /**
   * Constructor
   * @param {HTMLElement} parent - The element to add this button to.
   * @param {number} x - The x position of the button. Default 0.
   * @param {number} y - The y position of the button. Default 0.
   * @param {string} label - The text label of the button. Default empty string.
   * @param {function} defaultHandler - A function that will handle the "click" event.
   */
  constructor(parent, x, y, label, defaultHandler) {
    super(parent, x, y);
    this._label = label || "";

    this._createChildren();
    this._createStyle();
    this._createListeners();

    this.setSize(Button.width, Button.height);
    this.addEventListener("click", defaultHandler);
    this._addToParent();
  }

  //////////////////////////////////
  // Core
  //////////////////////////////////

  _createChildren() {
    this._wrapper.tabIndex = 0;
    this._setWrapperClass("MinimalButton");
    this._textLabel = new Label(this._wrapper, 0, 0, this._label);
    this._textLabel.autosize = false;
    this._textLabel.align = "center";
  }

  _createStyle() {
    const style = document.createElement("style");
    style.textContent = Style.button;
    this.shadowRoot.append(style);
  }

  _createListeners() {
    this._onClick = this._onClick.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._wrapper.addEventListener("click", this._onClick);
    this._wrapper.addEventListener("keyup", this._onKeyUp);
  }

  //////////////////////////////////
  // Handlers
  //////////////////////////////////

  _onClick(event) {
    event.stopPropagation();
    if (this._enabled) {
      this.dispatchEvent(new Event("click"));
    }
  }

  _onKeyUp(event) {
    if (event.keyCode === 13 && this._enabled) {
      this._wrapper.click();
    }
  }

  //////////////////////////////////
  // Public
  //////////////////////////////////

  /**
   * Adds a handler function for the "click" event on this button.
   * @param {function} handler - A function that will handle the "click" event.
   * @returns This instance, suitable for chaining.
   */
  addHandler(handler) {
    this.addEventListener("click", handler);
    return this;
  }

  /**
   * Gets the label of this button.
   * @returns The text of the label.
   */
  getLabel() {
    return this._label;
  }

  setEnabled(enabled) {
    if (this._enabled === enabled) {
      return this;
    }
    super.setEnabled(enabled);
    this._textLabel.enabled = enabled;
    if (this._enabled) {
      this._wrapper.setAttribute("class", "MinimalButton");
      this._wrapper.tabIndex = 0;
    } else {
      this._wrapper.setAttribute("class", "MinimalButtonDisabled");
      this._wrapper.tabIndex = -1;
    }
    return this;
  }

  setHeight(height) {
    super.setHeight(height);
    this._textLabel.height = height;
    return this;
  }

  /**
   * Sets the label of this button.
   * @param {string} label - The label to set on this button.
   * @returns this instance, suitable for chaining.
   */
  setLabel(label) {
    this._label = label;
    this._textLabel.text = label;
    return this;
  }

  setWidth(width) {
    super.setWidth(width);
    this._textLabel.width = width;
    return this;
  }

  //////////////////////////////////
  // Getters/Setters
  // alphabetical. getter first.
  //////////////////////////////////

  /**
   * Sets and gets the text shown in the button's label.
   */
  get label() {
    return this.getLabel();
  }
  set label(label) {
    this.setLabel(label);
  }
}

//////////////////////////////////
// Getters/Setters
// alphabetical. getter first.
//////////////////////////////////
Button.width = 100;
Button.height = 20;

customElements.define("minimal-button", Button);

