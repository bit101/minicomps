import { Component } from "./component.js";
import { Defaults } from "./defaults.js";
import { Style } from "./style.js";

/**
 * Creates a static single line text label.
 * <div><img src="https://www.minicomps.org/images/label.png"/></div>
 * @example
 * const panel = new Panel(document.body, 20, 20, 200, 200);
 * new Label(panel, 20, 20, "I am a label");
 * @extends Component
 */
export class Label extends Component {
  /**
   * Constructor
   * @param {HTMLElement} parent - The element to add this label to.
   * @param {number} x - The x position of the label. Default 0.
   * @param {number} y - The y position of the label. Default 0.
   * @param {string} text - The initial text to display in the label. Default empty string.
   */
  constructor(parent, x, y, text) {
    super(parent, x, y);
    this._align = "left";
    this._autosize = true;
    this._color = "#333";
    this._bold = false;
    this._italic = false;
    if (text === null || text === undefined) {
      text = "";
    }
    this._text = text;

    this._createChildren();
    this._createStyle();
    this.setFontSize(Defaults.label.fontSize);
    // width will be 0 until it is on the live DOM
    // so we put it on document.body, get width
    // then remove it and add it to parent.
    document.body.appendChild(this);
    this.setWidth(this._wrapper.offsetWidth);
    this.setText(text);
    this.setHeight(Defaults.label.fontSize + 2);
    this._addToParent();
  }

  //////////////////////////////////
  // Core
  //////////////////////////////////

  _createChildren() {
    this._setWrapperClass("MinimalLabel");
    this._wrapper.textContent = this._text;
  }

  _createStyle() {
    const style = document.createElement("style");
    style.textContent = Style.label;
    this.shadowRoot.append(style);
  }

  //////////////////////////////////
  // Public
  //////////////////////////////////

  getAlign() {
    return this._align;
  }

  getAutoSize() {
    return this._autosize;
  }

  getBold() {
    return this._bold;
  }

  getColor() {
    return this._color;
  }

  getFontSize() {
    return this._fontSize;
  }

  getItalic() {
    return this._italics;
  }

  getText() {
    return this._text;
  }

  /**
   * Sets the alignment of the label's text - "left" (default), "right" or "center".
   * @param {string} align - The alignment of the text.
   * @returns This instance, suitable for chaining.
   */
  setAlign(align) {
    this._align = align;
    this._wrapper.style.textAlign = align;
    return this;
  }

  /**
   * Sets whether the label will be automatically sized to fit its text.
   * @param {boolean} autosize - Whether the label will be auto-sized.
   * @returns This instance, suitable for chaining.
   */
  setAutosize(autosize) {
    this._autosize = autosize;
    if (this._autosize) {
      this._wrapper.style.width = "auto";
      this._width = this._wrapper.offsetWidth;
    } else {
      this._width = this._wrapper.offsetWidth;
      this._wrapper.style.width = this._width + "px";
    }
    return this;
  }

  /**
   * Sets wheter or not the text will be bold.
   * @param {boolean} bold - Whether or not the text will be bold.
   * @returns This instance, suitable for chaining.
   */
  setBold(bold) {
    this._bold = bold;
    if (this._bold) {
      this._wrapper.style.fontWeight = "bold";
    } else {
      this._wrapper.style.fontWeight = "normal";
    }
    return this;
  }

  /**
   * Sets the color of the text.
   * @param {string} color - The color of the text.
   * @returns This instance, suitable for chaining.
   */
  setColor(color) {
    this._color = color;
    this._wrapper.style.color = color;
    return this;
  }

  setEnabled(enabled) {
    if (this._enabled === enabled) {
      return this;
    }
    super.setEnabled(enabled);
    if (this._enabled) {
      this._setWrapperClass("MinimalLabel");
    } else {
      this._setWrapperClass("MinimalLabel MinimalLabelDisabled");
    }
    return this;
  }

  /**
   * Sets the font size of the text.
   * @param {number} fontSize - The font size of the text.
   * @returns This instance, suitable for chaining.
   */
  setFontSize(fontSize) {
    this._fontSize = fontSize;
    this._wrapper.style.fontSize = fontSize + "px";
    return this;
  }

  setHeight(height) {
    super.setHeight(height);
    this._wrapper.style.lineHeight = height + "px";
    return this;
  }

  /**
   * Sets whether or not the text will be italicized.
   * @param {boolean} italics - Whether or not the text will be italicized.
   * @returns This instance, suitable for chaining.
   */
  setItalic(italic) {
    this._italic = italic;
    if (this._italic) {
      this._wrapper.style.fontStyle = "italic";
    } else {
      this._wrapper.style.fontStyle = "normal";
    }
    return this;
  }

  /**
   * Sets the label's text.
   * @param {string} text - The text of the label.
   * @returns This instance, suitable for chaining.
   */
  setText(text) {
    this._text = text;
    this._wrapper.textContent = text;
    if (this._autosize) {
      super.setWidth(this._wrapper.offsetWidth);
    }
    return this;
  }

  setWidth(width) {
    if (!this._autosize) {
      this._width = width;
      this._wrapper.style.width = width + "px";
    }
    return this;
  }

  //////////////////////////////////
  // Getters/Setters
  // alphabetical. getter first.
  //////////////////////////////////

  /**
   * Gets and sets the horizontal alignment of the text in the label (left, right, center). This property will be ingored unless autosize is set to false and the label's width is set to a value higher than the actual width of the text.
   */
  get align() {
    return this.getAlign();
  }
  set align(align) {
    this.setAlign(align);
  }

  /**
   * Gets and sets whether or not the size of the label will automatically adjust to fit the text assigned to it. If autosize is true, setting width or align will be ignored.
   */
  get autosize() {
    return this.getAutoSize();
  }
  set autosize(autosize) {
    this.setAutosize(autosize);
  }

  /**
   * Gets and sets whether or not the text will be bold.
   */
  get bold() {
    return this.getBold();
  }
  set bold(bold) {
    this.setBold(bold);
  }

  /**
   * Gets and sets the color of the text.
   */
  get color() {
    return this.getColor();
  }
  set color(color) {
    this.setColor(color);
  }

  /**
   * Gets and sets the size of the text.
   */
  get fontSize() {
    return this.getFontSize();
  }
  set fontSize(fontSize) {
    this.setFontSize(fontSize);
  }

  /**
   * Gets and sets whether or not the text will be italicized.
   */
  get italic() {
    return this.getItalic();
  }
  set italic(italic) {
    this.setItalic(italic);
  }

  /**
   * Gets and sets the plain text to be displayed. Compare with the htmlText property.
   */
  get text() {
    return this.getText();
  }
  set text(text) {
    this.setText(text);
  }
}

customElements.define("minimal-label", Label);
