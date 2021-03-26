import React from "react";
import mario from "./landscape.png";
import "./styles.css";

export default function App() {
  const canvasRef = React.useRef(null);

  /**
   * Converts a given canvas into the styke of an oil painting.
   *
   * @param {*} canvas the canvas to convert
   * @param {*} radius the blur radius intensity
   * @param {*} intensity the intensity of the effect
   */
  const oilPaintEffect = (canvas, radius, intensity) => {
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext("2d");
    const imgData = ctx.getImageData(0, 0, width, height);
    const pixData = imgData.data;

    const destCanvas = document.createElement("canvas");
    const dCtx = destCanvas.getContext("2d");
    let pixelIntensityCount = [];

    destCanvas.width = width;
    destCanvas.height = height;

    const destImageData = dCtx.createImageData(width, height);
    const destPixData = destImageData.data;
    const intensityLUT = [];
    const rgbLUT = [];

    for (let y = 0; y < height; y++) {
      intensityLUT[y] = [];
      rgbLUT[y] = [];

      for (let x = 0; x < width; x++) {
        let idx = (y * width + x) * 4,
          r = pixData[idx],
          g = pixData[idx + 1],
          b = pixData[idx + 2],
          avg = (r + g + b) / 3;

        intensityLUT[y][x] = Math.round((avg * intensity) / 255);
        rgbLUT[y][x] = {
          r: r,
          g: g,
          b: b
        };
      }
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        pixelIntensityCount = [];

        for (let yy = -radius; yy <= radius; yy++) {
          for (let xx = -radius; xx <= radius; xx++) {
            if (y + yy > 0 && y + yy < height && x + xx > 0 && x + xx < width) {
              let intensityVal = intensityLUT[y + yy][x + xx];

              if (!pixelIntensityCount[intensityVal]) {
                pixelIntensityCount[intensityVal] = {
                  val: 1,
                  r: rgbLUT[y + yy][x + xx].r,
                  g: rgbLUT[y + yy][x + xx].g,
                  b: rgbLUT[y + yy][x + xx].b
                };
              } else {
                pixelIntensityCount[intensityVal].val++;
                pixelIntensityCount[intensityVal].r += rgbLUT[y + yy][x + xx].r;
                pixelIntensityCount[intensityVal].g += rgbLUT[y + yy][x + xx].g;
                pixelIntensityCount[intensityVal].b += rgbLUT[y + yy][x + xx].b;
              }
            }
          }
        }

        pixelIntensityCount.sort((a, b) => b.val - a.val);

        const curMax = pixelIntensityCount[0].val,
          dIdx = (y * width + x) * 4;

        destPixData[dIdx] = ~~(pixelIntensityCount[0].r / curMax);
        destPixData[dIdx + 1] = ~~(pixelIntensityCount[0].g / curMax);
        destPixData[dIdx + 2] = ~~(pixelIntensityCount[0].b / curMax);
        destPixData[dIdx + 3] = 255;
      }
    }

    ctx.putImageData(destImageData, 0, 0);
  };

  React.useEffect(() => {
    var canvas = canvasRef.current,
      ctx = canvas.getContext("2d"),
      img = new Image();

    img.addEventListener("load", function () {
      canvas.width = this.width;
      canvas.height = this.height;
      ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
      // oilPaintEffect(canvas, 85, 60);
      console.log();
    });

    img.crossOrigin = "Anonymous";
    img.src = mario;
  });
  return (
    <div className="App">
      <canvas ref={canvasRef} />
    </div>
  );
}
