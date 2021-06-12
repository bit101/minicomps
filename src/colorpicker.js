import { Component } from "./component.js";
import { Defaults } from "./defaults.js";
import { Label } from "./label.js";
import { Style } from "./style.js";
import { VSlider } from "./vslider.js";

/**
 * Creates a input for entering color values, with a preview swatch. Now includes optional sliders for visually setting colors.
 * <div><img src="https://www.minicomps.org/images/colorpicker.png"/></div>
 * @example
 * const panel = new Panel(document.body, 20, 20, 200, 200);
 * new ColorPicker(panel, 20, 20, "Color", "#f00", event => console.log(event.target.color));
 * @extends Component
 */
export class ColorPicker extends Component {
  /**
   * Constructor
   * @param {HTMLElement} parent - The element to add this color picker to.
   * @param {number} x - The x position of the color picker. Default 0.
   * @param {number} y - The y position of the color picker. Default 0.
   * @param {string} label - The text shown in the text label of the color picker. Default empty string.
   * @param {string} color - The initial color value of the color picker. Default #f00.
   * @param {function} defaultHandler - A function that will handle the "change" event.
   */
  constructor(parent, x, y, label, color, defaultHandler) {
    super(parent, x, y);
    color = color || "#f00";
    this._label = label || "";
    this._labelPosition = Defaults.colorpicker.labelPosition;
    this._color = this._correctColor(color);
    this._color = this._cropColor(color);
    this._sliderPosition = "bottom";
    this._useSliders = true;
    this._width = 100;
    this._height = 20;

    this._createChildren();
    this._createStyle();
    this._createListeners();

    this.addEventListener("change", defaultHandler);
    this._addToParent();
  }

  //////////////////////////////////
  // Core
  //////////////////////////////////

  _createChildren() {
    this._setWrapperClass("MinimalColorPicker");

    this._input = this._createInput(this._wrapper, "MinimalColorPickerInput");
    this._input.maxLength = 7;
    this._input.value = this._color;

    this._textLabel = new Label(this._wrapper, 0, -15, this._label);

    this._sliderContainer = this._createDiv(this._wrapper, "MinimalColorPickerSliders");
    this._redSlider = new VSlider(this._sliderContainer, 12, 20, "R", this.getRed(), 0, 255)
      .setHeight(100);
    this._greenSlider = new VSlider(this._sliderContainer, 42, 20, "G", this.getGreen(), 0, 255)
      .setHeight(100);
    this._blueSlider = new VSlider(this._sliderContainer, 72, 20, "B", this.getBlue(), 0, 255)
      .setHeight(100);

    this._preview = this._createDiv(this._wrapper, "MinimalColorPickerPreview");
    this._preview.style.backgroundColor = this._color;
  }

  _createStyle() {
    const style = document.createElement("style");
    style.textContent = Style.colorpicker;
    this.shadowRoot.append(style);
  }

  _createListeners() {
    this._onFocus = this._onFocus.bind(this);
    this._onInput = this._onInput.bind(this);
    this._updateFromSliders = this._updateFromSliders.bind(this);
    this._onKeyPress = this._onKeyPress.bind(this);

    this._redSlider.addHandler(this._updateFromSliders);
    this._greenSlider.addHandler(this._updateFromSliders);
    this._blueSlider.addHandler(this._updateFromSliders);
    this._input.addEventListener("input", this._onInput);
    this._input.addEventListener("focus", this._onFocus);
    this.addEventListener("keydown", this._onKeyPress);
    this.addEventListener("blur", () => this.showSliders(false));
  }

  //////////////////////////////////
  // Handlers
  //////////////////////////////////

  _onInput() {
    const color = this._correctColor(this._input.value);
    this._input.value = color;
    if ((color.length === 4 || color.length === 7) && this._color !== color) {
      this._color = color;
      this._preview.style.backgroundColor = this._color;
      this._updateSliders();
      this.dispatchEvent(new CustomEvent("change", { detail: this._color }));
    }
  }

  _onFocus() {
    this.showSliders(true);
  }

  _updateFromSliders() {
    const red = this._redSlider.value;
    const green = this._greenSlider.value;
    const blue = this._blueSlider.value;
    this.setRGB(red, green, blue);
    this.dispatchEvent(new CustomEvent("change", { detail: this._color }));
  }

  _onKeyPress(event) {
    if (event.keyCode === 27) {
      // escape
      this.showSliders(false);
    }
  }

  //////////////////////////////////
  // Private
  //////////////////////////////////

