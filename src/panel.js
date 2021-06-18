import { Component } from "./component.js";
import { Style } from "./style.js";

/**
 * Creates a panel to be used as a parent for other components.
 * <div><img src="https://www.minicomps.org/images/panel.png"/></div>
 * @example
 * const panel = new Panel(document.body, 20, 20, 200, 200);
 * new Button(panel, 20, 20, "Click");
 * @extends Component
 */
export class Panel extends Component {
  /**
   * Constructor
   * @param {HTMLElement} parent - The element to add this panel to.
   * @param {number} x - The x position of the panel. Default 0.
   * @param {number} y - The y position of the panel. Default 0.
   * @param {number} w - The width of the panel. Default window.innerWidth.
   * @param {number} h - The height of the panel. Default window.innerHeight.
   */
  constructor(parent, x, y, w, h) {
    super(parent, x, y);
    w = w || window.innerWidth;
    h = h || window.innerHeight;

    this._createChildren();
    this._createStyle();
    this.setSize(w, h);
    this._addToParent();
  }

  //////////////////////////////////
  // Core
  //////////////////////////////////

  _createChildren() {
    this._setWrapperClass("MinimalPanel");
  }

  _createStyle() {
    const style = document.createElement("style");
    style.textContent = Style.panel;
    this.shadowRoot.append(style);
  }

  //////////////////////////////////
  // Public
  //////////////////////////////////

  setX(x) {
    this._x = x;
    // we'll use margins to position the panel so it plays well with other stuff on the page.
    this.style.marginLeft = x + "px";
    return this;
  }

  setY(y) {
    this._y = y;
    this.style.marginTop = y + "px";
    return this;
  }

  //////////////////////////////////
  // Getters/Setters
  // alphabetical. getter first.
  //////////////////////////////////

  get x() {
    return this.getX();
  }
  set x(x) {
    this.setX(x);
  }

  get y() {
    return this.getY();
  }
  set y(y) {
    this.setY(y);
  }
}

customElements.define("minimal-panel", Panel);

