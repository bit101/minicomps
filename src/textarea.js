import { Component } from "./component.js";
import { Style } from "./style.js";

/**
 * Creates a multi-line scrollable input field for entering text.
 * <div><img src="https://www.minicomps.org/images/textarea.png"/></div>
 * @example
 * const panel = new Panel(document.body, 20, 20, 200, 200);
 * new TextArea(panel, 20, 20, "Hello", event => console.log(event.target.text));
 * @extends Component
 */
export class TextArea extends Component {
  /**
   * Constructor
   * @param {HTMLElement} parent - The element to add this text area to.
   * @param {number} x - The x position of the text area. Default 0.
   * @param {number} y - The y position of the text area. Default 0.
   * @param {string} text - The initial text to display in the text area. Default empty string.
   * @param {function} defaultHandler - A function that will handle the "input" event.
   */
  constructor(parent, x, y, text, defaultHandler) {
    super(parent, x, y);
    this._text = text || "";

    this._createStyle();
    this._createChildren();
    this._createListeners();

    this.setSize(100, 100);
    this.addEventListener("input", defaultHandler);
    this._addToParent();
  }

  //////////////////////////////////
  // Core
  //////////////////////////////////

  _createChildren() {
    this._textArea = this._createElement(this.shadowRoot, "textArea", "MinimalTextArea");
    this._textArea.value = this._text;
  }

  _createStyle() {
    const style = document.createElement("style");
    style.textContent = Style.textarea;
    this.shadowRoot.append(style);
  }

  _createListeners() {
    this._onInput = this._onInput.bind(this);
    this._textArea.addEventListener("input", this._onInput);
  }

  //////////////////////////////////
  // Handlers
  //////////////////////////////////

  _onInput(event) {
    event.stopPropagation();
    this._text = this._textArea.value;
    this.dispatchEvent(new CustomEvent("input", { detail: this._text }));
  }

  //////////////////////////////////
  // Public
  //////////////////////////////////

  /**
   * Adds a handler function for the "input" event on this component.
   * @param {function} handler - A function that will handle the "input" event.
   * @returns This instance, suitable for chaining.
   */
  addHandler(handler) {
    this.addEventListener("input", handler);
    return this;
  }

  /**
   * Automatically changes the value of a property on a target object with the main value of this component changes.
   * @param {object} target - The target object to change.
   * @param {string} prop - The string name of a property on the target object.
   * @return This instance, suitable for chaining.
   */
  bind(target, prop) {
    this.addEventListener("input", event => {
      target[prop] = event.detail;
    });
    return this;
  }

  /**
   * @returns the text in the text area.
   */
  getText() {
    return this._text;
  }

  setEnabled(enabled) {
    if (this._enabled === enabled) {
      return this;
    }
    super.setEnabled(enabled);
    this._textArea.disabled = !this._enabled;
    if (this._enabled) {
      this._textArea.addEventListener("input", this._onInput);
    } else {
      this._textArea.removeEventListener("input", this._onInput);
    }
    return this;
  }

  /**
   * Sets the text of this text area.
   * @param {string} text - The text of this text area.
   * @returns This instance, suitable for chaining.
   */
  setText(text) {
    this._text = text;
    this._textArea.value = text;
    return this;
  }

  //////////////////////////////////
  // Getters/Setters
  // alphabetical. getter first.
  //////////////////////////////////

  /**
   * Gets and sets the text in the text area.
   */
  get text() {
    return this.getText();
  }
  set text(text) {
    this.setText(text);
  }
}

customElements.define("minimal-textarea", TextArea);
