import { Component } from "./component.js";
import { Defaults } from "./defaults.js";
import { Label } from "./label.js";
import { Style } from "./style.js";

/**
 * A rotary knob for selecting numerical values. The knob value can be changed by clicking and dragging, scrolling with a mouse wheel or trackpad or the use of the keyboard (arrow keys, page up/down, home/end).
 * <div><img src="https://www.minicomps.org/images/knob.png"/></div>
 * @example
 * const panel = new Panel(document.body, 20, 20, 200, 200);
 * new Knob(panel, 20, 20, "Knob", 50, 0, 100, event => console.log(event.target.value));
 * @extends Component
 */
export class Knob extends Component {
  /**
   * Constructor
   * @param {HTMLElement} parent - The element to add this knob to.
   * @param {number} x - The x position of the knob. Default 0.
   * @param {number} y - The y position of the knob. Default 0.
   * @param {string} label - The text label of the knob. Default empty string.
   * @param {number} value - The initial value of the knob. Default 0.
   * @param {number} min - The minimum value of the knob. Default 0.
   * @param {number} max - The maximum value of the knob. Default 100.
   * @param {function} defaultHandler - A function that will handle the "change" event.
   */
  constructor(parent, x, y, label, value, min, max, defaultHandler) {
    super(parent, x, y);

    this._label = label || "";
    this._min = min || 0;
    this._max = max || 100;
    this._decimals = Defaults.knob.decimals;
    this._value = value || 0;
    this._sensitivity = 100;
    this._labelsSwapped = false;

    this._createChildren();
    this._createStyle();
    this._createListeners();

    this.setSize(Defaults.knob.size, Defaults.knob.size);
    this._updateHandleRotation();

    this.addEventListener("change", defaultHandler);
    this._addToParent();
  }

  //////////////////////////////////
  // Core
  //////////////////////////////////

  _createChildren() {
    this._setWrapperClass("MinimalKnob");
    this._handle = this._createDiv(this._wrapper, "MinimalKnobHandle");
    this._wrapper.tabIndex = 0;
    this._zero = this._createDiv(this._handle, "MinimalKnobZero");
    this._textLabel = new Label(this._wrapper, 0, 0, this._label);
    this._valueLabel = new Label(this._wrapper, 0, 0, this._roundValue(this._value));
  }

  _createStyle() {
    const style = document.createElement("style");
    style.textContent = Style.knob;
    this.shadowRoot.append(style);
  }

  _createListeners() {
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onWheel = this._onWheel.bind(this);
    this._handle.addEventListener("wheel", this._onWheel);
    this._wrapper.addEventListener("mousedown", this._onMouseDown);
    this._wrapper.addEventListener("touchstart", this._onMouseDown);
    this._wrapper.addEventListener("keydown", this._onKeyDown);
  }

  //////////////////////////////////
  // Handlers
  //////////////////////////////////

  _onMouseDown(event) {
    event.preventDefault();
    this._wrapper.focus();
    if (event.changedTouches) {
      this._startY = event.changedTouches[0].clientY;
    } else {
      this._startY = event.clientY;
    }
    this._startValue = this.value;
    document.addEventListener("mousemove", this._onMouseMove);
    document.addEventListener("touchmove", this._onMouseMove);
    document.addEventListener("mouseup", this._onMouseUp);
    document.addEventListener("touchend", this._onMouseUp);
  }

  _onMouseMove(event) {
    const mult = (this._max - this._min) / this._sensitivity;
    let mouseY;
    if (event.changedTouches) {
      mouseY = event.changedTouches[0].clientY;
    } else {
      mouseY = event.clientY;
    }
    const y = mouseY - this._startY;
    const value = this._startValue + -y * mult;
    if (value !== this.getValue()) {
      this._updateValue(value);
      this.dispatchEvent(new CustomEvent("change", { detail: this.getValue() }));
    }
  }

  _onMouseUp() {
    document.removeEventListener("mousemove", this._onMouseMove);
    document.removeEventListener("touchmove", this._onMouseMove);
    document.removeEventListener("mouseup", this._onMouseUp);
    document.removeEventListener("touchend", this._onMouseUp);
  }

  _onKeyDown(event) {
    const inc = 1 / Math.pow(10, this._decimals);
    let value = this.value;

    switch (event.keyCode) {
    case 34: // pagedown
      event.preventDefault();
      value -= inc * 10;
      break;
    case 33: // pageup
      event.preventDefault();
      value += inc * 10;
      break;
    case 36: // home
      event.preventDefault();
      value = this._min;
      break;
    case 35: // end
      event.preventDefault();
      value = this._max;
      break;
    case 37: // right
    case 40: // up
      event.preventDefault();
      value -= inc;
      break;
    case 38: // up
    case 39: // down
      event.preventDefault();
      value += inc;
      break;
    default:
      break;
    }
    if (value !== this.getValue()) {
      this._updateValue(value);
      this.dispatchEvent(new CustomEvent("change", { detail: this.getValue() }));
    }
  }

