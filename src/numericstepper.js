import { Button } from "./button.js";
import { Component } from "./component.js";
import { Label } from "./label.js";
import { Style } from "./style.js";

/**
 * An input field with buttons for selecting a numeric value. The value can be changed by entering a value directly, clicking on the plus or minus buttons, or scrolling with a mouse wheel or trackpad.
 * <div><img src="https://www.minicomps.org/images/numericstepper.png"/></div>
 * @example
 * const panel = new Panel(document.body, 20, 20, 200, 200);
 * new NumericStepper(panel, 20, 20, 50, 0, 100, event => console.log(event.target.value));
 * @extends Component
 */
export class NumericStepper extends Component {
  /**
   * Constructor
   * @param {HTMLElement} parent - The element to add this numeric stepper to.
   * @param {number} x - The x position of the numeric stepper. Default 0.
   * @param {number} y - The y position of the numeric stepper. Default 0.
   * @param {string} label - The text label of the numeric stepper. Default empty string.
   * @param {number} value - The initial value of the numeric stepper. Default 0.
   * @param {number} min - The minimum value of the numeric stepper. Default 0.
   * @param {number} max - The maximum value of the numeric stepper. Default 100.
   * @param {function} defaultHandler - A function that will handle the "change" event.
   */
  constructor(parent, x, y, label, value, min, max, defaultHandler) {
    super(parent, x, y);
    this._label = label || "";
    this._labelPosition = NumericStepper.labelPosition;

    this._min = min || 0;
    this._max = max || 0;
    this._decimals = NumericStepper.decimals;;
    value = value || 0;
    this._value = this._roundValue(value);

    this._createChildren();
    this._createStyle();
    this._createListeners();

    this.setWidth(NumericStepper.width);
    this.addEventListener("change", defaultHandler);
    this._addToParent();
  }

  //////////////////////////////////
  // Core
  //////////////////////////////////

  _createChildren() {
    this._setWrapperClass("MinimalNumericStepper");

    this._input = this._createInput(this._wrapper, "MinimalNumericStepperInput");
    this._input.value = this._value;

    this._textLabel = new Label(this._wrapper, 0, -15, this._label);

    this._minus = new Button(this._wrapper, 60, 0, "-");
    this._minus.setSize(20, 20);
    this._plus = new Button(this._wrapper, 80, 0, "+");
    this._plus.setSize(20, 20);
  }

  _createStyle() {
    const style = document.createElement("style");
    style.textContent = Style.numericstepper;
    this.shadowRoot.append(style);
  }

  _createListeners() {
    this._onInputChange = this._onInputChange.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onPlusDown = this._onPlusDown.bind(this);
    this._onMinusDown = this._onMinusDown.bind(this);
    this._onPlusUp = this._onPlusUp.bind(this);
    this._onMinusUp = this._onMinusUp.bind(this);
    this._onPlusKeyDown = this._onPlusKeyDown.bind(this);
    this._onMinusKeyDown = this._onMinusKeyDown.bind(this);
    this._onPlusKeyUp = this._onPlusKeyUp.bind(this);
    this._onMinusKeyUp = this._onMinusKeyUp.bind(this);
    this._onWheel = this._onWheel.bind(this);

    this._wrapper.addEventListener("wheel", this._onWheel);

    this._input.addEventListener("input", this._onInput);
    this._input.addEventListener("change", this._onInputChange);

    this._plus.addEventListener("mousedown", this._onPlusDown);
    document.addEventListener("mouseup", this._onPlusUp);
    this._plus.addEventListener("keydown", this._onPlusKeyDown);
    this._plus.addEventListener("keyup", this._onPlusKeyUp);

    this._minus.addEventListener("mousedown", this._onMinusDown);
    document.addEventListener("mouseup", this._onMinusUp);
    this._minus.addEventListener("keydown", this._onMinusKeyDown);
    this._minus.addEventListener("keyup", this._onMinusKeyUp);
  }

  //////////////////////////////////
  // Handlers
  //////////////////////////////////

  _onInput() {
    let value = this._input.value;
    value = value.replace(/[^-.0-9]/g, "");
    this._input.value = value;
  }

  _onInputChange() {
    let value = parseFloat(this._input.value);
    value = this._roundValue(value);
    this._input.value = value;
    if (this._value !== value) {
      this._value = value;
      this.dispatchEvent(new CustomEvent("change", { detail: this._value }));
    }
  }

