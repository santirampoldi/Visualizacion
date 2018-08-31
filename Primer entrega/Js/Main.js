"use strict";
var color = [0, 0, 0];
var size = 5;
var offsety = 5;
var offsetx = -5;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


paint();


function paint() {
  clear(getImgData());



  /*
  canvas.addEventListener("mousemove", function(event) {
  // var px = -1;
  // var py = -1;
  // ver grosor
    if (event.buttons == 1) {
    var x = event.layerX+offsetx;
    var y = event.layerY+offsety;
    if (px != -1) {
      ctx.stokeStyle() = rgbToHex(color[0], color[1], color[2]);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(x, y);
      ctx.stoke();
      ctx.closePath();
      px = x;
      py = y;
    }
    else {
      px = -1;
      py = -1;
    }
      ctx.fillStyle = rgbToHex(color[0], color[1], color[2]);

      ctx.fillRect(x, y, size, size);
    }
  })

*/
  /*********************************************************************************************************************************************/

  canvas.addEventListener("mousemove", function(event) {
    if (event.buttons == 1) {
      var x = event.layerX+offsetx;
      var y = event.layerY+offsety;
      ctx.fillStyle = rgbToHex(color[0], color[1], color[2]);
      ctx.fillRect(x, y, size, size);
    }
  })

  canvas.addEventListener("click", function(event) {
    var x = event.layerX+offsetx;
    var y = event.layerY+offsety;
    ctx.fillStyle = rgbToHex(color[0], color[1], color[2]);
    ctx.fillRect(x, y, size, size);
  })

  document.getElementById("borrador").addEventListener("click", function(event) {
    canvas.style.cursor = "url('img/borradorCursor.jpg'), default";
    color = [255, 255, 255];
    document.getElementById('colores').style.display = 'none';
    offsety = -5;
    size = size*2;
  });

  document.getElementById("lapiz").addEventListener("click", function(event) {
    canvas.style.cursor = "url('img/lapizCursor.jpg'), default";
    color = hexToRgb(document.getElementById('colores').value);
    document.getElementById('colores').style.display = 'block';
    offsety = 5;
    size = 5;
  });

  document.getElementById("colores").addEventListener("change", function(event) {
    color = hexToRgb(document.getElementById('colores').value);
  });

  document.getElementById("guardarImagen").addEventListener("click", function() {
    var imagen = canvas.toDataURL("image/jpg");
    this.href = imagen;
  })

  document.getElementById("reiniciar").addEventListener("click", function() {
    clear(getImgData());
  })

  /*********************************************************************************************************************************************/

  document.getElementById("ByN").addEventListener("click", function() {
    var imageData = getImgData();
    blancoYNegro(imageData);
    ctx.putImageData(imageData, 0, 0);
  })

  document.getElementById("Sepia").addEventListener("click", function() {
    var imageData = getImgData();
    sepia(imageData);
    ctx.putImageData(imageData, 0, 0);
  })

  document.getElementById("Invertir").addEventListener("click", function() {
    var imageData = getImgData();
    invertirColores(imageData);
    ctx.putImageData(imageData, 0, 0);
  })

  document.getElementById("Bin").addEventListener("click", function() {
    var imageData = getImgData();
    binarizacion(imageData, 128);
    ctx.putImageData(imageData, 0, 0);
  })

  document.getElementById("Brillo").addEventListener("click", function() {
    // var f = (e.target.attributes.id.value);
    var imageData = getImgData();
    Brillo(imageData, 50);
    ctx.putImageData(imageData, 0, 0);
  })

  /*********************************************************************************************************************************************/

}


function invertirColores(imageData) {
  for (var i = 0; i < imageData.data.length; i+=4) {
    var colores = getColors(imageData, i);
    imageData.data[i+0] = 255 - colores[0];
    imageData.data[i+1] = 255 - colores[1];
    imageData.data[i+2] = 255 - colores[2];
  }
}


function blancoYNegro(imageData) {
  getColors(imageData, 40000);
  for (var i = 0; i < imageData.data.length; i+=4) {
    var colores = getColors(imageData, i);
    var promedio = (colores[0] + colores[1] + colores[2]) / 3;
    imageData.data[i+0] = promedio;
    imageData.data[i+1] = promedio;
    imageData.data[i+2] = promedio;
  }
}

function Brillo(imageData, porcentaje) {
  for (var i = 0; i < imageData.data.length; i+=4) {
    var colores = getColors(imageData, i);
    imageData.data[i+0] += (colores[0] / 100 * porcentaje);
    imageData.data[i+1] += (colores[1] / 100 * porcentaje);
    imageData.data[i+2] += (colores[2] / 100 * porcentaje);
  }
}


function sepia(imageData) {
  for (var i = 0; i < imageData.data.length; i+=4) {
    var colores = getColors(imageData, i);
    imageData.data[i+0] = (colores[0] * .393) + (colores[1] *.769) + (colores[2] * .189);
    imageData.data[i+1] = (colores[0] * .349) + (colores[1] *.686) + (colores[2] * .168);
    imageData.data[i+2] = (colores[0] * .272) + (colores[1] *.534) + (colores[2] * .131);
  }
}


function binarizacion(imageData, criterio) {
  for (var i = 0; i < imageData.data.length; i+=4) {
    var colores = getColors(imageData, i);
    var promedio = (colores[0] + colores[1] + colores[2]) / 3;
    if (promedio <= criterio) {
      imageData.data[i+0] = 0;
      imageData.data[i+1] = 0;
      imageData.data[i+2] = 0;
    }
    else {
      imageData.data[i+0] = 255;
      imageData.data[i+1] = 255;
      imageData.data[i+2] = 255;
    }
  }
}

function clear(imageData) {
  for (var i = 0; i < imageData.data.length; i++) {
    imageData.data[i] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
}


function getColors(imageData, i) {
  return [imageData.data[i+0], imageData.data[i+1], imageData.data[i+2]];
}

function setSize(s) {size = s;}



function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}


function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}



function handleImage(event){
  clear(getImgData());
  var reader = new FileReader();
  reader.readAsDataURL(event.target.files[0]);

  reader.onload = function(event){
    var image = new Image();
    image.onload = function(){
      var x = 0;
      var y = 0;
      while (image.width > canvas.width || image.height > canvas.height) {
        image.width = image.width/1.2;
        image.height = image.height/1.2;
      }
      x = (canvas.width - image.width)/2;
      y = (canvas.height - image.height)/2;
      ctx.drawImage(image, x, y, image.width, image.height);
      var imageData = ctx.getImageData(x, y, image.width, image.height);
      ctx.putImageData(imageData, x, y);
    }
    image.src = event.target.result;
  }
}


document.getElementById('imageFileInput').addEventListener('change', function(event) {
  handleImage(event);
});

function getImgData() {
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
