import { Component } from "./component.js";
import { Label } from "./label.js";
import { RadioButtonGroup } from "./radiobuttongroup.js";
import { Style } from "./style.js";

/**
 * Creates a clickable radio button with a label that can be selected by clicking. Radio buttons are assigned to a group and only one radio button in a group will be selected at any one time.
 * You can get the text of the currently checked radio button in a group by calling RadioButtonGroup.getValueForGroup(group).
 * <div><img src="https://www.minicomps.org/images/radiobutton.png"/></div>
 * @example
 * const panel = new Panel(document.body, 20, 20, 200, 200);
 * const vbox = new VBox(panel, 20, 20, 10);
 * new RadioButton(vbox, 0, 0, "group", "Option 1", true, update);
 * new RadioButton(vbox, 0, 0, "group", "Option 2", false, update);
 * new RadioButton(vbox, 0, 0, "group", "Option 3", false, update);
 * function update() {
 *   console.log(RadioButtonGroup.getValueForGroup("group"));
 * }
 * @extends Component
 */
export class RadioButton extends Component {
  /**
   * Constructor
   * @param {HTMLElement} parent - The element to add this radio button to.
   * @param {number} x - The x position of the radio button. Default 0.
   * @param {number} y - The y position of the radio button. Default 0.
   * @param {string} group - The group this radio button belongs to. Default "group".
   * @param {string} label - The label of the radio button. Default empty string.
   * @param {boolean} checked - The initial checked state of the radio button. Default false.
   * @param {function} defaultHandler - A function that will handle the "click" event.
   */
  constructor(parent, x, y, group, label, checked, defaultHandler) {
    super(parent, x, y);
    RadioButtonGroup._addToGroup(group, this);
    this._group = group || "group";
    this._label = label || "";

    this._createStyle();
    this._createChildren();
    this._createListeners();

    this.setSize(100, 10);
    this.setChecked(checked || false);
    this.addEventListener("click", defaultHandler);
    this._addToParent();
    this._updateWidth();
  }

  //////////////////////////////////
  // Core
  //////////////////////////////////

  _createChildren() {
    this._setWrapperClass("MinimalRadioButton");
    this._wrapper.tabIndex = 0;
    this._check = this._createDiv(this._wrapper, "MinimalRadioButtonCheck");
    this._textLabel = new Label(this._wrapper, 15, 0, this._label);
  }

  _createStyle() {
    const style = document.createElement("style");
    style.textContent = Style.radiobutton;
    this.shadowRoot.append(style);
  }

  _createListeners() {
    this._onClick = this._onClick.bind(this);
    this._onKeyPress = this._onKeyPress.bind(this);
    this._wrapper.addEventListener("click", this._onClick);
    this._wrapper.addEventListener("keydown", this._onKeyPress);
  }

  //////////////////////////////////
  // Handlers
  //////////////////////////////////

  _onClick(event) {
    event.stopPropagation();
    if (this._enabled) {
      this.setChecked(true);
      this.dispatchEvent(new CustomEvent("click", { detail: this._label }));
    }
  }

  _onKeyPress(event) {
    if (event.keyCode === 13 && this._enabled) {
      // enter
      this._wrapper.click();
    } else if (event.keyCode === 40) {
      // down
      event.preventDefault();
      RadioButtonGroup._getNextInGroup(this._group, this).focus();
    } else if (event.keyCode === 38) {
      // up
      event.preventDefault();
      RadioButtonGroup._getPrevInGroup(this._group, this).focus();
    }
  }

  //////////////////////////////////
  // Private
  //////////////////////////////////

  focus() {
    if (this._enabled) {
      this._wrapper.focus();
    }
  }

  _updateCheckStyle() {
    let className = this._checked
      ? "MinimalRadioButtonCheckChecked "
      : "MinimalRadioButtonCheck ";

    if (!this._enabled) {
      className += "MinimalRadioButtonCheckDisabled";
    }
    this._check.setAttribute("class", className);
    this._check.setAttribute("class", className);
    if (this._enabled) {
      this._setWrapperClass("MinimalRadioButton");
    } else {
      this._setWrapperClass("MinimalRadioButtonDisabled");
    }
  }

  _updateWidth() {
    this.style.width = this._textLabel.x + this._textLabel.width + "px";
  }

  //////////////////////////////////
  // Public
  //////////////////////////////////

  /**
   * Adds a handler function for the "click" event on this radio button.
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
   * @returns the text in the label.
   */
  getLabel() {
    return this._label;
  }

  /**
   * @returns whether or not the radiobutton is checked.
   */
  getChecked() {
    return this._checked;
  }

  getWidth() {
    return this._textLabel.x + this._textLabel.width;
  }

  /**
   * Sets the checked state of this radio button.
   * @params {boolean} checked - Whether or not this radio button will be checked.
   * @returns This instance, suitable for chaining.
   */
  setChecked(checked) {
    if (checked) {
      RadioButtonGroup._clearGroup(this._group);
    }
    this._checked = checked;
    this._updateCheckStyle();
    return this;
  }

  setEnabled(enabled) {
    if (this._enabled === enabled) {
      return this;
    }
    super.super(enabled);
    this._updateCheckStyle();
    this._textLabel.enabled = enabled;
    if (this._enabled) {
      this._wrapper.tabIndex = 0;
    } else {
      this._wrapper.tabIndex = -1;
    }
    return this;
  }

  setHeight(height) {
    super.setHeight(height);
    this._textLabel.height = height;
    this._check.style.top = Math.round((this._height - 10) / 2) + "px";
    return this;
  }
  /**
   * Sets the label of this radio button.
   * @param {string} label - The label to set on this radio button.
   * @returns this instance, suitable for chaining.
   */
  setLabel(label) {
    this._label = label;
    this._textLabel.text = label;
    this._updateWidth();
    return this;
  }

  /**
   * Does nothing. Width is set automatically based on the size of the check and label.
   * @returns This instance.
   */
  setWidth() {
    return this;
  }

  //////////////////////////////////
  // Getters/Setters
  // alphabetical. getter first.
  //////////////////////////////////

  /**
   * Sets and gets the checked state of the radio button.
   */
  get checked() {
    return this.getChecked();
  }
  set checked(checked) {
    this.setChecked(checked);
  }

  /**
   * Sets and gets the label shown in the radio button's label.
   */
  get label() {
    return this.getLabel();
  }
  set label(label) {
    this.setLabel(label);
  }
}
customElements.define("minimal-radiobutton", RadioButton);

