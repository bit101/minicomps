import { HSlider } from "./hslider.js";
import { Style } from "./style.js";

/**
 * A vertical slider for visually selecting a numeric value. The slider can be moved by clicking and dragging, scrolling with a mouse wheel or trackpad or the use of the keyboard (arrow keys, page up/down, home/end).
 * <div><img src="https://www.minicomps.org/images/vslider.png"/></div>
 * @example
 * const panel = new Panel(document.body, 20, 20, 200, 200);
 * new VSlider(panel, 20, 20, "Volume", 50, 0, 100,  event => console.log(event.target.value));
 * @extends HSlider
 */
export class VSlider extends HSlider {
  /**
   * Constructor
   * @param {HTMLElement} parent - The element to add this slider to.
   * @param {number} x - The x position of the slider. Default 0.
   * @param {number} y - The y position of the slider. Default 0.
   * @param {string} label - The text label of the slider. Default empty string.
   * @param {number} value - The initial value of the slider. Default 0.
   * @param {number} min - The minimum value of the slider. Default 0.
   * @param {number} max - The maximum value of the slider. Default 100.
   * @param {function} defaultHandler - A function that will handle the "change" event.
   */
  constructor(parent, x, y, label, value, min, max, defaultHandler) {
    super(parent, x, y, label, value, min, max, defaultHandler);
    this.setLabelsSwapped(VSlider.labelsSwapped);
  }
  //////////////////////////////////
  // Core
  //////////////////////////////////

  _createStyle() {
    const style = document.createElement("style");
    style.textContent = Style.vslider;
    this.shadowRoot.append(style);
    this.setHandleSize(VSlider.handleSize);
  }

  //////////////////////////////////
  // Handlers
  //////////////////////////////////
  _onMouseDown(event) {
    let mouseY;
    if (event.changedTouches) {
      event.preventDefault();
      this._wrapper.focus();
      mouseY = event.changedTouches[0].clientY;
    } else {
      mouseY = event.clientY;
    }
    this._offsetY = mouseY - this.getBoundingClientRect().top - this._handle.offsetTop;
    if (this._offsetY < 0 || this._offsetY > this._handle) {
      this._offsetY = this._handle / 2;
      const y = mouseY - this.getBoundingClientRect().top - this._handle / 2;
      this._calculateValueFromPos(y);
    }
    document.addEventListener("mousemove", this._onMouseMove);
    document.addEventListener("touchmove", this._onMouseMove);
    document.addEventListener("mouseup", this._onMouseUp);
    document.addEventListener("touchend", this._onMouseUp);
  }

  _onMouseMove(event) {
    let mouseY;
    if (event.changedTouches) {
      mouseY = event.changedTouches[0].clientY;
    } else {
      mouseY = event.clientY;
    }
    const y = mouseY - this.getBoundingClientRect().top - this._offsetY;
    this._calculateValueFromPos(y);
  }

  //////////////////////////////////
  // Private
  //////////////////////////////////

  _calculateValueFromPos(y) {
    let percent = 1 - y / (this._height - this._handleSize);
    if (this._reversed) {
      percent = 1 - percent;
    }
    const value = this._min + (this._max - this._min) * percent;
    if (value !== this._value) {
      this._updateValue(value);
      this.dispatchEvent(new CustomEvent("change", { detail: this._value }));
    }
  }

  _setDefaults() {
    this._decimals = VSlider.decimals;
    this._handleSize = VSlider.handleSize;
  }

  _updateHandlePosition() {
    let percent = (this._value - this._min) / (this._max - this._min);
    if (this._reversed) {
      percent = 1 - percent;
    }
    percent = Math.max(0, percent);
    percent = Math.min(1, percent);
    this._handle.style.top = this._height - this._handleSize - percent * (this._height - this._handleSize) + "px";
  }

  _updateLabelPosition() {
    this._textLabel.x = -(this._textLabel.width - this._width) / 2;
    if (this._labelsSwapped) {
      this._textLabel.y = this._height + 5;
    } else {
      this._textLabel.y = -this._textLabel.height - 5;
    }
  }

  _updateValueLabelPosition() {
    this._valueLabel.x = -(this._valueLabel.width - this._width) / 2;
    if (this._labelsSwapped) {
      this._valueLabel.y = -this._valueLabel.height - 5;
    } else {
      this._valueLabel.y = this._height + 5;
    }
  }

  _setSliderSize() {
    this.setSize(VSlider.width, VSlider.height);
  }

  _updateValue(value) {
    super._updateValue(value);
    this._updateValueLabelPosition();
  }

  //////////////////////////////////
  // Public
  //////////////////////////////////

  /**
   * @returns the height of the handle.
   */
  getHandleSize() {
    return this._handleSize;
  }

  /**
   * @returns whether or not the labels are swapped (value on top, label on bottom).
   */
  getLabelsSwapped() {
    return this._labelsSwapped;
  }

  /**
   * Sets the height of the handle.
   * @param {number} handleSize - The height of the handle.
   */
  setHandleSize(handleSize) {
    this._handleSize = handleSize;
    this._handle.style.height = handleSize + "px";
    this._updateHandlePosition();
    return this;
  }

  setHeight(height) {
    super.setHeight(height);
    this._updateLabelPosition();
    this._updateValueLabelPosition();
    this._updateHandlePosition();
    return this;
  }

  /**
   * Sets whether the text label and value label will be swapped. If true, the text label will be on the bottom and the value label will be on the top.
   * @param {boolean} swapped - Whether the labels will be swapped.
   * @returns This instance, suitable for chaining.
   */
  setLabelsSwapped(swapped) {
    this._labelsSwapped = swapped;
    this._updateLabelPosition();
    this._updateValueLabelPosition();
    return this;
  }

  setWidth(width) {
    super.setWidth(width);
    this._updateLabelPosition();
    this._updateHandlePosition();
    return this;
  }

  //////////////////////////////////
  // Getters/Setters
  // alphabetical. getter first.
  //////////////////////////////////

  /**
   * Gets and sets the height of the draggable slider handle. If you make the slider thicker by changing its width, you may want to adjust the handle size as well. If handleSize is the same as the slider width, then the handle will be a square.
   * <div><img src="https://www.minicomps.org/images/vsliderhandlesize.png"/></div>
   */
  get handleSize() {
    return this.getHandleSize();
  }
  set handleSize(handleSize) {
    this.setHandleSize(handleSize);
  }

  /**
   * Gets and sets whether the text label and value label will be swapped. If true, the text label will be on the bottom and the value label will be on the top.
   */
  get labelsSwapped() {
    return this.getLabelsSwapped();
  }
  set labelsSwapped(swap) {
    this.setLabelsSwapped(swap);
  }
}

//////////////////////////////////
// DEFAULTS
//////////////////////////////////

/**
 * Default decimals property for all VSliders.
 */
VSlider.decimals = 0;
/**
 * Default width property for all VSliders.
 */
VSlider.width = 15;
/**
 * Default height property for all VSliders.
 */
VSlider.height = 150;
/**
 * Default handleSize property for all VSliders.
 */
VSlider.handleSize = 15;
/**
 * Default labelsSwapped property for all VSliders.
 */
VSlider.labelsSwapped = false;

customElements.define("minimal-vslider", VSlider);

