import { Component } from "./component.js";
import { Defaults } from "./defaults.js";
import { Label } from "./label.js";
import { Style } from "./style.js";

/**
 * A horizontal slider for visually selecting a numeric value. The slider can be moved by clicking and dragging, scrolling with a mouse wheel or trackpad or the use of the keyboard (arrow keys, page up/down, home/end).
 * <div><img src="https://www.minicomps.org/images/hslider.png"/></div>
 * @example
 * const panel = new Panel(document.body, 20, 20, 200, 200);
 * new HSlider(panel, 20, 20, "Volume", 50, 0, 100,  event => console.log(event.target.value));
 * @extends Component
 */
export class HSlider extends Component {
  /**
   * Constructor
   * @param {HTMLElement} parent - The element to add this slider to.
   * @param {number} x - The x position of the slider. Default 0.
   * @param {number} y - The y position of the slider. Default 0.
   * @param {string} label - The text label of the slider. Default empty string.
   * @param {number} value - The initial value of the slider. Default 0.
   * @param {number} min - The minimum value of the slider. Default 0.
   * @param {number} max - The maximum value of the slider. Default 100.
   * @param {function} defaultHandler - A function that will handle the "change" event.
   */
  constructor(parent, x, y, label, value, min, max, defaultHandler) {
    super(parent, x, y);
    this._min = min || 0;
    this._max = max || 100;
    this._setDefaults();
    this._reversed = false;
    this._value = value || 0;
    this._showValue = true;
    this._label = label || "";

    this._createChildren();
    this._createStyle();
    this._createListeners();

    this._setSliderSize();
    this._updateHandlePosition();
    this._updateLabelPosition();
    this._updateValueLabelPosition();
    this.addEventListener("change", defaultHandler);
    this._addToParent();
  }

  //////////////////////////////////
  // Core
  //////////////////////////////////
  _createChildren() {
    this._wrapper.tabIndex = 0;
    this._setWrapperClass("MinimalSlider");
    this._handle = this._createDiv(this._wrapper, "MinimalSliderHandle");
    this._textLabel = new Label(this._wrapper, 0, 0, this._label);
    this._valueLabel = new Label(this._wrapper, 0, 0, this._formatValue());
  }

  _createStyle() {
    const style = document.createElement("style");
    style.textContent = Style.hslider;
    this.shadowRoot.append(style);
    this.setHandleSize(Defaults.hslider.handleSize);
  }

  _createListeners() {
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onWheel = this._onWheel.bind(this);
    this._wrapper.addEventListener("wheel", this._onWheel);
    this._wrapper.addEventListener("mousedown", this._onMouseDown);
    this._wrapper.addEventListener("touchstart", this._onMouseDown);
    this._wrapper.addEventListener("keydown", this._onKeyDown);
  }

  //////////////////////////////////
  // Handlers
  //////////////////////////////////
  _onMouseDown(event) {
    let mouseX;
    if (event.changedTouches) {
      event.preventDefault();
      this._wrapper.focus();
      mouseX = event.changedTouches[0].clientX;
    } else {
      mouseX = event.clientX;
    }
    this._offsetX = mouseX - this.getBoundingClientRect().left - this._handle.offsetLeft;
    if (this._offsetX < 0 || this._offsetX > this._handleSize) {
      this._offsetX = this._handleSize / 2;
      const x = mouseX - this.getBoundingClientRect().left - this._handleSize / 2;
      this._calculateValueFromPos(x);
    }
    document.addEventListener("mousemove", this._onMouseMove);
    document.addEventListener("touchmove", this._onMouseMove);
    document.addEventListener("mouseup", this._onMouseUp);
    document.addEventListener("touchend", this._onMouseUp);
  }

  _onMouseMove(event) {
    let mouseX;
    if (event.changedTouches) {
      mouseX = event.changedTouches[0].clientX;
    } else {
      mouseX = event.clientX;
    }
    const x = mouseX - this.getBoundingClientRect().left - this._offsetX;
    this._calculateValueFromPos(x);
  }

  _onMouseUp() {
    document.removeEventListener("mousemove", this._onMouseMove);
    document.removeEventListener("touchmove", this._onMouseMove);
    document.removeEventListener("mouseup", this._onMouseUp);
    document.removeEventListener("touchend", this._onMouseUp);
  }

