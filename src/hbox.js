import { Component } from "./component.js";

/**
 * A container that lays out its children in a horizontal row with a set spacing between each child.
 * <div><img src="https://www.minicomps.org/images/hbox.png"/></div>
 * @example
 * const panel = new Panel(document.body, 20, 20, 400, 200);
 * const hbox = new HBox(panel, 20, 20, 10);
 * new Button(hbox, 0, 0, "Button 1");
 * new Button(hbox, 0, 0, "Button 2");
 * new Button(hbox, 0, 0, "Button 3");
 * @extends Component
 */
export class HBox extends Component {
  /**
   * Constructor
   * @param {HTMLElement} parent - The element to add this hbox to.
   * @param {number} x - The x position of the hbox. Default 0.
   * @param {number} y - The y position of the hbox. Default 0.
   * @param {number} spacing - The space to put in between each element in the box. Default 0.
   */
  constructor(parent, x, y, spacing) {
    super(parent, x, y);
    this._spacing = spacing || 0;
    this._xpos = 0;
    this._createChildren();
    this.setSize(0, 0);
    this._addToParent();
  }

  //////////////////////////////////
  // Core
  //////////////////////////////////

  _createChildren() {
    this._setWrapperClass("MinimalVbox");
  }

  //////////////////////////////////
  // Public
  //////////////////////////////////

  /**
   * Overrides the built in appendChild method of an HTMLElement to add some very simple horizontal layout to its children.
   */
  appendChild(child) {
    super.appendChild(child);
    if (this._xpos > 0) {
      this._xpos += this._spacing;
    }
    child.x = this._xpos;
    this.setHeight(Math.max(this._height, child.y + child.height));
    this._xpos += child.width;
    this.setWidth(this._xpos);
  }

  /**
   * @returns the spacing between items in this box. Setting this value will not change the layout of existing elements, but will affect the spacing of future elements added.
   */
  getSpacing() {
    return this._spacing;
  }

  /**
   * Sets the spacing between items in this box. Setting this value will not change the layout of existing elements, but will affect the spacing of future elements added.
   * @param {number} spacing - How much spacing to put between each element.
   * @returns This instance, suitable for chaining.
   */
  setSpacing(spacing) {
    this._spacing = spacing;
    return this;
  }

  //////////////////////////////////
  // Getters/Setters
  //////////////////////////////////

  /**
   * Gets and sets the spacing between items in this box. Setting this value will not change the layout of existing elements, but will affect the spacing of future elements added.
   */
  get spacing() {
    return this.getSpacing();
  }
  set spacing(spacing) {
    this.setSpacing(spacing);
  }
}

customElements.define("minimal-hbox", HBox);

