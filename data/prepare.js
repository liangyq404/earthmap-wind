const PNG = require("pngjs").PNG;
const fs = require("fs");
const { umask } = require("process");

const data = JSON.parse(fs.readFileSync("tmp25.json"));
// const name = process.argv[2];
const name = "test";
// const uData = data.u.messages[0];
// const vData = data.v.messages[0];

// const uValues = uData.find((item) => item.key === "values").value;
// const vValues = vData.find((item) => item.key === "values").value;

// const uMax = uData.find((item) => item.key === "maximum").value;
// const uMin = uData.find((item) => item.key === "minimum").value;

// const vMax = vData.find((item) => item.key === "maximum").value;
// const vMin = vData.find((item) => item.key === "minimum").value;

// uMax, uMin, vMax, vMin
// 28.6884 -19.7116 20.2977 -21.4023

const newData = JSON.parse(fs.readFileSync("guangling.json"));
const uData = newData[0].data;
const uMin = Math.min(...uData);
const uMax = Math.max(...uData);

const vData = newData[1].data;
const vMin = Math.min(...vData);
const vMax = Math.max(...vData);

console.log(uData.length, vData.length);

// console.log(uMax, uMin, vMax, vMin);
// 8.77 -0.85 8.77 -0.85

// const width = u.Ni;
// const height = u.Nj - 1;
// 以前出的图是 1440:720, 1440*721 = 1038240 即data中values的个数
// 现在要出的图是正方形的，30:30

// console.log(uValues, vValues);
// console.log(uMax, uMin, vMax, vMin);

const width = newData[0].header.nx; // 60
const height = newData[0].header.ny; // 30

console.log(width, height);

const png = new PNG({
  colorType: 2,
  filterType: 4,
  width: width,
  height: height,
});

// console.log(png.data.length);
// png.data.length = 60 * 30 * 4 = 7200, 4 -> RGBA channels

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const pixelIndex = (y * width + x) * 4;
    const k = y * width + x;
    console.log(
      Math.floor((255 * (uData[k] - uMin)) / (uMax - uMin)),
      Math.floor((255 * (vData[k] - vMin)) / (vMax - vMin))
    );
    png.data[pixelIndex] = Math.floor(
      (255 * (uData[k] - uMin)) / (uMax - uMin)
    );
    png.data[pixelIndex + 1] = Math.floor(
      (255 * (vData[k] - vMin)) / (vMax - vMin)
    );

    png.data[pixelIndex + 2] = 0; // B
    png.data[pixelIndex + 3] = 255; // A
  }
}

// console.log(
//   Math.floor((255 * (uData[k] - uMin)) / (uMax - uMin)),
//   Math.floor((255 * (vData[k] - vMin)) / (vMax - vMin))
// );

// console.log(png.data);
// for (let y = 0; y < height; y++) {
//   for (let x = 0; x < width; x++) {
//     const i = (y * width + x) * 4;
//     const k = y * width + ((x + width / 2) % width);
//     png.data[i + 0] = Math.floor(
//       (255 * (u.values[k] - u.minimum)) / (u.maximum - u.minimum)
//     );
//     png.data[i + 1] = Math.floor(
//       (255 * (v.values[k] - v.minimum)) / (v.maximum - v.minimum)
//     );
//     png.data[i + 2] = 0;
//     png.data[i + 3] = 255;
//   }
// }

png.pack().pipe(fs.createWriteStream(name + ".png"));

// png.pack().on("finish", () => {
//   png.pack().pipe(fs.createWriteStream(name + ".png"));
// });

fs.writeFileSync(
  name + ".json",
  JSON.stringify(
    {
      source: "envision greenwich",
      date: "today",
      width: width,
      height: height,
      uMin: uMin,
      uMax: uMax,
      vMin: vMin,
      vMax: vMax,
    },
    null,
    2
  ) + "\n"
);

// function formatDate(date, time) {
//   return (
//     date.substr(0, 4) +
//     "-" +
//     date.substr(4, 2) +
//     "-" +
//     date.substr(6, 2) +
//     "T" +
//     (time < 10 ? "0" + time : time) +
//     ":00Z"
//   );
// }