  _onKeyDown(event) {
    let inc = 1 / Math.pow(10, this._decimals);
    if (this._reversed) {
      inc = -inc;
    }
    let value = this.getValue();

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
    let value = this.getValue();
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

  _calculateValueFromPos(x) {
    let percent = x / (this._width - this._handleSize);
    if (this._reversed) {
      percent = 1 - percent;
    }
    const value = this._min + (this._max - this._min) * percent;
    if (value !== this.getValue()) {
      this._updateValue(value);
      this.dispatchEvent(new CustomEvent("change", { detail: this.getValue() }));
    }
  }

  _formatValue() {
    let valStr = this.getValue().toString();
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

  _setDefaults() {
    this._handleSize = Defaults.hslider.handleSize;
    this._decimals = Defaults.hslider.decimals;
    this._labelPosition = Defaults.hslider.labelPosition;
    this._valuePosition = Defaults.hslider.valuePosition;
  }

  _updateHandlePosition() {
    let percent = (this.getValue() - this._min) / (this._max - this._min);
    if (this._reversed) {
      percent = 1 - percent;
    }
    percent = Math.max(0, percent);
    percent = Math.min(1, percent);
    this._handle.style.left = percent * (this._width - this._handleSize) + "px";
  }

  _updateEnabledStyle() {
    this._textLabel.enabled = this._enabled;
    this._valueLabel.enabled = this._enabled;
    if (this._enabled) {
      this._setWrapperClass("MinimalSlider");
      this._handle.setAttribute("class", "MinimalSliderHandle");
    } else {
      this._setWrapperClass("MinimalSliderDisabled");
      this._handle.setAttribute("class", "MinimalSliderHandleDisabled");
    }
  }

  _updateLabelPosition() {
    if (this._labelPosition === "left") {
      this._textLabel.x = -this._textLabel.width - 5;
      this._textLabel.y = (this._height - this._textLabel.height) / 2;
    } else if (this._labelPosition === "right") {
      this._textLabel.x = this._width + 5;
      this._textLabel.y = (this._height - this._textLabel.height) / 2;
    } else if (this._labelPosition === "top") {
      this._textLabel.x = 0;
      this._textLabel.y = -this._textLabel.height - 5;
    } else if (this._labelPosition === "bottom") {
      this._textLabel.x = 0;
      this._textLabel.y = this._height + 5;
    }
  }

  _updateValueLabelPosition() {
    if (this._valuePosition === "left") {
      this._valueLabel.x = -this._valueLabel.width - 5;
      this._valueLabel.y = (this._height - this._valueLabel.height) / 2;
    } else if (this._valuePosition === "right") {
      this._valueLabel.x = this._width + 5;
      this._valueLabel.y = (this._height - this._valueLabel.height) / 2;
    } else if (this._valuePosition === "top") {
      this._valueLabel.x = this._width - this._valueLabel.width;
      this._valueLabel.y = -this._valueLabel.height - 5;
    } else if (this._valuePosition === "bottom") {
      this._valueLabel.x = this._width - this._valueLabel.width;
      this._valueLabel.y = this._height + 5;
    }
  }

  _setSliderSize() {
    this.setSize(Defaults.hslider.width, Defaults.hslider.height);
  }

  _updateValue(value) {
    if (this._value !== value) {
      this._value = value;
      this._updateHandlePosition();
      this._valueLabel.text = this._formatValue();
      this._updateValueLabelPosition();
    }
  }

  //////////////////////////////////
  // Public
  //////////////////////////////////

  /**
   * Adds a handler function for the "change" event on this slider.
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

  /**
   * @returns the number of decimals of precision will be used for the value.
   */
  getDecimals() {
    return this._decimals;
  }

  /**
   * @returns the width of the slider handle.
   */
  getHandlesSize() {
    return this._handleSize;
  }

  /**
   * @returns the maximum value of the slider.
   */
  getMax() {
    return this._max;
  }

  /**
   * @returns the minimum value of the slider.
   */
  getMin() {
    return this._min;
  }

  /**
   * @returns whether or not the slider is reversed (high value on left / bottom, low value on right / top).
   */
  getReversed() {
    return this._reversed;
  }

  /**
   * @returns whether or not the value label will be shown.
   */
  getShowValue() {
    return this._showValue;
  }

  /**
   * @returns the text of the label.
   */
  getLabel() {
    return this._label;
  }

  /**
   * @returns the position of the text label.
   */
  getLabelPosition() {
    return this._labelPosition;
  }

  /**
   * @returns the current value of the slider.
   */
  getValue() {
    return this._roundValue(this._value);
  }

  /**
   * @returns the position of the value label.
   */
  getValuePosition() {
    return this._valuePosition;
  }

  /**
   * Sets the number of decimals of precision to be used for the slider. This will effect what is shown in the value label as well as the value property of the slider. A decimals value of 0 will display integers only. Negative decimals will round to the nearest power of 10.
   * @param {number} decimals - The decimals of precision to use.
   * @returns This instance, suitable for chaining.
   */
  setDecimals(decimals) {
    this._decimals = decimals;
    this._valueLabel.text = this._formatValue();
    this._updateValueLabelPosition();
    this._updateHandlePosition();
    return this;
  }

  setEnabled(enabled) {
    if (this._enabled !== enabled) {
      super.setEnabled(enabled);
      this._updateEnabledStyle();
      if (this._enabled) {
        this._wrapper.tabIndex = 0;
        this._wrapper.addEventListener("wheel", this._onWheel);
        this._wrapper.addEventListener("mousedown", this._onMouseDown);
        this._wrapper.addEventListener("touchstart", this._onMouseDown);
        this._wrapper.addEventListener("keydown", this._onKeyDown);
      } else {
        this._wrapper.tabIndex = -1;
        this._wrapper.removeEventListener("wheel", this._onWheel);
        this._wrapper.removeEventListener("mousedown", this._onMouseDown);
        this._wrapper.removeEventListener("touchstart", this._onMouseDown);
        this._wrapper.removeEventListener("keydown", this._onKeyDown);
        document.removeEventListener("mousemove", this._onMouseMove);
        document.removeEventListener("touchmove", this._onMouseMove);
        document.removeEventListener("mouseup", this._onMouseUp);
        document.removeEventListener("touchend", this._onMouseUp);
      }
    }
    return this;
  }

  /**
   * Gets and sets the width of the draggable slider handle. If you make the slider thicker by changing its height, you may want to adjust the handle size as well. If handleSize is the same as the slider height, then the handle will be a square.
   * @param {number} handleSize - The size of the handle.
   * @returns This instance, suitable for chaining.
   */
  setHandleSize(handleSize) {
    this._handleSize = handleSize;
    this._handle.style.width = handleSize + "px";
    this._updateHandlePosition();
    return this;
  }

  setHeight(height) {
    super.setHeight(height);
    this._updateLabelPosition();
    this._updateValueLabelPosition();
    return this;
  }

  /**
   * Sets the label of this slider.
   * @param {string} label - The label to set on this slider.
   * @returns this instance, suitable for chaining.
   */
  setLabel(label) {
    this._label = label;
    this._textLabel.text = label;
    this._updateLabelPosition();
    return this;
  }

  /**
   * Sets the position of the text label.
   * @param {string} position - The position to place the text lable: "top" (default), "right", "left" or "bottom".
   * @returns this instance, suitable for chaining.
   */
  setLabelPosition(position) {
    this._labelPosition = position;
    this._updateLabelPosition();
    if (position === "left" && this._valuePosition === "left") {
      this._valuePosition = "right";
    }
    if (position === "right" && this._valuePosition === "right") {
      this._valuePosition = "left";
    }
    return this;
  }

  /**
   * Sets the maximum value of this slider.
   * @param {number} max - The maximum value of this slider.
   * @returns This instance, suitable for chaining.
   */
  setMax(max) {
    this._max = max;
    this._updateValue(this.getValue());
    this._updateHandlePosition();
    return this;
  }

  /**
   * Sets the minimum value of this slider.
   * @param {number} min - The minimum value of this slider.
   * @returns This instance, suitable for chaining.
   */
  setMin(min) {
    this._min = min;
    this._updateValue(this.getValue());
    this._updateHandlePosition();
    return this;
  }

  /**
   * Sets whether the slider is reversed. A reversed HSlider will show its maximum value on the left and minumum on the right. A reversed VSlider will show its maximum value on the bottom and minimum on the top.
   * @param {boolean} reversed - Whether or not this slider will be reversed.
   * @returns This instance, suitable for chaining.
   */
  setReversed(reversed) {
    this._reversed = reversed;
    return this;
  }

  /**
   * Sets whether or not the value of this slider will be shown.
   * @param {boolean} showValue - Whether or not the value will be shown.
   * @returns This instance, suitable for chaining.
   */
  setShowValue(showValue) {
    this._showValue = showValue;
    if (this._showValue) {
      this._valueLabel.style.visibility = "visible";
    } else {
      this._valueLabel.style.visibility = "hidden";
    }
    return this;
  }

  /**
   * Sets the value of this slider.
   * @param {number} value - The value of this slider.
   * @returns This instance, suitable for chaining.
   */
  setValue(value) {
    this._updateValue(value);
    return this;
  }

  /**
   * Sets the value, minimum and maximum of this slider.
   * @param {number} value - The value of this slider.
   * @param {number} min - The minimum value of this slider.
   * @param {number} max - The maximum value of this slider.
   * @returns This instance, suitable for chaining.
   */
  setValueMinMax(value, min, max) {
    this._min = min;
    this._max = max;
    this.setValue(value);
    return this;
  }

  /**
   * Sets the position of the value label.
   * @param {string} position - The position to place the value lable: "top" (default), "right", left" or "bottom".
   * @returns this instance, suitable for chaining.
   */
  setValuePosition(position) {
    this._valuePosition = position;
    this._updateValueLabelPosition();
    if (position === "left" && this._labelPosition === "left") {
      this._labelPosition = "right";
    }
    if (position === "right" && this._labelPosition === "right") {
      this._labelPosition = "left";
    }
    return this;
  }

  setWidth(width) {
    super.setWidth(width);
    this._updateValueLabelPosition();
    this._updateHandlePosition();
    return this;
  }

  //////////////////////////////////
  // Getters/Setters
  // alphabetical. getter first.
  //////////////////////////////////

  /**
   * Sets and gets the number of decimals of precision to be used for the slider. This will effect what is shown in the value label as well as the value property of the slider. A decimals value of 0 will display integers only. Negative decimals will round to the nearest power of 10.
   */
  get decimals() {
    return this.getDecimals();
  }
  set decimals(decimals) {
    this.setDecimals(decimals);
  }

  /**
   * Gets and sets the width of the draggable slider handle. If you make the slider thicker by changing its height, you may want to adjust the handle size as well. If handleSize is the same as the slider height, then the handle will be a square.
   * <div><img src="https://www.minicomps.org/images/hsliderhandlesize.png"/></div>
   */
  get handleSize() {
    return this.getHandlesSize();
  }
  set handleSize(handleSize) {
    this.setHandleSize(handleSize);
  }

  /**
   * Gets and sets the text of the text label of the slider.
   */
  get label() {
    return this.getLabel();
  }
  set label(label) {
    this.setLabel(label);
  }

  /**
   * Gets and sets the position of the text label displayed on the slider. Valid values are "top" (default), "right", "left" and "bottom". Not applicable to a VSlider.
   */
  get labelPosition() {
    return this.getLabelPosition();
  }
  set labelPosition(position) {
    this.setLabelPosition(position);
  }

  /**
   * Gets and sets the maximum value of the slider.
   */
  get max() {
    return this.getMax();
  }
  set max(max) {
    this.setMax(max);
  }

  /**
   * Gets and sets the minimum value of the slider.
   */
  get min() {
    return this.getMin();
  }
  set min(min) {
    this.setMin(min);
  }

  /**
   * Gets and sets whether the slider is reversed. A reversed HSlider will show its maximum value on the left and minumum on the right. A reversed VSlider will show its maximum value on the bottom and minimum on the top.
   */
  get reversed() {
    return this.getReversed();
  }
  set reversed(reversed) {
    this.setReversed(reversed);
  }

  /**
   * Gets and sets whether or not the value label will be displayed.
   */
  get showValue() {
    return this.getShowValue();
  }
  set showValue(show) {
    this.setShowValue(show);
  }

  /**
   * Gets and sets the value of the slider.
   */
  get value() {
    return this.getValue();
  }
  set value(value) {
    this.setValue(value);
  }

  /**
   * Gets and sets the position of the value label displayed on the slider. Valid values are "top" (default), "right", "left" and "bottom". Not applicable to a VSlider.
   */
  get valuePosition() {
    return this.getValuePosition();
  }
  set valuePosition(position) {
    this.setValuePosition(position);
  }
}

customElements.define("minimal-hslider", HSlider);

