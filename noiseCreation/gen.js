import sharp from "sharp";
import fs from "fs";

const dataStore = {
  heightData: null,
  windData: null,
};

const readAsArray = async (filePath, outputPath, key) => {
  sharp(filePath)
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
      const { width, height, channels } = info;
      console.log(`Width: ${width}, Height: ${height}, Channels: ${channels}`);

      if (channels !== 1) {
        throw new Error("Image is not a grayscale image");
      }

      const dataArray = [];
      for (let y = 0; y < height; y++) {
        const row = [];
        for (let x = 0; x < width; x++) {
          row.push(data[y * width + x]);
        }
        dataArray.push(row);
      }

      const jsonData = JSON.stringify(dataArray);
      dataStore[key] = jsonData;
      console.log(dataStore[key].length);
      writeAsJson(outputPath, jsonData);
      return dataArray;
    })
    // .then(console.log(dataStore.windData))
    .catch((err) => {
      console.error("Error:", err);
    });
};

const writeAsJson = (outputPath, data) => {
  fs.writeFile(outputPath, data, (err) => {
    if (err) {
      console.error("Error writing JSON file:", err);
    } else {
      console.log(`Height data has been written to ${outputPath}`);
    }
  });
};

const generation = () => {
  if (dataStore.heightData && dataStore.windData) {
    console.log(dataStore);
    // console.log("Both data are available");
    // // 处理高度图和风速图的数据
    // console.log("Height Data:", dataStore.heightData.length);
    // console.log("Wind Data:", dataStore.windData.length);

    // // 示例：保存处理后的数据到文件
    // writeAsJson("./data/heightData.json", dataStore.heightData);
    // writeAsJson("./data/windData.json", dataStore.windData);

    // // 继续在这里添加你需要的处理逻辑
  } else {
    console.log("didt get data");
  }
};

// readAsArray("./wind.png", "./data/windData.json", "windData");
// readAsArray("./height.png", "./data/heightData.json", "heightData");

readAsArray("./png/scaled.png", "./data/scaled.json", "scaled");

// const processData = async () => {
//   await readAsArray("./height.png", "./data/heightData.json", "heightData");
//   await readAsArray("./wind.png", "./data/windData.json", "windData");
//   generation();
// };

// processData().catch((err) => {
//   console.error("Error during processing:", err);
// });

// Promise.all([
//   readAsArray("./height.png", "./data/heightData.json", "heightData"),
//   readAsArray("./wind.png", "./data/windData.json", "windData"),
// ])
//   .then(() => {
//     // generation();
//     console.log(dataStore.windData.length);
//   })
//   .catch((err) => {
//     console.error("Error during processing:", err);
//   });