  _onWheel(event) {
    event.preventDefault();
    const inc = 1 / Math.pow(10, this._decimals);
    let value = this.value;
    if (event.deltaY > 0) {
      value += inc;
    } else if (event.deltaY < 0) {
      value -= inc;
    }
    if (value !== this.getValue()) {
      this._updateValue(value);
      this.dispatchEvent(new CustomEvent("change", { detail: this.getValue() }));
    }
  }

  //////////////////////////////////
  // Private
  //////////////////////////////////

  _formatValue() {
    let valStr = this.value.toString();
    if (this._decimals <= 0) {
      return valStr;
    }
    if (valStr.indexOf(".") === -1) {
      valStr += ".";
    }
    const dec = valStr.split(".")[1].length;
    for (let i = dec; i < this._decimals; i++) {
      valStr += "0";
    }
    return valStr;
  }

  _roundValue(value) {
    value = Math.min(value, this._max);
    value = Math.max(value, this._min);
    const mult = Math.pow(10, this._decimals);
    return Math.round(value * mult) / mult;
  }

  _updateHandleSize() {
    this._handle.style.top = (this._height - this._size) / 2 + "px";
    this._handle.style.left = (this._width - this._size) / 2 + "px";
    this._handle.style.width = this._size + "px";
    this._handle.style.height = this._size + "px";
  }

  _updateHandleRotation() {
    const percent = (this.getValue() - this._min) / (this._max - this._min);
    this._handle.style.transform = `rotate(${-240 + percent * 300}deg`;
  }

  _updateEnabledStyle() {
    this._textLabel.enabled = this._enabled;
    this._valueLabel.enabled = this._enabled;
    if (this._enabled) {
      this._wrapper.setAttribute("class", "MinimalKnob");
    } else {
      this._wrapper.setAttribute("class", "MinimalKnobDisabled");
    }
  }

  _updateLabelPositions() {
    this._textLabel.x = (this._width - this._textLabel.width) / 2;
    this._valueLabel.x = (this._width - this._valueLabel.width) / 2;
    if (this._labelsSwapped) {
      this._textLabel.y = (this._height + this._size) / 2 + 5;
      this._valueLabel.y = (this._height - this._size) / 2 - this._textLabel.height - 5;
    } else {
      this._textLabel.y = (this._height - this._size) / 2 - this._textLabel.height - 5;
      this._valueLabel.y = (this._height + this._size) / 2 + 5;
    }
  }

  _updateValue(value) {
    if (this._value !== value) {
      this._value = value;
      this._updateHandleRotation();
      this._valueLabel.text = this._formatValue();
      this._updateLabelPositions();
    }
  }

  //////////////////////////////////
  // Public
  //////////////////////////////////

  /**
   * Adds a handler function for the "change" event on this knob.
   * @param {function} handler - A function that will handle the "change" event.
   * @returns This instance, suitable for chaining.
   */
  addHandler(handler) {
    this.addEventListener("change", handler);
    return this;
  }

  /**
   * Automatically changes the value of a property on a target object with the main value of this component changes.
   * @param {object} target - The target object to change.
   * @param {string} prop - The string name of a property on the target object.
   * @return This instance, suitable for chaining.
   */
  bind(target, prop) {
    this.addEventListener("change", event => {
      target[prop] = event.detail;
    });
    return this;
  }

  getDecimals() {
    return this._decimals;
  }

  getLabel() {
    return this._label;
  }

  getLabelsSwapped() {
    return this._labelsSwapped;
  }

  getMax() {
    return this._max;
  }

  getMin() {
    return this._min;
  }

  getSensitivity() {
    return this._sensitivity;
  }

  /**
   * @returns the current value.
   */
  getValue() {
    return this._roundValue(this._value);
  }

  /**
   * Sets the number of decimals of precision to be used for the knob. This will effect what is shown in the value label as well as the value property of the knob. A decimals value of 0 will display integers only. Negative decimals will round to the nearest power of 10.
   * @param {number} decimals - The decimals of precision to use.
   * @returns This instance, suitable for chaining.
   */
  setDecimals(decimals) {
    this._decimals = decimals;
    this._updateHandleRotation();
    this._valueLabel.text = this._formatValue();
    this._updateLabelPositions();
    return this;
  }

  setEnabled(enabled) {
    if (this._enabled === enabled) {
      return this;
    }
    super.setEnabled(enabled);
    this._updateEnabledStyle();
    if (this._enabled) {
      this._wrapper.tabIndex = 0;
      this._handle.addEventListener("wheel", this._onWheel);
      this._wrapper.addEventListener("mousedown", this._onMouseDown);
      this._wrapper.addEventListener("touchstart", this._onMouseDown);
      this._wrapper.addEventListener("keydown", this._onKeyDown);
    } else {
      this._wrapper.tabIndex = -1;
      this._handle.removeEventListener("wheel", this._onWheel);
      this._wrapper.removeEventListener("mousedown", this._onMouseDown);
      this._wrapper.removeEventListener("touchstart", this._onMouseDown);
      this._wrapper.removeEventListener("keydown", this._onKeyDown);
      document.removeEventListener("mousemove", this._onMouseMove);
      document.removeEventListener("touchmove", this._onMouseMove);
      document.removeEventListener("mouseup", this._onMouseUp);
      document.removeEventListener("touchend", this._onMouseUp);
    }
    return this;
  }

