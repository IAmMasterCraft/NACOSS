function dragNDrop() {
  //constants draggable and droppable id's
  const mainFrame = "#baseTemplate";
  const nameHolder = "#nameHolder";
  interact(nameHolder)
    .draggable({
      listeners: {move: window.dragMoveListener},
      inertia: true,
      restrict: "parent",
    })
    .resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      listeners: {
        move(event) {
          var target = event.target;
          var x = parseFloat(target.getAttribute("data-x")) || 0;
          var y = parseFloat(target.getAttribute("data-y")) || 0;

          // update the element's style
          target.style.width = event.rect.width + "px";
          target.style.height = event.rect.height + "px";

          // translate when resizing from top or left edges
          x += event.deltaRect.left;
          y += event.deltaRect.top;

          target.style.webkitTransform = target.style.transform =
            "translate(" + x + "px," + y + "px)";

          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
          console.log(event.rect.width);
          console.log(event.rect.height);
          let fontSize = ((event.rect.height/2)+2);
          $(nameHolder).css("font-size", Math.round(fontSize)+"px");
          //   target.textContent =
          //     Math.round(event.rect.width) +
          //     "\u00D7" +
          //     Math.round(event.rect.height);
        },
      },
      inertia: true,
      restrict: "parent",
    });
    $(nameHolder).css({
        "border": "2px dotted red",
    });
}

function dragMoveListener(event) {
  var target = event.target;
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform = target.style.transform =
    "translate(" + x + "px, " + y + "px)";

  // update the posiion attributes
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

function setColor(colorCode) {
    $("#nameHolder").css("color", colorCode);
}

$(document).ready(function () {
    window.dragMoveListener = dragMoveListener;
  dragNDrop();
});
