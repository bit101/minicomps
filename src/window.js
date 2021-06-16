import { Component } from "./component.js";
import { Label } from "./label.js";
import { Style } from "./style.js";

/**
 * Creates a draggable, collapsible window to be used as a parent for other components.
 * <div><img src="https://www.minicomps.org/images/window.png"/></div>
 * @example
 * const win = new Window(document.body, 20, 20, 200, 200);
 * new Button(win, 20, 20, "Click");
 * @extends Component
 */
export class Window extends Component {
  /**
   * Constructor
   * @param {HTMLElement} parent - The element to add this window to.
   * @param {number} x - The x position of the window. Default 0.
   * @param {number} y - The y position of the window. Default 0.
   * @param {number} w - The width of the window. Default 400.
   * @param {number} h - The height of the window. Default 400.
   * @param {number} label - The label to put in the title bar. Default 0.
   */
  constructor(parent, x, y, w, h, label) {
    super(parent, x, y);
    w = w || 400;
    h = h || 400;
    this._label = label;
    this._draggable = true;
    this._minimizable = true;
    this._minimized = false;

    this._createChildren();
    this._createStyle();
    this._createListeners();

    this.setSize(w, h);
    this._addToParent();
  }

  //////////////////////////////////
  // Core
  //////////////////////////////////

  _createChildren() {
    this._setWrapperClass("MinimalWindow");
    this._titleBar = this._createDiv(this._wrapper, "MinimalWindowTitleBar");
    this._textLabel = new Label(this._titleBar, 5, 0, this._label);
    this._textLabel.height = 30;
    this._button = this._createDiv(this._titleBar, "MinimalWindowButton");
    this._content = this._createDiv(this._wrapper, "MinimalWindowContent");
    this._content.appendChild(document.createElement("slot"));
  }

  _createStyle() {
    const style = document.createElement("style");
    style.textContent = Style.window;
    this.shadowRoot.append(style);
  }

  _createWrapper() {
    this._wrapper = this._createDiv(null, "MinimalWrapper");
    this.shadowRoot.appendChild(this._wrapper);
  }

  _createListeners() {
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMinimize = this._onMinimize.bind(this);
    this._titleBar.addEventListener("mousedown", this._onMouseDown);
    this._titleBar.addEventListener("touchstart", this._onMouseDown);
    this._button.addEventListener("click", this._onMinimize);
  }

  //////////////////////////////////
  // Handlers
  //////////////////////////////////

  _onMouseDown(event) {
    this.style.zIndex = Style.windowIndex++;
    let mouseX;
    let mouseY;
    if (event.changedTouches) {
      event.preventDefault();
      mouseX = event.changedTouches[0].clientX;
      mouseY = event.changedTouches[0].clientY;
    } else {
      mouseX = event.clientX;
      mouseY = event.clientY;
    }
    this._offsetX = mouseX - this.getBoundingClientRect().left;
    this._offsetY = mouseY - this.getBoundingClientRect().top;
    document.addEventListener("mousemove", this._onMouseMove);
    document.addEventListener("touchmove", this._onMouseMove);
    document.addEventListener("mouseup", this._onMouseUp);
    document.addEventListener("touchend", this._onMouseUp);
  }

  _onMouseMove(event) {
    let mouseX;
    let mouseY;
    if (event.changedTouches) {
      mouseX = event.changedTouches[0].clientX;
      mouseY = event.changedTouches[0].clientY;
    } else {
      mouseX = event.clientX;
      mouseY = event.clientY;
    }
    const x = mouseX - this.offsetParent.getBoundingClientRect().left - this._offsetX;
    const y = mouseY - this.offsetParent.getBoundingClientRect().top - this._offsetY;
    this.move(x, y);
  }

  _onMouseUp() {
    document.removeEventListener("mousemove", this._onMouseMove);
    document.removeEventListener("touchmove", this._onMouseMove);
    document.removeEventListener("mouseup", this._onMouseUp);
    document.removeEventListener("touchend", this._onMouseUp);
  }

  _onMinimize() {
    this._minimized = !this._minimized;
    if (this._minimized) {
      super.setHeight(30);
    } else {
      super.setHeight(this._openHeight);
    }
  }

  //////////////////////////////////
  // Public
  //////////////////////////////////

  getDraggable() {
    return this._draggable;
  }

  getMinimizable() {
    return this._minimizable;
  }

  getLabel() {
    return this._label;
  }

  /**
   * Sets whether or not this window can be dragged by its title bar.
   * @param {boolean} draggable - Whether this window can be dragged.
   * @returns This instance, suitable for chaining.
   */
  setDraggable(draggable) {
    if (this._draggable !== draggable) {
      this._draggable = draggable;
      if (draggable) {
        this._titleBar.style.cursor = "pointer";
        this._titleBar.addEventListener("mousedown", this._onMouseDown);
        this._titleBar.addEventListener("touchstart", this._onMouseDown);
      } else {
        this._titleBar.style.cursor = "default";
        this._titleBar.removeEventListener("mousedown", this._onMouseDown);
        this._titleBar.removeEventListener("touchstart", this._onMouseDown);
      }
    }
    return this;
  }

  setEnabled(enabled) {
    if (this._enabled === enabled) {
      return this;
    }
    super.setEnabled(enabled);
    if (this._enabled) {
      this._minimized = true;
      this._onMinimize();
      this.setMinimizable(this._enabledMinimizable);
      this.setDraggable(this._enabledDraggable);
      this._wrapper.setAttribute("class", "MinimalWindow");
    } else {
      this._minimized = false;
      this._onMinimize();
      this._enabledMinimizable = this._minimizable;
      this._enabledDraggable = this._draggable;
      this.setMinimizable(false);
      this.setDraggable(false);
      this._wrapper.setAttribute("class", "MinimalWindowDisabled");
    }
    return this;
  }

  setHeight(height) {
    super.setHeight(height);
    this._openHeight = height;
    this._content.style.height = (height - 30) + "px";
    return this;
  }

  /**
   * Sets the test shown in this window's title bar.
   * @param {string} label - The label in the title bar.
   * @returns This instance, suitable for chaining.
   */
  setLabel(label) {
    this._label = label;
    this._textLabel.text = label;
    return this;
  }

  /**
   * Sets whether or not this window can be minimized.
   * @param {boolean} minimizable - Whether this window can be minimized.
   * @returns This instance, suitable for chaining.
   */
  setMinimizable(minimizable) {
    this._minimizable = minimizable;

    if (minimizable) {
      this._button.style.visibility = "visible";
    } else {
      this._button.style.visibility = "hidden";
    }
    return this;
  }

  setWidth(width) {
    super.setWidth(width);
    this._titleBar.style.width = width + "px";
    this._content.style.width = width + "px";
    return this;
  }

  //////////////////////////////////
  // Getters and Setters
  //////////////////////////////////

  /**
   * Gets and sets whether the window can be dragged by its title bar.
   */
  get draggable() {
    return this.getDraggable();
  }
  set draggable(draggable) {
    this.setDraggable(draggable);
  }

  /**
   * Sets and gets the label shown in the window's title bar.
   */
  get label() {
    return this.getLabel();
  }
  set label(label) {
    this.setLabel(label);
  }

  /**
   * Gets and sets whether the window has a minimize button.
   */
  get minimizable() {
    return this.getMinimizable();
  }
  set minimizable(minimizable) {
    this.setMinimizable(minimizable);
  }
}

customElements.define("minimal-window", Window);

