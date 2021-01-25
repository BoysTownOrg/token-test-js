function addClickEventListener(button, f) {
  button.addEventListener("click", f);
}

function element() {
  return document.createElement("div");
}

function pixelsString(a) {
  return `${a}px`;
}

function circleElementWithColor(color) {
  const circle = element();
  const diameterPixels = 100;
  circle.style.height = pixelsString(diameterPixels);
  circle.style.width = pixelsString(diameterPixels);
  circle.style.borderRadius = pixelsString(diameterPixels / 2);
  circle.style.margin = "auto";
  circle.style.backgroundColor = color;
  return circle;
}

function squareElementWithColor(color) {
  const square = element();
  const widthPixels = 100;
  square.style.height = pixelsString(widthPixels);
  square.style.width = pixelsString(widthPixels);
  square.style.margin = "auto";
  square.style.backgroundColor = color;
  return square;
}

function adopt(parent, child) {
  parent.append(child);
}

function clear(parent) {
  // https://stackoverflow.com/a/3955238
  while (parent.firstChild) {
    parent.removeChild(parent.lastChild);
  }
}

// https://stackoverflow.com/a/28191966
function getKeyByValue(map, value) {
  return Array.from(map.keys()).find((key) => map.get(key) === value);
}

class TokenControl {
  constructor(parent) {
    this.parent = parent;
    const grid = element();
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(5, 1fr)";
    grid.style.gridTemplateRows = "repeat(2, 1fr)";
    this.redSquare = squareElementWithColor("red");
    adopt(parent, grid);
    this.redSquare.style.gridRow = 1;
    this.redSquare.style.gridColumn = 2;
    adopt(grid, this.redSquare);
    addClickEventListener(this.redSquare, (e) => {
      this.observer.notifyThatRedSquareHasBeenClicked();
    });
  }

  attach(observer) {
    this.observer = observer;
  }

  showDoneButton() {
    this.doneButton.style.visibility = "visible";
  }
}

export function plugin() {
  return {
    trial(display_element, trial) {
      clear(display_element);
      const control = new TokenControl(display_element);
    },
    info: {
      parameters: {},
    },
  };
}