  _decrement() {
    if (this._isDecrementing) {
      const value = this._roundValue(this._value - 1 / Math.pow(10, this._decimals));
      if (this._value !== value) {
        this.setValue(value);
        this.dispatchEvent(new CustomEvent("change", { detail: this._value }));
      }
      this._timeout = setTimeout(() => this._decrement(), this._delay);
      if (this._delay === 500) {
        this._delay = 50;
      }
    }
  }

  _increment() {
    if (this._isIncrementing) {
      const value = this._roundValue(this._value + 1 / Math.pow(10, this._decimals));
      if (this._value !== value) {
        this.setValue(value);
        this.dispatchEvent(new CustomEvent("change", { detail: this._value }));
      }
      this._timeout = setTimeout(() => this._increment(), this._delay);
      if (this._delay === 500) {
        this._delay = 50;
      }
    }
  }

  _onMinusDown() {
    clearTimeout(this._timeout);
    this._isDecrementing = true;
    this._delay = 500;
    this._decrement();
  }

  _onMinusUp() {
    this._isDecrementing = false;
  }

  _onMinusKeyDown(event) {
    if (event.keyCode === 13) {
      this._onMinusDown();
    }
  }

  _onMinusKeyUp(event) {
    if (event.keyCode === 13) {
      this._onMinusUp();
    }
  }

  _onPlusDown() {
    clearTimeout(this._timeout);
    this._isIncrementing = true;
    this._delay = 500;
    this._increment();
  }

  _onPlusUp() {
    this._isIncrementing = false;
  }

  _onPlusKeyDown(event) {
    if (event.keyCode === 13) {
      this._onPlusDown();
    }
  }

  _onPlusKeyUp(event) {
    if (event.keyCode === 13) {
      this._onPlusUp();
    }
  }

  _onWheel(event) {
    event.preventDefault();
    const inc = 1 / Math.pow(10, this._decimals);
    if (event.deltaY > 0) {
      this.setValue(this._value + inc);
      this.dispatchEvent(new CustomEvent("change", { detail: this._value }));
    } else if (event.deltaY < 0) {
      this.setValue(this._value - inc);
      this.dispatchEvent(new CustomEvent("change", { detail: this._value }));
    }
  }

  //////////////////////////////////
  // Private
  //////////////////////////////////

  _roundValue(value) {
    if (this._max !== null) {
      value = Math.min(value, this._max);
    }
    if (this._min !== null) {
      value = Math.max(value, this._min);
    }
    const mult = Math.pow(10, this._decimals);
    return Math.round(value * mult) / mult;
  }

  _updateLabel() {
    if (this._labelPosition === "left") {
      this._textLabel.x = -this._textLabel.width - 5;
      this._textLabel.y = (this._height - this._textLabel.height) / 2;
    } else if (this._labelPosition === "right") {
      this._textLabel.x = this._width + 5;
      this._textLabel.y = (this._height - this._textLabel.height) / 2;
    } else if (this._labelPosition === "top") {
      this._textLabel.x = 0;
      this._textLabel.y = -this._textLabel.height - 5;
    } else {
      this._textLabel.x = 0;
      this._textLabel.y = this._height + 5;
    }
  }

  //////////////////////////////////
  // Public
  //////////////////////////////////

  /**
   * Adds a handler function for the "change" event on this numeric stepper.
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

  getLabelPosition() {
    return this._labelPosition;
  }

  getMax() {
    return this._max;
  }

  getMin() {
    return this._min;
  }

  getValue() {
    return this._value;
  }

  /**
   * Sets the number of decimals of precision to be used for the numeric stepper. This will effect what is shown in the value label as well as the value property of the numeric stepper. A decimals value of 0 will display integers only. Negative decimals will round to the nearest power of 10.
   * @param {number} decimals - The decimals of precision to use.
   * @returns This instance, suitable for chaining.
   */
  setDecimals(decimals) {
    this._decimals = decimals;
    const value = this._roundValue(this._value);
    if (this._value !== value) {
      this._value = value;
      this._input.value = value;
    }
    return this;
  }

