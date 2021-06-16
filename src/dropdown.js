import { Component } from "./component.js";
import { Label } from "./label.js";
import { Style } from "./style.js";

/**
 * Provides a dropdown list of items when clicked. One of those items can then be selected and be shown in the main component.
 * <div><img src="https://www.minimalcomps2.com/images/dropdown.png"/></div>
 * @example
 * const panel = new Panel(document.body, 20, 20, 200, 200);
 * const items = ["Item 1", "Item 2", "Item 3"];
 * new Dropdown(panel, 20, 20, items, 0, event => console.log(event.target.text));
 * @extends Component
 */
export class Dropdown extends Component {
  /**
   * Constructor
   * @param {HTMLElement} parent - The element to add this dropdown to.
   * @param {number} x - The x position of the dropdown. Default 0.
   * @param {number} y - The y position of the dropdown. Default 0.
   * @param {array} items - An array of strings to populate the dropdown list with. Default empty array.
   * @param {number} index - The initial selected index of the dropdown. default -1.
   * @param {function} defaultHandler - A function that will handle the "change" event.
   */
  constructor(parent, x, y, items, index, defaultHandler) {
    super(parent, x, y);
    this._items = items || [];
    this._open = false;
    this._itemElements = [];
    this._text = "";
    this._dropdownPosition = "bottom";

    this._createChildren();
    this._createStyle();
    this._createListeners();

    this.setSize(100, 20);
    this._createItems();
    this.setIndex(index);
    this._updateDropdownPosition();
    this.addEventListener("change", defaultHandler);
    this._addToParent();
  }

  //////////////////////////////////
  // Core
  //////////////////////////////////

  _createChildren() {
    this._setWrapperClass("MinimalDropdown");
    this._wrapper.tabIndex = 0;

    this._textLabel = new Label(this._wrapper, 3, 3);
    this._textLabel.autosize = false;

    this._button = this._createDiv(this._wrapper, "MinimalDropdownButton");
    this._button.textContent = "+";

    this._dropdown = this._createDiv(this._wrapper, "MinimalDropdownPanel");
  }

  _createItems() {
    for (let i = 0; i < this._items.length; i++) {
      this._createItem(i);
    }
  }

  _createItem(index) {
    const item = this._createDiv(this._dropdown, "MinimalDropdownItem");
    item.setAttribute("data-index", index);
    item.addEventListener("click", this._onItemClick);
    item.tabIndex = 0;

    const label = new Label(item, 3, 0, this._items[index]);
    label.y = (this._height - label.height) / 2;
    label.autosize = false;

    const itemObj = {item, label};
    this._updateItem(itemObj, index);
    this._itemElements.push(itemObj);
    return item;
  }

  _createStyle() {
    const style = document.createElement("style");
    style.textContent = Style.dropdown;
    this.shadowRoot.append(style);
  }

  _createListeners() {
    this._toggle = this._toggle.bind(this);
    this._onItemClick = this._onItemClick.bind(this);
    this._onKeyPress = this._onKeyPress.bind(this);

    this._wrapper.addEventListener("click", () => {
      this._toggle();
    });
    for (let i = 0; i < this._itemElements.length; i++) {
      this._itemElements[i].addEventListener("click", this._onItemClick);
    }
    this.addEventListener("keydown", this._onKeyPress);
    this.addEventListener("blur", () => this.close());
  }

  //////////////////////////////////
  // Handlers
  //////////////////////////////////

  _toggle() {
    this._open = !this._open;
    if (this._open) {
      this._initialZ = this.style.zIndex;
      this.style.zIndex = Style.popupZIndex;
      this._dropdown.style.display = "block";
    } else {
      this.style.zIndex = this._initialZ;
      this._dropdown.style.display = "none";
    }
  }

  _onItemClick(event) {
    event.stopPropagation();
    this.setIndex(event.currentTarget.getAttribute("data-index"));
    this._toggle();
    this.dispatchEvent(new CustomEvent("change", {
      detail: {
        text: this._text,
        index: this._index,
      },
    }));
    this._wrapper.focus();
  }

  _onKeyPress(event) {
    if (event.keyCode === 13 && this._enabled) {
      // enter
      this.shadowRoot.activeElement.click();
    } else if (event.keyCode === 27) {
      // escape
      this.close();
    } else if (event.keyCode === 40) {
      // down
      event.preventDefault();
      if (this.shadowRoot.activeElement === this._wrapper ||
          this.shadowRoot.activeElement === this._dropdown.lastChild) {
        this._dropdown.firstChild.focus();
      } else {
        this.shadowRoot.activeElement.nextSibling.focus();
      }
    } else if (event.keyCode === 38) {
      // up
      event.preventDefault();
      if (this.shadowRoot.activeElement === this._wrapper ||
          this.shadowRoot.activeElement === this._dropdown.firstChild) {
        this._dropdown.lastChild.focus();
      } else {
        this.shadowRoot.activeElement.previousSibling.focus();
      }
    }
  }

