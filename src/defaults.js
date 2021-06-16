/**
 * Defaults contains default properties for different components.
 */
export const Defaults = {
  /**
   * Default properties for the Button component.
   * @typedef {object} button
   * @property {number} width - The default width of a Button.
   * @property {number} height - The default height of a Button.
   */
  button: {
    width: 100,
    height: 20,
  },
  /**
   * Default properties for the ColorPicker component.
   * @typedef {object} colorpicker
   * @property {string} labelPosition - The default labelPosition of a ColorPicker.
   */
  colorpicker: {
    labelPosition: "top",
  },
  /**
   * Default properties for the HSlider component.
   * @typedef {object} hslider
   * @property {number} decimals - The default decimals of a HSlider.
   * @property {string} labelPosition - The default labelPosition of a HSlider.
   * @property {string} valuePosition - The default valuePosition of a HSlider.
   * @property {number} width - The default width of a HSlider.
   * @property {number} height - The default height of a HSlider.
   * @property {number} handleSize - The default handleSize of a HSlider.
   */
  hslider: {
    decimals: 0,
    labelPosition: "top",
    valuePosition: "top",
    width: 150,
    height: 15,
    handleSize: 15,
  },
  /**
   * Default properties for the Image component.
   * @typedef {object} image
   * @property {number} width - The default width of a Image.
   */
  image: {
    width: 100,
  },
  /**
   * Default properties for the Knob component.
   * @typedef {object} knob
   * @property {number} decimals - The default decimals of a Knob.
   * @property {number} size - The default size of a Knob.
   */
  knob: {
    decimals: 0,
    size: 40,
  },
  /**
   * Default properties for the LED component.
   * @typedef {object} led
   * @property {stirng} labelPosition - The default labelPosition of a LED.
   */
  led: {
    labelPosition: "top",
  },
  /**
   * Default properties for the Label component.
   * @typedef {object} label
   * @property {number} fontSize - The default fontSize of a Label.
   */
  label: {
    fontSize: 10,
  },
  /**
   * Default properties for the NumericStepper component.
   * @typedef {object} numericstepper
   * @property {number} decimals - The default decimals of a NumericStepper.
   * @property {string} labelPosition - The default labelPosition of a NumericStepper.
   * @property {number} width - The default width of a NumericStepper.
   */
  numericstepper: {
    decimals: 0,
    labelPosition: "top",
    width: 100,
  },
  /**
   * Default properties for the Toggle component.
   * @typedef {object} toggle
   * @property {string} labelPosition - The default labelPosition of a Toggle.
   */
  toggle: {
    labelPosition: "top",
  },
  /**
   * Default properties for the VSlider component.
   * @typedef {object} vslider
   * @property {number} decimals - The default decimals of a VSlider.
   * @property {string} labelPosition - The default labelPosition of a VSlider.
   * @property {number} width - The default width of a VSlider.
   * @property {number} height - The default height of a VSlider.
   * @property {number} handleSize - The default handleSize of a VSlider.
   */
  vslider: {
    decimals: 0,
    width: 15,
    height: 150,
    handleSize: 15,
  },
};