  _correctColor(color) {
    color = "#" + color.replace(/[^0-9a-fA-F]/g, "");
    return color.toUpperCase();
  }

  _cropColor(color) {
    if (color.length > 7) {
      color = color.substring(0, 7);
    }
    return color;
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

  _updateSliders() {
    this._redSlider.value = this.getRed();
    this._greenSlider.value = this.getGreen();
    this._blueSlider.value = this.getBlue();
  }

  _updateSliderPosition() {
    if (this._sliderPosition === "bottom") {
      this._sliderContainer.style.top = "25px";
    } else if (this._sliderPosition === "top") {
      this._sliderContainer.style.top = "-155px";
    }
  }

  //////////////////////////////////
  // Public
  //////////////////////////////////

  /**
   * Adds a handler function for the "change" event on this color picker.
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
   * Gets the blue channel of the current color value as a numerical value from 0 to 255.
   */
  getBlue() {
    return this.getNumber() & 255;
  }

  /**
   * @returns the current color.
   */
  getColor() {
    return this._color;
  }

  /**
   * Gets the green channel of the current color value as a numerical value from 0 to 255.
   */
  getGreen() {
    return this.getNumber() >> 8 & 255;
  }

  /**
   * @returns the current label text.
   */
  getLabel() {
    return this._label;
  }

  /**
   * Gets the current label position.
   * @returns The position of the label.
   */
  getLabelPosition() {
    return this._labelPosition;
  }

  /**
   * Gets the current value of this component as a single 24-bit number from 0 to 16777215 (0x000000 to 0xffffff).
   * @returns {number} The numeric representation of this color picker's color.
   */
  getNumber() {
    const c = this._color.substring(1);
    if (c.length === 3) {
      let r = c.charAt(0);
      let g = c.charAt(1);
      let b = c.charAt(2);
      r += r;
      g += g;
      b += b;
      return parseInt(r + g + b, 16);
    }
    return parseInt(c, 16);
  }

  /**
   * Gets the red channel of the current color value as a numerical value from 0 to 255.
   */
  getRed() {
    return this.getNumber() >> 16;
  }

  /**
   * @returns the position of the sliders.
   */
  getSliderPosition() {
    return this._sliderPosition;
  }

  /**
   * @returns Whether or not the color picker is set to use sliders.
  getUseSliders() {
    return this._useSliders;
  }

  /**
   * Sets the color value of this color picker. Valid inputs are three or six character strings containing hexadecimal digits (0-9 and upper or lower case A-F), optionally preceded by a "#" character.
   * @param {string} color - The color to set.
   * @returns This instance, suitable for chaining.
   * @example
   * colorpicker.setColor("#f9c");
   * colorpicker.setColor("#F9C");
   * colorpicker.setColor("f9c");
   * colorpicker.setColor("F9C");
   * colorpicker.setColor("#ff99cc");
   * colorpicker.setColor("#FF99CC");
   * colorpicker.setColor("ff99cc");
   * colorpicker.setColor("FF99CC");
   */
  setColor(color) {
    color = this._correctColor(color);
    color = this._cropColor(color);
    this._color = color;
    this._input.value = color;
    this._preview.style.backgroundColor = color;
    this._updateSliders();
    return this;
  }

  setEnabled(enabled) {
    if (this._enabled !== enabled) {
      super.setEnabled(enabled);
      this._textLabel.enabled = enabled;
      this._input.disabled = !this._enabled;
      if (this._enabled) {
        this._preview.setAttribute("class", "MinimalColorPickerPreview");
        this._input.addEventListener("input", this._onInput);
      } else {
        this._preview.setAttribute("class", "MinimalColorPickerPreviewDisabled");
        this._input.removeEventListener("input", this._onInput);
      }
    }
  }

  /**
   * Sets the height of this component. In reality, this component is fixed size, so setting height or width has no effect.
   */
  setHeight() {
    return this;
  }

  /**
   * Sets the label of this color picker.
   * @param {string} label - The label to set on this color picker.
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
   * @param {string} position - The position to place the text label: "top" (default), "left" or "bottom".
   * @returns this instance, suitable for chaining.
   */
  setLabelPosition(position) {
    this._labelPosition = position;
    this._updateLabel();
    return this;
  }

  /**
   * Sets the color value using a single 24-bit number.
   * @param {number} num - The number to parse into a color value. This would usually be in decimal (e.g. 16777215) or hexadecimal (e.g. 0xffffff).
   * @returns This instance, suitable for chaining.
   */
  setNumber(num) {
    const red = num >> 16;
    const green = num >> 8 & 255;
    const blue = num & 255;
    this.setRGB(red, green, blue);
    return this;
  }

  /**
   * Sets the color value to a random RGB value.
   * @returns This instance, suitable for chaining.
   */
  setRandom() {
    this.setNumber(Math.random() * 0xffffff);
    return this;
  }

  /**
   * Sets the color value using three values for red, green and blue.
   * @param {number} r - The value of the red channel (0 - 255).
   * @param {number} g - The value of the red channel (0 - 255).
   * @param {number} b - The value of the red channel (0 - 255).
   * @returns This instance, suitable for chaining.
   */
  setRGB(r, g, b) {
    let red = r.toString(16);
    let green = g.toString(16);
    let blue = b.toString(16);
    if (red.length === 1) {
      red = "0" + red;
    }
    if (green.length === 1) {
      green = "0" + green;
    }
    if (blue.length === 1) {
      blue = "0" + blue;
    }
    if ( red.charAt(0) === red.charAt(1) && green.charAt(0) === green.charAt(1) && blue.charAt(0) === blue.charAt(1)) {
      red = red.charAt(0);
      green = green.charAt(0);
      blue = blue.charAt(0);
    }
    this.color = red + green + blue;
    return this;
  }

  /**
   * Gets and sets the position of the slider popup.
   * @param {string} position - The position where the popup will open. Valid values are "bottom" (default) and "top".
   * @returns This instance, suitable for chaining.
   */
  setSliderPosition(position) {
    this._sliderPosition = position;
    this._updateSliderPosition();
    return this;
  }

  /**
   * Sets whether clicking into the input area will open up a pane with sliders for setting colors visually.
   * @param {boolean} useSliders - Whether or not to use the slider ui.
   * @returns This instance, suitable for chaining.
   */
  setUseSliders(useSliders) {
    this._useSliders = useSliders;
    return this;
  }

  /**
   * Sets the width of this component. In reality, this component is fixed size, so setting height or width has no effect.
   */
  setWidth() {
    return this;
  }

  /**
   * Programatically show or hide the slider container for setting rgb values visually.
   * @param {boolean} show - Whether to show or hide the sliders.
   * @returns This instance, suitable for chaining.
   */
  showSliders(show) {
    if (show && this._useSliders) {
      this._initialZ = this.style.zIndex;
      this.style.zIndex = Style.popupZIndex;
      this._sliderContainer.style.display = "block";
    } else {
      this.style.zIndex = this._initialZ;
      this._sliderContainer.style.display = "none";
    }
    return this;
  }

  //////////////////////////////////
  // Getters/Setters
  // alphabetical. getter first.
  //////////////////////////////////

  /**
   * Gets the red channel of the current color value as a numerical value from 0 to 255.
   */
  get red() {
    return this.getRed();
  }

  /**
   * Gets the green channel of the current color value as a numerical value from 0 to 255.
   */
  get green() {
    return this.getGreen();
  }

  /**
   * Gets the blue channel of the current color value as a numerical value from 0 to 255.
   */
  get blue() {
    return this.getBlue();
  }

  /**
   * Sets and gets the color value of this color picker. Valid inputs are three or six character strings containing hexadecimal digits (0-9 and upper or lower case A-F), optionally preceded by a "#" character.
   * @example
   * colorpicker.color = "#f9c";
   * colorpicker.color = "#F9C";
   * colorpicker.color = "f9c";
   * colorpicker.color = "F9C";
   * colorpicker.color = "#ff99cc";
   * colorpicker.color = "#FF99CC";
   * colorpicker.color = "ff99cc";
   * colorpicker.color = "FF99CC";
   */
  get color() {
    return this.getColor();
  }
  set color(color) {
    this.setColor(color);
  }

  /**
   * Gets and sets the text of the color picker's label.
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
   * Gets and sets the position of the slider popup. Valid values are "bottom" (default) and "top".
   */
  get sliderPosition() {
    return this.getSliderPosition();
  }
  set sliderPosition(pos) {
    this.setSliderPosition(pos);
  }

  /**
   * Gets and sets whether clicking into the input area will open up a pane with sliders for setting colors visually.
   */
  get useSliders() {
    return this.getUseSliders();
  }
  set useSliders(useSliders) {
    this.setUseSliders(useSliders);
  }
}

customElements.define("minimal-colorpicker", ColorPicker);
