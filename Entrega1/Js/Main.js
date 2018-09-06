var color = [0, 0, 0];
var px = -1;
var size = 1;
var offsety = 0;
var esBrillo = false;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var imageDataOriginal;

paint();


function paint() {
  clear(getImgData());
  assignButtons();

  /*********************************************************************************************************************************************/

  canvas.addEventListener("mousemove", function(event) {
    if (event.buttons != 1) {
      px = -1;
      py = -1;
    }
    else {
      ctx.lineWidth = size;
      var x = event.offsetX;
      var y = event.offsetY+offsety;

      if (px != -1) {
        ctx.lineCap = "round";
        ctx.strokeStyle = rgbToHex(color[0], color[1], color[2]);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();
      }
      px = x;
      py = y;

    }

  })

  canvas.addEventListener("mouseup", function functionName() {
    guardarCambios();
  })

  document.getElementById("borrador").addEventListener("click", function(event) {
    canvas.style.cursor = "url('Img/borradorcursor.jpg'), default";
    color = [255, 255, 255];
    document.getElementById('coloresContainer').style.display = 'none';
    offsety = 30;
  });
  
  document.getElementById("lapiz").addEventListener("click", function(event) {
    canvas.style.cursor = "url('Img/lapizcursor1.png'), default";
    ctx.lineCap = "round";
    color = hexToRgb(document.getElementById('colores').value);
    document.getElementById('coloresContainer').style.display = 'block';
    offsety = 0;
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

  document.getElementById('imageFileInput').addEventListener('change', function(event) {
    handleImage(event);
  });

  /*********************************************************************************************************************************************/

  setEvento('ByN','click',blancoYNegro);

  setEvento('Sepia','click',sepia);

  setEvento('Invertir','click',invertirColores);

  document.getElementById("Bordes").addEventListener("click", function() {
    var imageData = getImgData();
    bordes(imageData);
  })

  document.getElementById("Sharpen").addEventListener("click", function() {
    var imageData = getImgData();
    sharpen(imageData);
  })

  document.getElementById("Blur").addEventListener("click", function() {
    var imageData = getImgData();
    blur(imageData, 1);
  })

  document.getElementById("Saturacion").addEventListener("click", function() {
    var imageData = getImgData();
    saturacion(imageData, 5);
    ctx.putImageData(imageData, 0, 0);
  })

  document.getElementById("Bin").addEventListener("click", function() {
    var imageData = getImgData();
    binarizacion(imageData, 128);
    ctx.putImageData(imageData, 0, 0);
  })

  document.getElementById("Brillo").addEventListener("mousemove", function(event) {
    if (esBrillo) {
      var imageData = getImgData();
      var value = event.target.value;
      brillo(imageData, value);
      ctx.putImageData(imageData, 0, 0);
    }
  })

  document.getElementById("Brillo").addEventListener("mousedown", function(event) {
    esBrillo = true;
  })

  document.getElementById("Brillo").addEventListener("mouseup", function(event) {
    esBrillo = false;
  })

  function setEvento(eventoID, listener, callback) {
    document.getElementById(eventoID).addEventListener(listener, function() {
      var imageData = getImgData();
      callback(imageData);
      ctx.putImageData(imageData, 0, 0);
      guardarCambios();
    });
  }

  /*********************************************************************************************************************************************/

}

function guardarCambios() {
  imageDataOriginal = getImgData();
}

function sharpen(imageData) {
  var M = [[0,   -0.25,   0],
  /*******/[-0.25,  2  , -0.25],
  /*******/[0,   -0.25,   0]];

  var dimension = 1*2 + 1;

  var imagen = convolute(imageData, M);
  ctx.putImageData(imagen, 0, 0);
}

function bordes(imageData) {

  var M = [[-1,-1,-1],
  /*******/[-1, 8,-1],
  /*******/[-1,-1,-1]];

  var dimension = 1*2 + 1;

  imageData = blancoYNegro(imageData);

  var imagen = convolute(imageData, M);
  ctx.putImageData(imagen, 0, 0);
}

function blur(imageData, radio) {

  var M = [];
  var dimension = radio*2 + 1;
  var vol = dimension*dimension;

  for (var i = 0; i < dimension; i++) {
    M[i] = [];
    for (var j = 0; j < dimension; j++) {
      M[i][j] = 1/vol;
    }
  }

  var imagen = convolute(imageData, M);
  ctx.putImageData(imagen, 0, 0);
}

function convolute(imageData, mascara) {
  //mascara es la matriz de convolusion
  var dimension = mascara.length;
  var radio = Math.floor(dimension/2);
  var src = imageData.data;
  var w = imageData.width;
  var h = imageData.height;
  var retorno = ctx.createImageData(w, h);
  var dst = retorno.data;

  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var dstOff = (y * w + x)*4;
      var acumR = 0, acumG = 0, acumB = 0;

      for (var cy = 0; cy < dimension; cy++) {
        for (var cx = 0; cx < dimension; cx++) {
          var sy = y + cy - radio;
          var sx = x + cx - radio;
          if (sy >= 0 && sy < h && sx >= 0 && sx < w) {
            var srcOff = (sy * w + sx)*4;
            var wt = mascara[cy][cx];
            acumR += src[srcOff] * wt;
            acumG += src[srcOff+1] * wt;
            acumB += src[srcOff+2] * wt;
          }
        }
      }
      dst[dstOff] = acumR;
      dst[dstOff+1] = acumG;
      dst[dstOff+2] = acumB;
      dst[dstOff+3] = 255;
    }
  }
  return retorno;
};

