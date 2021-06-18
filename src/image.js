import { Component } from "./component.js";
import { Style } from "./style.js";

/**
 * A component that displays an image loaded from a URL.
 * <div><img src="https://www.minicomps.org/images/image.png"/></div>
 * @example
 * const panel = new Panel(document.body, 20, 20, 200, 200);
 * new Image(panel, 20, 20, "http://www.example.com/someimage.png");
 * @extends Component
 */
export class Image extends Component {
  /**
   * Constructor
   * @param {HTMLElement} parent - The element to add this image to.
   * @param {number} x - The x position of the image. Default 0.
   * @param {number} y - The y position of the image. Default 0.
   * @param {string} url - The URL of the image to display. Default empty string.
   */
  constructor(parent, x, y, url) {
    super(parent, x, y);
    this._url = url || "";

    this._createChildren();
    this._createStyle();
    this._createListeners();

    this.setSize(Image.width, 100);
    this._load();
    this._addToParent();
  }

  //////////////////////////////////
  // Core
  //////////////////////////////////

  _createChildren() {
    this._image = this._createElement(this._wrapper, "img", "MinimalImage");
  }

  _createStyle() {
    const style = document.createElement("style");
    style.textContent = Style.image;
    this.shadowRoot.append(style);
  }

  _createListeners() {
    this._onLoad = this._onLoad.bind(this);
    this._image.addEventListener("load", this._onLoad);
  }

  //////////////////////////////////
  // Handlers
  //////////////////////////////////

  _onLoad() {
    this._origWidth = this._image.width;
    this._origHeight = this._image.height;
    this._updateImageSize();
    this._image.style.visibility = "visible";
  }

  //////////////////////////////////
  // Private
  //////////////////////////////////

  _load() {
    this._image.style.visibility = "hidden";
    this._image.setAttribute("src", this._url);
  }

  _updateImageSize() {
    const aspectRatio = this._origWidth / this._origHeight;
    this._image.width = this._width;
    this._image.height = this._height = this._width / aspectRatio;
    super.setHeight(this._image.height);
  }

  //////////////////////////////////
  // Public
  //////////////////////////////////

  /**
   * @returns the current url.
   */
  getURL() {
    return this._url;
  }

  setEnabled(enabled) {
    if (this._enabled === enabled) {
      return this;
    }
    super.setEnabled(enabled);
    if (this._enabled) {
      this._image.setAttribute("class", "MinimalImage");
    } else {
      this._image.setAttribute("class", "MinimalImageDisabled");
    }
    return this;
  }

  /**
   * Sets the height of the image. This is has no action because the height will be set according to the assigned width and the aspect ratio of the loaded image.
   * @returns This instance, suitable for chaining.
   */
  setHeight() {
    return this;
  }

  /**
   * Sets the url of the image to be displayed. Setting this value will trigger the load of the new image.
   * @param {string} url - The url of the image to load.
   * @returns This instance, suitable for chaining.
   */
  setURL(url) {
    this._url = url;
    this._load();
    return this;
  }

  /**
   * Sets the width of the image. When the image is loaded, it will be set to the assigned width. The height will be set according to the assigned with and the aspect ratio of the loaded image.
   * @param {number} width - The width of the image as displayed.
   * @returns This instance, suitable for chaining.
   */
  setWidth(width) {
    super.setWidth(width);
    if (this._image.width) {
      this._updateImageSize();
    }
    return this;
  }

  //////////////////////////////////
  // Getters/Setters
  // alphabetical. getter first.
  //////////////////////////////////

  /**
   * Gets and sets the url of the image to be displayed. Setting this value will trigger the load of the new image.
   */
  get url() {
    return this.getURL();
  }
  set url(url) {
    this.setUrl(url);
  }
}

//////////////////////////////////
// Defaults
//////////////////////////////////
Image.width = 100;

customElements.define("minimal-image", Image);

