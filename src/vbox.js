import { Component } from "./component.js";

/**
 * A container that lays out its children in a vertical column with a set spacing between each child.
 * <div><img src="https://www.minicomps.org/images/vbox.png"/></div>
 * @example
 * const panel = new Panel(document.body, 20, 20, 200, 200);
 * const vbox = new VBox(panel, 20, 20, 10);
 * new Button(vbox, 0, 0, "Button 1");
 * new Button(vbox, 0, 0, "Button 2");
 * new Button(vbox, 0, 0, "Button 3");
 * @extends Component
 */
export class VBox extends Component {
  /**
   * Constructor
   * @param {HTMLElement} parent - The element to add this vbox to.
   * @param {number} x - The x position of the vbox. Default 0.
   * @param {number} y - The y position of the vbox. Default 0.
   * @param {number} spacing - The space to put in between each element in the box. Default 0.
   */
  constructor(parent, x, y, spacing) {
    super(parent, x, y);
    this._spacing = spacing || 0;
    this._ypos = 0;
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
   * Adds empty space into the VBox.
   * @param {number} space - The space in pixels to add.
   * @returns This instance.
   */
  addSpace(space) {
    const div = this._createDiv();
    div.x = 0;
    div.y = 0;
    div.width = 0;
    div.height = space;
    this.appendChild(div);
    return this;
  }

  /**
   * Overrides the built in appendChild method of an HTMLElement to add some very simple vertical layout to its children.
   */
  appendChild(child) {
    super.appendChild(child);
    if (this._ypos > 0) {
      this._ypos += this.spacing;
    }
    child.y = this._ypos;
    this.setWidth(Math.max(this._width, child.x + child.width));
    this._ypos += child.height;
    this.setHeight(this._ypos);
    return this;
  }

  /**
   * @returns the current spacing between elements.
   */
  getSpacing() {
    return this._spacing;
  }

  /**
   * Triggers relayout of the elements in the VBox.
   * @returns this instance.
   */
  layout() {
    let width = 0;
    this._ypos = 0;
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      if (i > 0) {
        this._ypos += this.spacing;
      }
      child.y = this._ypos;
      this._ypos += child.height;
      width = Math.max(width, child.x + child.width);
    }
    this.setWidth(width);
    this.setHeight(this._ypos);
    return this;
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
  // alphabetical. getter first.
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

customElements.define("minimal-vbox", VBox);

