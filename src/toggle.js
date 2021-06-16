import { Component } from "./component.js";
import { Defaults } from "./defaults.js";
import { Label } from "./label.js";
import { Style } from "./style.js";

/**
 * Creates a clickable toggle that can be switched off and on.
 * <div><img src="https://www.minicomps.org/images/toggle.png"/></div>
 * @example
 * const panel = new Panel(document.body, 20, 20, 200, 200);
 * new Toggle(panel, 20, 20, "Toggle", false, event => console.log(event.target.toggled));
 * @extends Component
 */
export class Toggle extends Component {
  /**
   * Constructor
   * @param {HTMLElement} parent - The element to add this toggle to.
   * @param {number} x - The x position of the toggle. Default 0.
   * @param {number} y - The y position of the toggle. Default 0.
   * @param {string} label - The text for the toggle's label. Default empty string.
   * @param {boolean} toggled - The initial toggled state of the toggle. Default false.
   * @param {function} defaultHandler - A function that will handle the "click" event.
   */
  constructor(parent, x, y, label, toggled, defaultHandler) {
    super(parent, x, y);
    this._label = label;
    this._labelPosition = Defaults.toggle.labelPosition;

    this._createChildren();
    this._createStyle();
    this._createListeners();

    this.setSize(50, 20);
    this.setToggled(toggled || false);
    this._updateLabel();
    this.addEventListener("click", defaultHandler);
    this._addToParent();
  }

  //////////////////////////////////
  // Core
  //////////////////////////////////

  _createChildren() {
    this._setWrapperClass("MinimalToggle");
    this._wrapper.tabIndex = 0;
    this._textLabel = new Label(this._wrapper, 0, -15, this._label);
    this._stateLabel = new Label(this._wrapper, 5, 0, "On")
      .setAutosize(false);
    this._handle = this._createDiv(this._wrapper, "MinimalToggleHandle");
  }

  _createStyle() {
    const style = document.createElement("style");
    style.textContent = Style.toggle;
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
    if (this._enabled) {
      this.toggle();
      this.dispatchEvent(new CustomEvent("click", { detail: this._toggled }));
    }
  }

  _onKeyPress(event) {
    if (event.keyCode === 13 && this._enabled) {
      this._wrapper.click();
    }
  }

  //////////////////////////////////
  // Private
  //////////////////////////////////

  _updateLabel() {
    if (this._labelPosition === "left") {
      this._textLabel.x = -this._textLabel.width - 5;
      this._textLabel.y = (this._height - this._textLabel.height) / 2;
    } else if (this._labelPosition === "top") {
      this._textLabel.x = 0;
      this._textLabel.y = -this._textLabel.height - 5;
    } else if (this._labelPosition === "right") {
      this._textLabel.x = this._width + 5;
      this._textLabel.y = (this._height - this._textLabel.height) / 2;
    } else {
      this._textLabel.x = 0;
      this._textLabel.y = this._height + 5;
    }
  }

  _updateToggle() {
    if (this._toggled) {
      this._stateLabel.align = "left";
      this._stateLabel.text = "On";
      this._handle.style.left = "50%";
    } else {
      this._stateLabel.align = "right";
      this._stateLabel.text = "Off";
      this._handle.style.left = 0;
    }
  }

  //////////////////////////////////
  // Public
  //////////////////////////////////

  /**
   * Adds a handler function for the "click" event on this toggle.
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

  getLabel() {
    return this._label;
  }

  getLabelPosition() {
    return this._labelPosition;
  }

  getToggled() {
    return this._toggled;
  }

  setEnabled(enabled) {
    if (this._enabled !== enabled) {
      super.setEnabled(enabled);
      this._textLabel.enable = enabled;
      if (this._enabled) {
        this._setWrapperClass("MinimalToggle");
        this._wrapper.tabIndex = 0;
      } else {
        this._setWrapperClass("MinimalToggleDisabled");
        this._wrapper.tabIndex = -1;
      }
    }
    return this;
  }

  setHeight(height) {
    super.setHeight(height);
    this._stateLabel.height = height;
    return this;
  }

  /**
   * Sets the label of this toggle.
   * @param {string} label - The label to set on this toggle.
   * @returns this instance, suitable for chaining.
   */
  setLabel(label) {
    this._label = label;
    this._textLabel.text = label;
    this._updateLabel();
    return this;
  }

  /**
   * Sets the label position of the text label.
   * @param {string} position - The position to place the text lable: "top" (default), "left", "right" or "bottom".
   * @returns this instance, suitable for chaining.
   */
  setLabelPosition(position) {
    this._labelPosition = position;
    this._updateLabel();
    return this;
  }

  /**
   * Sets whether or not this toggle will be toggled (on).
   * @params {boolean} toggle - Whether this toggle will be toggled on or off.
   * @returns This instance, suitable for chaining.
   */
  setToggled(toggled) {
    this._toggled = toggled;
    this._updateToggle();
    return this;
  }

  setWidth(width) {
    super.setWidth(width);
    this._stateLabel.width = width - 10;
    return this;
  }

  /**
   * Toggles the state of the toggle between toggled and not toggled.
   * @returns This instance, suitable for chaining.
   */
  toggle() {
    this.setToggled(!this._toggled);
    return this;
  }

  //////////////////////////////////
  // Getters/Setters
  // alphabetical. getter first.
  //////////////////////////////////

  /**
   * Gets and sets the text of the toggle's text label.
   */
  get label() {
    return this.getLabel();
  }
  set label(label) {
    this.setLabel(label);
  }

  /**
   * Gets and sets the position of the text label displayed on the toggle. Valid values are "top" (default), "left" and "bottom".
   */
  get labelPosition() {
    return this.getLabelPosition();
  }
  set labelPosition(pos) {
    this.setLabelPosition(pos);
  }

  /**
   * Sets and gets the toggled state of the toggle.
   */
  get toggled() {
    return this.getToggled();
  }
  set toggled(toggled) {
    this.setToggled(toggled);
  }
}

customElements.define("minimal-toggle", Toggle);

