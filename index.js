const fs = require("fs");
const path = require("path");
const apng2gif = require("apng2gif");

function convertApngToGif(filePath, outputDirectoryPath) {
  try {
    const fileName = path.basename(filePath, ".png");
    const gifPath = path.join(outputDirectoryPath, `${fileName}.gif`);
    apng2gif.sync(filePath, gifPath);
    console.log(`Converted ${filePath} to ${gifPath}`);

    // 处理转换后的GIF文件
    const modifiedData = unlimitedGifRepetitions(gifPath);
    fs.writeFileSync(gifPath, modifiedData);
    console.log(`Modified ${gifPath}`);
  } catch (error) {
    console.error(`Error converting ${filePath} to GIF:`, error);
  }
}

function unlimitedGifRepetitions(path) {
  const data = fs.readFileSync(path);

  const index = data.indexOf(Buffer.from([0x21, 0xff, 0x0b]));
  if (index < 0) {
    throw new Error(`Cannot find Gif Application Extension in ${path}`);
  }

  data[index + 16] = 255;
  data[index + 17] = 255;

  return data;
}

function batchModifyGifFilesInDirectory(directoryPath, outputDirectoryPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    // 创建 outputDirectoryPath 目录
    if (!fs.existsSync(outputDirectoryPath)) {
      fs.mkdirSync(outputDirectoryPath);
      console.log(`Created directory: ${outputDirectoryPath}`);
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      const fileExtension = path.extname(file);

      if (fileExtension === ".gif") {
        try {
          const modifiedData = unlimitedGifRepetitions(filePath);
          fs.writeFileSync(filePath, modifiedData);
          console.log(`Modified ${file}`);
        } catch (error) {
          console.error(`Error modifying ${file}:`, error);
        }
      }

      if (fileExtension === ".png") {
        convertApngToGif(filePath, outputDirectoryPath);
      }
    });
  });
}

const directoryPath = "./origin";
const outputDirectoryPath = "./output";
batchModifyGifFilesInDirectory(directoryPath, outputDirectoryPath);