  //////////////////////////////////
  // Private
  //////////////////////////////////

  _updateButton() {
    this._button.style.left = this._width - this._height - 1 + "px";
    this._button.style.width = this._height + "px";
    this._button.style.height = this._height + "px";
    this._button.style.lineHeight = this._height - 1 + "px";
  }

  _updateItem(itemObj, i) {
    const { item, label } = itemObj;

    const h = this._height - 1;
    item.style.top = i * h + "px";
    item.style.width = this._width + "px";
    item.style.height = this._height + "px";
    label.y = (this._height - label.height) / 2;
    label.width = this._width - 8;
  }

  _updateDropdownPosition() {
    if (this._dropdownPosition === "bottom") {
      this._dropdown.style.top = this._height - 2 + "px";
    } else if (this._dropdownPosition === "top") {
      this._dropdown.style.top = -(this._height - 1) * this._items.length + "px";
    }
    this._dropdown.style.left = "-1px";
    this._dropdown.style.width = this._width + "px";
    this._dropdown.style.height = (this._height - 1) * this._items.length + "px";
  }

  //////////////////////////////////
  // Public
  //////////////////////////////////

  /**
   * Adds a handler function for the "change" event on this dropdown.
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
   * Programatically closes the dropdown if it is open.
   * @returns This instance, suitable for chaining.
   */
  close() {
    this._open = true;
    this._toggle();
    return this;
  }

  /**
   * @returns the position of the dropdown.
   */
  getDropDownPosition() {
    return this._dropdownPosition;
  }

  /**
   * @returns the currently selected index.
   */
  getIndex() {
    return this._index;
  }

  /**
   * @returns the text of the currently selected item in the dropdown (read only).
   */
  getText() {
    return this._text;
  }

  /**
   * Programatically opens the dropdown if it is closed.
   * @returns This instance, suitable for chaining.
   */
  open() {
    this._open = false;
    this._toggle();
    return this;
  }

  /**
   * Gets and sets the position of the dropdown list.
   * @param {string} position - The position where the list will open. Valid values are "bottom" (default) and "top".
   * @returns This instance, suitable for chaining.
   */
  setDropdownPosition(position) {
    this._dropdownPosition = position;
    this._updateDropdownPosition();
    return this;
  }

  setEnabled(enabled) {
    if (this._enabled === enabled) {
      return this this;
    }
    super.setEnabled(enabled);
    if (this._enabled) {
      this._wrapper.addEventListener("click", this._toggle);
      this._wrapper.setAttribute("class", "MinimalDropdown");
      this._button.setAttribute("class", "MinimalDropdownButton");
      this.tabIndex = 0;
    } else {
      this._wrapper.removeEventListener("click", this._toggle);
      this._wrapper.setAttribute("class", "MinimalDropdownDisabled");
      this._button.setAttribute("class", "MinimalDropdownButtonDisabled");
      this.tabIndex = -1;
      this.close();
    }
    return this;
  }

  setHeight(height) {
    super.setHeight(height);
    this._textLabel.y = (this._height - this._textLabel.height) / 2;
    this._textLabel.width = this._width - this._height;
    this._updateButton();
    this._itemElements.forEach((item, i) => this._updateItem(item, i));
    this._updateDropdownPosition();
    return this;
  }

  /**
   * Sets the selected index of this _dropdown.
   * @param {number} index - The index to set.
   * @returns This instance, suitable for chaining.
   */
  setIndex(index) {
    if (index < 0 || index >= this._items.length || index === null || index === undefined) {
      this._index = -1;
      this._text = "";
      this._textLabel.text = "Choose...";
    } else {
      this._index = index;
      this._text = this._items[this._index];
      this._textLabel.text = this._text;
    }
    return this;
  }

  setWidth(width) {
    super.setWidth(width);
    this._textLabel.width = this._width - this._height;
    this._dropdown.style.width = this._width + "px";
    this._updateButton();
    this._itemElements.forEach(item => {
      this._updateItem(item);
    });
    return this;
  }

  //////////////////////////////////
  // Getters/Setters
  // alphabetical. getter first.
  //////////////////////////////////

  /**
   * Gets and sets the position of the dropdown list. Valid values are "bottom" (default) and "top".
   */
  get dropdownPosition() {
    return this.getDropDownPosition();
  }
  set dropdownPosition(pos) {
    this.setDropdownPosition(pos);
  }

  /**
   * Reading this property tells you the index of the currently selected item. Setting it caused the new index to be selected and the dropdown to display that item.
   */
  get index() {
    return this.getIndex();
  }
  set index(index) {
    this.setIndex(index);
  }

  /**
   * Get the text of the currently selected item in the dropdown (read only).
   */
  get text() {
    return this.getText();
  }
}

customElements.define("minimal-dropdown", Dropdown);