function saturacion(imageData, factorS) {

  for (var i = 0; i < imageData.data.length; i+=4) {
    var colores = getColors(imageData, i);
    var R = colores[0] / 255;
    var G = colores[1] / 255;
    var B = colores[2] / 255;

    var min = getMinimo(R,G,B);
    var max = getMaximo(R,G,B);
    var luminance = (min + max) / 2;

    if (min == max) {           //Si el minimo y el maximo son iguales, el color esta en la escala de grises y la saturacion es 0.
      R = luminance * 255;
      G = luminance * 255;
      B = luminance * 255;
    }
    else {
      if (luminance < 0.5) {
        var saturation = (max-min)/(max+min);
      }
      else {
        var saturation = (max-min)/(2.0-max-min);
      }

      if (max == R) {
        var hue = (G-B)/(max-min);              //Segun que factor sea dominante el hue se calcula distinto.
      }
      else if (max == G) {
        var hue = 2.0 + (B-R)/(max-min);
      }
      else {
        var hue = 4.0 + (R-G)/(max-min);
      }

      hue = Math.floor(hue * 60);
      if (hue < 0) {hue +=360;}               //Si el hue es menor a 0, le sumo 360, ya que representa grados que deben estar entre 0 y 360.

      if (saturation < (1 - factorS/100)) {   //Controlo no pasarme de 100% de saturacion y la modifico.
        saturation += factorS/100;
      }

      if (luminance < 0.5) {
        var temp_1 = luminance * (1.0 + saturation);
      }
      else {
        var temp_1 = luminance + saturation - luminance * saturation;
      }

      var temp_2 = 2 * luminance - temp_1;

      hue = hue / 360;

      var temp_R = hue + 0.333;
      var temp_G = hue;
      var temp_B = hue - 0.333;

      if (temp_R < 0) {temp_R += 1;}         //Si un factor queda negativo le sumo 1.
      else if (temp_R > 1) {temp_R -= 1;}

      if (temp_G < 0) {temp_G += 1;}
      else if (temp_G > 1) {temp_G -= 1;}

      if (temp_B < 0) {temp_R += 1;}
      else if (temp_B > 1) {temp_R -= 1;}

      R = Math.round(255 * evaluar(temp_R, temp_1, temp_2));
      G = Math.round(255 * evaluar(temp_G, temp_1, temp_2));
      B = Math.round(255 * evaluar(temp_B, temp_1, temp_2));
    }

    imageData.data[i+0] = R;
    imageData.data[i+1] = G;
    imageData.data[i+2] = B;
  }
}

function evaluar(temp_C, temp_1, temp_2) {
  if (6 * temp_C < 1) {
    return temp_2 + (temp_1 - temp_2) * 6 * temp_C;
  }
  else if (2 * temp_C < 1) {
    return temp_1;
  }
  else if (3 * temp_C < 2){
    return temp_2 + (temp_1 - temp_2) * (0.666 - temp_C) * 6;
  }
  else {
    return temp_2;
  }
}

function getMinimo(R,G,B) {
  if (R < G && R < B) {return R;}
  else if (G < R && G < B) {return G;}
  else {return B;}
}

function getMaximo(R,G,B) {
  if (R > G && R > B) {return R;}
  else if (G > R && G > B) {return G;}
  else {return B;}
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
  return imageData;
}

function brillo(imageData, cambio) {
  for (var i = 0; i < imageData.data.length; i+=4) {
    var colores = getColors(imageDataOriginal, i);
    imageData.data[i+0] = (colores[0] + parseInt(cambio));
    imageData.data[i+1] = (colores[1] + parseInt(cambio));
    imageData.data[i+2] = (colores[2] + parseInt(cambio));
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
    var assign;
    if (promedio <= criterio) {
      assign = 0;
    }
    else {
      assign = 255;
    }
    imageData.data[i+0] = assign;
    imageData.data[i+1] = assign;
    imageData.data[i+2] = assign;
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

function assignButtons() {
  var btnContainer = document.getElementById("btn-container");
  var buttons = btnContainer.getElementsByClassName("btn");

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function() {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
    });
  }
}

function hexToRgb(hex) {
  return [parseInt(hex.slice(1,3), 16), parseInt(hex.slice(3,5), 16), parseInt(hex.slice(5,7), 16)];
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
      guardarCambios();
    }
    image.src = event.target.result;
  }
}

function getImgData() {
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