  /**
   * Sets the height of the knob container. Of course the knob itself will always be round, so it will be sized according to the minimum of width and height if they are different, and centered within the container rectangle.
   * @param {number} height - The height of the knob.
   * @returns This instance.
   */
  setHeight(height) {
    super.setHeight(height);
    this._size = Math.min(this._width, this._height);
    this._updateHandleSize();
    this._updateLabelPositions();
    return this;
  }

  /**
   * Sets whether the text label and value label will be swapped. If true, the text label will be on the bottom and the value label will be on the top.
   * @param {boolean} swapped - Whether the labels will be swapped.
   * @returns This instance, suitable for chaining.
   */
  setLabelsSwapped(swapped) {
    this._labelsSwapped = swapped;
    return this;
  }

  /**
   * Sets the maximum value of this knob.
   * @param {number} max - The maximum value of this knob.
   * @returns This instance, suitable for chaining.
   */
  setMax(max) {
    this._max = max;
    this._updateValue(this.value);
    return this;
  }

  /**
   * Sets the minimum value of this knob.
   * @param {number} min - The minimum value of this knob.
   * @returns This instance, suitable for chaining.
   */
  setMin(min) {
    this._min = min;
    this._updateValue(this.value);
    return this;
  }

  /**
   * Sets the value of this knob.
   * @param {number} value - The value of this knob.
   * @returns This instance, suitable for chaining.
   */
  setValue(value) {
    this._value = value;
    return this;
  }

  /**
   * Sets the value, minimum and maximum of this knob.
   * @param {number} value - The value of this knob.
   * @param {number} min - The minimum value of this knob.
   * @param {number} max - The maximum value of this knob.
   * @returns This instance, suitable for chaining.
   */
  setValueMinMax(value, min, max) {
    this._min = min;
    this._max = max;
    this._value = value;
    return this;
  }

  /**
   * Sets the label of this knob.
   * @param {string} label - The label to set on this knob.
   * @returns This instance, suitable for chaining.
   */
  setLabel(label) {
    this._label = label;
    this._textLabel.text = label;
    return this;
  }

  /**
   * Sets whether the text and value labels will be swapped (value on top, text on bottom).
   * @param {boolean} swapped - Whether the labels will be swapped.
   * @return This instance, suitable for chaining.
   */
  setLabelSwapped(swapped) {
    this._labelsSwapped = swapped;
    this._updateLabelPositions();
    return this;
  }

  /**
   * Sets the mouse drag sensitivity.
   * @param {number} sensitivity - How many pixels of mouse motion are required to move the value between min and max.
   * @return This instance, suitable for chaining.
   */
  setSensitivity(sensitivity) {
    this._sensitivity = sensitivity;
    return this;
  }

  /**
   * Sets the width of the knob container. Of course the knob itself will always be round, so it will be sized according to the minimum of width and height if they are different, and centered within the container rectangle.
   * @param {number} width - the width (and height) of the knob.
   * @returns This instance.
   */
  setWidth(width) {
    super.setWidth(width);
    this._size = Math.min(this._width, this._height);
    this._updateHandleSize();
    this._updateLabelPositions();
    return this;
  }

  //////////////////////////////////
  // Getters/Setters
  // alphabetical. getter first.
  //////////////////////////////////

  /**
   * Sets and gets the number of decimals of precision to be used for the knob. This will effect what is shown in the value label as well as the value property of the knob. A decimals value of 0 will display integers only. Negative decimals will round to the nearest power of 10.
   */
  get decimals() {
    return this.getDecimals();
  }
  set decimals(decimals) {
    this.setDecimals(decimals);
  }

  /**
   * Gets and sets the text of the text label of the knob.
   */
  get label() {
    return this.getLabel();
  }
  set label(label) {
    this.setLabel(label);
  }

  /**
   * Gets and sets whether the text label and value label will be swapped. If true, the text label will be on the bottom and the value label will be on the top.
   */
  get labelsSwapped() {
    return this.getLabelsSwapped();
  }
  set labelsSwapped(swap) {
    this.setLabelSwapped(swap);
  }

  /**
   * Gets and sets the maximum value of the knob.
   */
  get max() {
    return this.getMax();
  }
  set max(max) {
    this.setMax(max);
  }

  /**
   * Gets and sets the minimum value of the knob.
   */
  get min() {
    return this.getMin();
  }
  set min(min) {
    this.setMin(min);
  }

  /**
   * Gets and sets the sensitivity of the knob when clicking and dragging to set a value. Default is 100, which means you'll have to drag the mouse 100 pixels to make the knob value go from its minimum value to its maximum. A higher sensitivity means that the knob will rotate a smaller amount for the same amount of vertical mouse movement.
   */
  get sensitivity() {
    return this.getSensitivity();
  }
  set sensitivity(sensitivity) {
    this.setSensitivity(sensitivity);
  }

  /**
   * Gets and sets the value of the knob.
   */
  get value() {
    return this.getValue();
  }
  set value(value) {
    this.setValue(value);
  }
}

customElements.define("minimal-knob", Knob);

