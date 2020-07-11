var zipFile = new JSZip();
var totalCsvRec;

function handleFiles(files) {
  // Check for the various File API support.
  if (window.FileReader) {
    // FileReader are supported.
    getAsText(files[0]);
  } else {
    alert("FileReader are not supported in this browser!");
  }
}

function getAsText(fileToRead) {
  var reader = new FileReader();
  // Handle errors load
  reader.onload = loadHandler;
  reader.onerror = errorHandler;
  // Read file into memory as UTF-8
  reader.readAsText(fileToRead);
}

function loadHandler(event) {
  var csv = event.target.result;
  processDataAsObj(csv);
}

function processData(csv) {
  var allTextLines = csv.split(/\r\n|\n/);
  var lines = [];
  while (allTextLines.length) {
    lines.push(allTextLines.shift().split(","));
  }
  console.log(lines);
  getUserNames(lines);
}

//if csv file contains the column names as the first line
function processDataAsObj(csv) {
  var allTextLines = csv.split(/\r\n|\n/);
  var lines = [];

  //first line of csv
  var keys = allTextLines.shift().split(",");

  while (allTextLines.length) {
    var arr = allTextLines.shift().split(",");
    var obj = {};
    for (var i = 0; i < keys.length; i++) {
      obj[keys[i]] = arr[i];
    }
    lines.push(obj);
  }
  // console.log(lines);
  totalCsvRec = lines.length;
  getUserNames(lines);
}

function errorHandler(evt) {
  if (evt.target.error.name == "NotReadableError") {
    alert("Cannot read file!");
  }
}

function getUserNames(csvArr) {
  let nameIndex = '"' + $("#nameCol").val() + '"';
  csvArr.forEach(function (item, key) {
    generateCert(item[nameIndex]);
  });
}

function generateCert(userName) {
  try {
    $("#nameHolder")
      .css("border-color", "transparent")
      .text(userName.replace(/"/g, '').toUpperCase());
    $("#capture").empty();
    html2canvas(document.querySelector("#mainFrameTarget"), {scrollY: -window.scrollY}).then((canvas) => {
      document.querySelector("#capture").appendChild(canvas);
      var img = canvas.toDataURL("image/png", 1.0);
      // console.log(img);
      assignToZip(img.replace("data:image/png;base64,", ""), userName);
    });
  } catch (error) {}
}

function assignToZip(certUri, userName) {
  $.when(
    zipFile.file(userName.replace(/"/g, "") + ".png", certUri, { base64: true })
  ).done(function () {
    //check if length of zipfile objex == length of csv records
    let zipCertLenght = Object.keys(zipFile["files"]).length;
    if (zipCertLenght == totalCsvRec) {
      packageZip(zipCertLenght);
    } else {
      //bring out loader
      $("#loadingAnime").show();
      $(".notice").text(zipCertLenght + " certificate" + ((zipCertLenght > 1) ? "s" : "") + " generated . . . ");
    }
  });
}

function packageZip(zipCertLenght) {
  $(".notice").text("A total of " + zipCertLenght + " certificate" + ((zipCertLenght > 1) ? "s" : "") + " has been generated, Archive Processing has started, compressing to zip file . . . ");
  zipFile.generateAsync({ type: "base64" }).then(
    function (base64) {
      location.href = "data:application/zip;base64," + base64;
      $(".notice").text("All " + zipCertLenght + " certificate" + ((zipCertLenght > 1) ? "s" : "") + " has been archived and downloaded as a zip file . . . ");
      $("#loadingAnime").show();
    },
    function (err) {
      // jQuery("#blob").text(err);
    }
  );
}

function loadImage(imageFile) {
  if (imageFile.files && imageFile.files[0]) {
    var readImage = new FileReader();
    readImage.onload = function (e) {
      $("#baseTemplate").attr("src", e.target.result).show();
    };
    readImage.readAsDataURL(imageFile.files[0]);
  }
}

function dragNDrop() {
  //constants draggable and droppable id's
  const mainFrame = "#baseTemplate";
  const nameHolder = "#nameHolder";
  interact(nameHolder)
    .draggable({
      listeners: { move: window.dragMoveListener },
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
          let fontSize = event.rect.height / 2 + 2;
          $(nameHolder).css("font-size", Math.round(fontSize) + "px");
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
    border: "2px dotted red",
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

//char length without space * 27 = width
// $("#nameHolder").css("width", $("#nameHolder").text().replace(/\s/g, "").length * 27)
