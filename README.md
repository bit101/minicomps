# MiniComps

A Web UI tookkit for creating rapid prototypes, experiments and proof of concept projects.

##

The site: [https://www.minicomps.org/](https://www.minicomps.org/)

Full [documentation](https://www.minicomps.com/org) and [live demos](https://www.minicomps.org/demos).

## Summary

A single-file, drop-in library allowing you to create a quick user interface for experiments or quick ideas.

The aim is for very concise, compact syntax. You can usually create a component, position it, configure it and create and event handler in a single line of code. 

## Example

```
const panel = new Panel(document.body, 40, 40, 200, 200);
new Button(panel, 20, 20, "Click me", () => label.text = input.text);
const input = new TextInput(panel, 20, 50, "hello world");
const label = new Label(panel, 20, 80, "target label");
```

The general API for each component is 

```new ComponentName(parent, x, y, <possible other params>, defaultEventHandler);```

Full documentation here: https://www.minicomps.org/documentation/index.html

No need to worry about styles or layout. Just give everything a parent, a position, a prop or two and maybe an event handler.

