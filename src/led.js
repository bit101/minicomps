import { Component } from "./component.js";
import { Defaults } from "./defaults.js";
import { Label } from "./label.js";
import { Style } from "./style.js";

/**
 * A representation of a colored LED. It can be set to lit or unlit and be set to blink at any rate. The color of the LED can be set to any valid CSS color. It also has a text label.
 * <div><img src="https://www.minicomps.org/images/led.png"/></div>
 * @example
 * const panel = new Panel(document.body, 20, 20, 240, 240);
 * const canvas = new LED(panel, 20, 20, "LED", "#f00", true);
 * @extends Component
 */
export class LED extends Component {
  /**
   * Constructor
   * @param {HTMLElement} parent - The element to add this LED to.
   * @param {number} x - The x position of the LED. Default 0.
   * @param {number} y - The y position of the LED. Default 0.
   * @param {string} label - The text of the label of the LED. Default empty string.
   * @param {string} color - The color of the LED. Default #f00.
   * @param {boolean} lit - The initial lit state of the LED. Default false.
   */
  constructor(parent, x, y, label, color, lit) {
    super(parent, x, y);
    this._label = label || "";
    this._color = color || "#f00";
    this._lit = lit || false;

    const size = 16;

    this._createChildren();
    this._setWrapperClass("MinimalLED");
    this._createStyle();

    this.setLabelPosition(Defaults.led.labelPosition);
    this.setSize(size, size);
    this._updateLED();
    this._updateLabel();
    this._addToParent();
  }

  //////////////////////////////////
  // Core
  //////////////////////////////////

  _createChildren() {
    this._textLabel = new Label(this._wrapper, 0, -15, this._label);
  }

  _createStyle() {
    const style = document.createElement("style");
    style.textContent = Style.led;
    this.shadowRoot.append(style);
  }

  //////////////////////////////////
  // Handlers
  //////////////////////////////////

  //////////////////////////////////
  // Private
  //////////////////////////////////

  _updateLED() {
    if (this._lit) {
      this._wrapper.style.background = `radial-gradient(circle at 60% 37%, #fff, ${this._color} 50%, #444 100%)`;
    } else {
      this._wrapper.style.background = "radial-gradient(circle at 60% 37%, #fff, #999 50%)";
    }
  }

  _updateLabel() {
    if (this._labelPosition === "left") {
      this._textLabel.x = -this._textLabel.width - 5;
      this._textLabel.y = (this._height - this._textLabel.height) / 2;
    } else if (this._labelPosition === "top") {
      this._textLabel.x = (this._width - this._textLabel.width) / 2;
      this._textLabel.y = -this._textLabel.height - 5;
    } else if (this._labelPosition === "right") {
      this._textLabel.x = this._width + 5;
      this._textLabel.y = (this._height - this._textLabel.height) / 2;
    } else {
      this._textLabel.x = (this._width - this._textLabel.width) / 2;
      this._textLabel.y = this._height + 5;
    }
  }

  //////////////////////////////////
  // Public
  //////////////////////////////////

  /**
   * Starts the LED blinking at a specified or default rate.
   * @param {number} bps - Blinks per second. Defaults to 2 blinks per second if no parameter is given.
   * @returns This instance, suitable for chaining.
   */
  blink(bps) {
    if (!this._enabled) {
      return;
    }
    bps = bps || 2;
    clearInterval(this._interval);
    this._blinking = true;
    this._interval = setInterval(() => {
      if (this._blinking) {
        this.setLit(!this._lit);
      }
    }, 1 / bps * 1000);
    return this;
  }

  getBlinking() {
    return this._blinking;
  }

  getColor() {
    return this._color;
  }

  getLabel() {
    return this._label;
  }

  getLabelPosition() {
    return this._labelPosition;
  }

  getLit() {
    return this._lit;
  }

  /**
   * Sets the color of this LED.
   * @param {string} color - The color to set.
   * @returns This instance, suitable for chaining.
   */
  setColor(color) {
    this._color = color;
    this._updateLED();
    return this;
  }

  setEnabled(enabled) {
    if (this._enabled === enabled) {
      return this;
    }
    super.setEnabled(enabled);
    this._textLabel.enabled = enabled;
    if (this._enabled) {
      this._wrapper.setAttribute("class", "MinimalLED");
    } else {
      this.stop();
      this._wrapper.setAttribute("class", "MinimalLEDDisabled");
    }
    return this;
  }

  setHeight(height) {
    super.setHeight(height);
    super.setWidth(height);
    return this;
  }

  /**
   * Sets the label of this LED.
   * @param {string} label - The label to set on this LED.
   * @returns this instance, suitable for chaining.
   */
  setLabel(label) {
    this._label = label;
    this._textLabel.text = label;
    this._updateLabel();
    return this;
  }

  /**
   * Sets the text position of the text label.
   * @param {string} position - The position to place the text lable: "top" (default), "left", "right" or "bottom".
   * @returns this instance, suitable for chaining.
   */
  setLabelPosition(position) {
    this._labelPosition = position;
    this._updateLabel();
    return this;
  }

  /**
   * Sets whether this LED is lit up.
   * @param {boolean} lit - Whether or not the LED is lit.
   * @returns This instance, suitable for chaining.
   */
  setLit(lit) {
    this._lit = lit;
    this._updateLED();
    return this;
  }

  /**
   * Sets the size of the LED. Because an LED will always be round, if you try to set width and height to different values, they will be set to the smallest value of the two.
   * @param {number} width - The width of the LED.
   * @param {number} height - The height of the LED.
   * @returns This instance, suitable for chaining.
   */
  setSize(w, h) {
    const size = Math.min(w, h);
    super.width = size;
    super.height = size;
    return this;
  }

  setWidth(width) {
    super.setWidth(width);
    super.setHeight(width);
    return this;
  }

  /**
   * Stops the LED blinking and turns it off.
   * @returns This instance, suitable for chaining.
   */
  stop() {
    this._blinking = false;
    clearInterval(this._interval);
    this.setLit(false);
    return this;
  }

  //////////////////////////////////
  // Getters/Setters
  // alphabetical. getter first.
  //////////////////////////////////

  get blinking() {
    return this.getBlinking();
  }

  /**
   * Gets and sets the color of the LED.
   */
  get color() {
    return this.getColor();
  }
  set color(color) {
    this.setColor(color);
  }

  /**
   * Gets and sets the text of the LED's text label.
   */
  get label() {
    return this.getLabel();
  }
  set label(label) {
    this.setLabel(label);
  }

  /**
   * Gets and sets the position of the text label displayed on the LED. Valid values are "top" (default), "left", "right" and "bottom".
   */
  get labelPosition() {
    return this.getLabelPosition();
  }
  set labelPosition(pos) {
    this.setLabelPosition(pos);
  }
  /**
   * Gets and sets whether or not this LED is lit.
   */
  get lit() {
    return this.getLit();
  }
  set lit(lit) {
    this.setLit(lit);
  }
}

customElements.define("minimal-led", LED);

