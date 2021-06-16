import { Style } from "./style.js";

export class Component extends HTMLElement {
  constructor(parent, x, y) {
    super();
    this._parent = parent;
    this._enabled = true;

    this.attachShadow({mode: "open"});
    this._createWrapper();
    this._createWrapperStyle();

    this.move(x || 0, y || 0);
  }

  _addToParent() {
    this._parent && this._parent.appendChild(this);
  }

  //////////////////////////////////
  // Creators
  //////////////////////////////////

  _createDiv(parent, className) {
    return this._createElement(parent, "div", className);
  }

  /* eslint-disable class-methods-use-this */
  _createElement(parent, type, className) {
    const el = document.createElement(type);
    el.setAttribute("class", className);
    parent && parent.appendChild(el);
    return el;
  }
  /* eslint-enable */

  _createInput(parent, className) {
    const input = this._createElement(parent, "input", className);
    input.type = "text";
    return input;
  }

  _createWrapper() {
    this._wrapper = this._createDiv(null, "MinimalWrapper");
    this.shadowRoot.appendChild(this._wrapper);
    this.shadowRoot.appendChild(document.createElement("slot"));
  }

  _createWrapperStyle() {
    const style = document.createElement("style");
    style.textContent = Style.component;
    this.shadowRoot.append(style);
  }

  //////////////////////////////////
  // Private
  //////////////////////////////////

  _setWrapperClass(className) {
    this._wrapper.setAttribute("class", className);
  }

  //////////////////////////////////
  // Public
  //////////////////////////////////

  /**
   * Gets whether the component is enabled.
   * @returns Whether or not the component is enabled.
   */
  getEnabled() {
    return this._enabled;
  }

  /**
   * Gets the height of the component.
   * @returns The height of the component.
   */
  getHeight() {
    return this._height;
  }

  /**
   * Gets the width of the component.
   * @returns The width of the component.
   */
  getWidth() {
    return this._width;
  }

  /**
   * Gets the x position of the component.
   * @returns The x position of the component.
   */
  getX() {
    return this._x;
  }

  /**
   * Gets the y position of the component.
   * @returns The y position of the component.
   */
  getY() {
    return this._y;
  }

  /**
   * Moves the component to a specified position.
   * @param {number} x - The new x position of the component.
   * @param {number} y - The new y position of the component.
   * @returns This instance, suitable for chaining.
   */
  move(x, y) {
    this.setX(x);
    this.setY(y);
    return this;
  }

  /**
   * Rotates the component.
   * @param {number} rad - The number of radians to rotate the component by.
   * @returns This instance, suitable for chaining.
   */
  rotate(rad) {
    this.style.transform = `rotate(${rad}rad)`;
    return this;
  }

  /**
   * Rotates the component.
   * @param {number} deg - The number of degrees to rotate the component by.
   * @returns This instance, suitable for chaining.
   */
  rotateDeg(deg) {
    this.style.transform = `rotate(${deg}deg)`;
    return this;
  }

  /**
   * Sets the enabled state of this component.
   * @param {boolean} enabled - Whether or not the component will be enabled.
   * @returns This instance, suitable for chaining.
   */
  setEnabled(enabled) {
    this._enabled = enabled;
    return this;
  }

  /**
   * Sets the height of this component.
   * @param {number} height - The height of this component.
   * @returns This instance, suitable for chaining.
   */
  setHeight(h) {
    this._height = h;
    this.style.height = h + "px";
    return this;
  }

  /**
   * Sizes the component.
   * @param {number} w - The new width of the component.
   * @param {number} h - The new height of the component.
   * @returns This instance, suitable for chaining.
   */
  setSize(w, h) {
    this.setWidth(w);
    this.setHeight(h);
    return this;
  }

  /**
   * Sets the width of this component.
   * @param {number} width - The width of this component.
   * @returns This instance, suitable for chaining.
   */
  setWidth(w) {
    this._width = w;
    this.style.width = w + "px";
    return this;
  }

  /**
   * Sets the x position of this component.
   * @param {number} x - The x position of this component.
   * @returns This instance, suitable for chaining.
   */
  setX(x) {
    this._x = x;
    this.style.left = x + "px";
    return this;
  }

  /**
   * Sets the y position of this component.
   * @param {number} y - The y position of this component.
   * @returns this instance, suitable for chaining.
   */
  setY(y) {
    this._y = y;
    this.style.top = y + "px";
    return this;
  }

  //////////////////////////////////
  // Getters/Setters
  // alphabetical. getter first.
  //////////////////////////////////

  /**
   * Sets and gets whether or not this component is enabled. Non-enabled components will be faded out and not respond to events.
   */
  get enabled() {
    return this.getEnabled();
  }
  set enabled(enabled) {
    this.setEnabled(enabled);
  }

  /**
   * Sets and gets the height of this component.
   */
  get height() {
    return this.getHeight();
  }
  set height(h) {
    this.setHeight(h);
  }

  /**
   * Sets and gets the width of this component.
   */
  get width() {
    return this.getWidth();
  }
  set width(w) {
    this.setWidth(w);
  }

  /**
   * Sets and gets the x position of this component.
   */
  get x() {
    return this.getX();
  }
  set x(x) {
    this.setX(x);
  }

  /**
   * Sets and gets the y position of this component.
   */
  get y() {
    return this.getY();
  }
  set y(y) {
    this.setY(y);
  }
}

customElements.define("minimal-component", Component);