  setEnabled(enabled) {
    if (this._enabled === enabled) {
      return this;
    }
    super.setEnabled(enabled);
    this._input.disabled = !this._enabled;
    this._plus.enabled = this._enabled;
    this._minus.enabled = this._enabled;
    this._textLabel.enabled = enabled;
    if (this._enabled) {
      this._wrapper.addEventListener("wheel", this._onWheel);
    } else {
      this._wrapper.removeEventListener("wheel", this._onWheel);
    }
    return this;
  }

  /**
   * Sets the height of the stepper. In fact, this component has a fixed height, so this method does nothing.
  setHeight() {
    return this;
  }

  /**
   * Sets the text of this numeric stepper.
   * @param {string} label - The label to set on this numeric stepper.
   * @returns this instance, suitable for chaining.
   */
  setLabel(label) {
    this._label = label;
    this._textLabel.text = label;
    this._updateLabel();
    return this;
  }

  /**
   * Sets the position of the text label.
   * @param {string} position - The position to place the text lable: "top" (default), "left", "right" or "bottom".
   * @returns this instance, suitable for chaining.
   */
  setLabelPosition(position) {
    this._labelPosition = position;
    this._updateLabel();
    return this;
  }

  /**
   * Sets the maximum value of this numeric stepper.
   * @param {number} max - The maximum value of this numeric stepper.
   * @returns This instance, suitable for chaining.
   */
  setMax(max) {
    this._max = max;
    if (this._max < this._value) {
      this.setValue(this._max);
    }
    return this;
  }

  /**
   * Sets the minimum value of this numeric stepper.
   * @param {number} min - The minimum value of this numeric stepper.
   * @returns This instance, suitable for chaining.
   */
  setMin(min) {
    this._min = min;
    if (this._min > this._value) {
      this.setValue(this._min);
    }
    return this;
  }

  /**
   * Sets the value of this numeric stepper.
   * @param {number} value - The value of this numeric stepper.
   * @returns This instance, suitable for chaining.
   */
  setValue(value) {
    this._value = this._roundValue(value);
    this._input.value = this._value;
    return this;
  }

  /**
   * Sets the value, minimum and maximum of this numeric stepper.
   * @param {number} value - The value of this numeric stepper.
   * @param {number} min - The minimum value of this numeric stepper.
   * @param {number} max - The maximum value of this numeric stepper.
   * @returns This instance, suitable for chaining.
   */
  setValueMinMax(value, min, max) {
    this._min = min;
    this._max = max;
    this.setValue(value);
    return this;
  }

  setWidth(width) {
    width = Math.max(width, 40);
    super.setWidth(width);
    this._input.style.width = width - 40 + "px";
    this._minus.x = width - 40;
    this._plus.x = width - 20;
    return this;
  }

  //////////////////////////////////
  // Getters/Setters
  // alphabetical. getter first.
  //////////////////////////////////

  /**
   * Sets and gets the number of decimals of precision to be used for the stepper. This will effect what is shown in the value label as well as the value property of the stepper. A decimals value of 0 will display integers only. Negative decimals will round to the nearest power of 10. Clicking the plus and minus button will _increment or _decrement the stepper's value by the smallest displayed value.
   */
  get decimals() {
    return this.getDecimals();
  }
  set decimals(decimals) {
    this.setDecimals(decimals);
  }

  /**
   * Gets and sets the text of the color picker's text label.
   */
  get label() {
    return this.getLabel();
  }
  set label(label) {
    this.setLabel(label);
  }

  /**
   * Gets and sets the position of the text label displayed on the color picker. Valid values are "top" (default), "left", "right" and "bottom".
   */
  get labelPosition() {
    return this.getLabelPosition();
  }
  set labelPosition(pos) {
    this.setLabelPosition(pos);
  }

  /**
   * Gets and sets the maximum value of the stepper.
   */
  get max() {
    return this.getMax();
  }
  set max(max) {
    this.setMax(max);
  }

  /**
   * Gets and sets the minimum value of the stepper.
   */
  get min() {
    return this.getMin();
  }
  set min(min) {
    this.setMin(min);
  }

  /**
   * Gets and sets the value of the stepper.
   */
  get value() {
    return this.getValue();
  }
  set value(value) {
    this.setValue(value);
  }
}

//////////////////////////////////
// Defaults
//////////////////////////////////
NumericStepper.decimals = 0;
NumericStepper.labelPosition = "top";
NumericStepper.width = 100;

customElements.define("minimal-numericstepper", NumericStepper);

