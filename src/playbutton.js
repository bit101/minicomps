import { Component } from "./component.js";
import { Style } from "./style.js";

/**
 * Creates a clickable pushbutton with play/pause icons.
 * <div><img src="https://www.minicomps.org/images/playbutton.png"/></div>
 * @example
 * const panel = new Panel(document.body, 20, 20, 200, 200);
 * new PlayButton(panel, 20, 20, false, event => console.log("playing!"));
 * @extends Component
 */
export class PlayButton extends Component {
  /**
   * Constructor
   * @param {HTMLElement} parent - The element to add this play button to.
   * @param {number} x - The x position of the play button. Default 0.
   * @param {number} y - The y position of the play button. Default 0.
   * @param {boolean} playing - Whether the play button initially shows as playing.
   * @param {function} defaultHandler - A function that will handle the "click" event.
   */
  constructor(parent, x, y, playing, defaultHandler) {
    super(parent, x, y);

    this._createChildren();
    this._createStyle();
    this._createListeners();

    this.setSize(PlayButton.width, PlayButton.height);
    this.addEventListener("click", defaultHandler);
    this.setPlaying(playing);
    this._addToParent();
  }

  //////////////////////////////////
  // Core
  //////////////////////////////////

  _createChildren() {
    this._wrapper.tabIndex = 0;
    this._setWrapperClass("MinimalPlayButton");
    this._createPlayIcon();
    this._createPauseIcon();
  }

  _createPlayIcon() {
    this._playIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this._playIcon.setAttribute("width", 12);
    this._playIcon.setAttribute("height", 12);
    this._playIcon.setAttribute("class", "MinimalPlayButtonIcon");

    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    arrow.setAttribute("points", "2, 0, 12, 6, 2, 12");
    this._playIcon.appendChild(arrow);
    this._wrapper.appendChild(this._playIcon);
  }

  _createPauseIcon() {
    this._pauseIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this._pauseIcon.setAttribute("width", 12);
    this._pauseIcon.setAttribute("height", 12);
    this._pauseIcon.setAttribute("class", "MinimalPlayButtonIcon");

    const bar1 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    bar1.setAttribute("points", "1, 0, 5, 0, 5, 12, 1, 12");
    this._pauseIcon.appendChild(bar1);

    const bar2 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    bar2.setAttribute("points", "7, 0, 11, 0, 11, 12, 7, 12");
    this._pauseIcon.appendChild(bar2);

    this._wrapper.appendChild(this._pauseIcon);
  }

  _createStyle() {
    const style = document.createElement("style");
    style.textContent = Style.playbutton;
    this.shadowRoot.append(style);
  }

  _createListeners() {
    this._onClick = this._onClick.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._wrapper.addEventListener("click", this._onClick);
    this._wrapper.addEventListener("keyup", this._onKeyUp);
  }

  //////////////////////////////////
  // Handlers
  //////////////////////////////////

  _onClick(event) {
    event.stopPropagation();
    if (this._enabled) {
      this._playing = !this._playing;
      this._updateButton();
      this.dispatchEvent(new CustomEvent("click", { detail: this._playing }));
    }
  }

  _onKeyUp(event) {
    if (event.keyCode === 13 && this._enabled) {
      this._wrapper.click();
    }
  }

  //////////////////////////////////
  // General
  //////////////////////////////////

  _updateButton() {
    if (this._playing) {
      this._playIcon.style.display = "none";
      this._pauseIcon.style.display = "block";
    } else {
      this._playIcon.style.display = "block";
      this._pauseIcon.style.display = "none";
    }
  }

  //////////////////////////////////
  // Public
  //////////////////////////////////

  /**
   * Adds a handler function for the "click" event on this button.
   * @param {function} handler - A function that will handle the "click" event.
   * @returns This instance, suitable for chaining.
   */
  addHandler(handler) {
    this.addEventListener("click", handler);
    return this;
  }

  /**
   * Automatically changes the value of a property on a target object with the main value of this component changes.
   * @param {object} target - The target object to change.
   * @param {string} prop - The string name of a property on the target object.
   * @return This instance, suitable for chaining.
   */
  bind(target, prop) {
    this.addEventListener("click", event => {
      target[prop] = event.detail;
    });
    return this;
  }

  /**
   * @returns whether the button is indicating a playing state.
   */
  getPlaying() {
    return this._playing;
  }

  setEnabled(enabled) {
    if (this._enabled === enabled) {
      return this;
    }
    super.setEnabled(enabled);
    if (this._enabled) {
      this._wrapper.setAttribute("class", "MinimalPlayButton");
      this._wrapper.tabIndex = 0;
    } else {
      this._wrapper.setAttribute("class", "MinimalPlayButtonDisabled");
      this._wrapper.tabIndex = -1;
    }
    return this;
  }

  /**
   * Sets whether or not the button shows a pause icon (playing == true) or a play icon (playing == false).
   * @param {boolean} playing - Whether or not the button relects it is in a playing state.
   * @returns This instance, suitable for chaining.
   */
  setPlaying(playing) {
    this._playing = playing;
    this._updateButton();
    return this;
  }

  //////////////////////////////////
  // Getters/Setters
  // alphabetical. getter first.
  //////////////////////////////////

  /**
   * Gets and sets whether or not the button shows a pause icon (playing == true) or a play icon (playing == false).
   */
  get playing() {
    return this.getPlaying();
  }
  set playing(playing) {
    this.setPlaying(playing);
  }
}

//////////////////////////////////
// DEFAULTS
//////////////////////////////////

/**
 * Default width of all PlayButtons.
 */
PlayButton.width = 40;
/**
 * Default height of all Playbuttons.
 */
PlayButton.height = 20;

customElements.define("minimal-playbutton", PlayButton);

