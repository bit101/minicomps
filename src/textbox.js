import { Component } from "./component.js";
import { Style } from "./style.js";

/**
 * Creates a static box for multiline text. Accepts HTML text.
 * <div><img src="https://www.minicomps.org/images/textbox.png"/></div>
 * @example
 * const panel = new Panel(document.body, 20, 20, 200, 200);
 * new TextBox(panel, 20, 20, "Hello");
 * @extends Component
 */
export class TextBox extends Component {
  /**
   * Constructor
   * @param {HTMLElement} parent - The element to add this text box to.
   * @param {number} x - The x position of the text box. Default 0.
   * @param {number} y - The y position of the text box. Default 0.
   * @param {string} text - The initial text to display in the text box. Default empty string.
   */
  constructor(parent, x, y, text) {
    super(parent, x, y);
    this._align = "left";
    this._color = "#333";
    this._bold = false;
    this._italic = false;
    this._html = false;
    this._text = text || "";

    this._createChildren();
    this._createStyle();

    this.setSize(100, 100);
    this._addToParent();
  }

  //////////////////////////////////
  // Core
  //////////////////////////////////

  _createChildren() {
    this._setWrapperClass("MinimalTextBox");
    this._wrapper.textContent = this._text;
  }

  _createStyle() {
    const style = document.createElement("style");
    style.textContent = Style.textbox;
    this.shadowRoot.append(style);
  }

  //////////////////////////////////
  // Public
  //////////////////////////////////

  /**
   * @returns the alignment of the text.
   */
  getAlign() {
    return this._align;
  }

  /**
   * @returns whether or not the text will be bold.
   */
  getBold() {
    return this._bold;
  }

  /**
   * @returns the color of the text.
   */
  getColor() {
    return this._color;
  }

  /**
   * @returns the font size of th text.
   */
  getFontSize() {
    return this._fontSize;
  }

  /**
   * @returns the html text in the textbox (if any).
   */
  getHtml() {
    return this._html;
  }

  /**
   * @returns whether the text will be italic.
   */
  getItalic() {
    return this._italics;
  }

  /**
   * @returns the text in the textbox.
   */
  getText() {
    return this._text;
  }

  /**
   * Sets the alignment of the text box's text - "left" (default), "right" or "center".
   * @param {string} align - The alignment of the text.
   * @returns This instance, suitable for chaining.
   */
  setAlign(align) {
    this._align = align;
    this._wrapper.style.textAlign = align;
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
      this._setWrapperClass("MinimalTextBox");
    } else {
      this._setWrapperClass("MinimalTextBoxDisabled");
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

  /**
   * Sets a string of HTML text to display. This will accept pretty much any kind of valid HTML markup you can put into a string.
   * @param {string} html - The HTML to set.
   * @returns This instance, suitable for chaining.
   */
  setHtml(html) {
    this._html = html;
    if (this._html) {
      this._wrapper.innerHTML = this._text;
    } else {
      this._wrapper.textContent = this._text;
    }
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
   * Sets the text box's text.
   * @param {string} text - The text of the text box.
   * @returns This instance, suitable for chaining.
   */
  setText(text) {
    this._text = text;
    if (this._html) {
      this._wrapper.innerHTML = this._text;
    } else {
      this._wrapper.textContent = this._text;
    }
    return this;
  }

  //////////////////////////////////
  // Getters/Setters
  // alphabetical. getter first.
  //////////////////////////////////

  /**
   * Gets and sets the horizontal alignment of the text in the text box (left, right, center).
   */
  get align() {
    return this.getAlign();
  }
  set align(align) {
    this.setAlign(align);
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
   * Gets and sets a string of HTML text to display. This will accept pretty much any kind of valid HTML markup you can put into a string.
   */
  get html() {
    return this.getHtml();
  }
  set html(html) {
    this.setHtml(html);
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

customElements.define("minimal-textbox", TextBox);

