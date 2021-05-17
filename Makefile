default:
	@cat \
	src/defaults.js \
	src/style.js \
	src/component.js \
	src/button.js \
	src/canvas.js \
	src/checkbox.js \
	src/colorpicker.js \
	src/dropdown.js \
	src/hslider.js \
	src/image.js \
	src/label.js \
	src/numericstepper.js \
	src/panel.js \
	src/progressbar.js \
	src/radiobutton.js \
	src/radiobuttongroup.js \
	src/textarea.js \
	src/textbox.js \
	src/textinput.js \
	src/vslider.js \
	> dist/temp.js

	@rollup dist/temp.js --file dist/minimalcomps.js --format iife --name mc2
	@rollup dist/temp.js --file dist/minimalcomps.mjs --format es

	@rm dist/temp.js
	@cp dist/minimalcomps.js demos/globaldemo/
	@cp dist/minimalcomps.mjs demos/moduledemo/
