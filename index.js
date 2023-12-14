const fs = require("fs");
const path = require("path");
const apng2gif = require("apng2gif");
const request = require("request");

function download(zipUrl, savePath) {
	// 创建代理请求选项
	const requestOptions = {
		url: zipUrl,
		proxy: "http://localhost:7890",
	};

	// 返回一个Promise以处理异步操作
	return new Promise((resolve, reject) => {
		// 发起代理请求并保存ZIP文件
		request(requestOptions)
			.on("response", (response) => {
				// 检查响应状态码
				if (response.statusCode !== 200) {
					reject(new Error("下载失败: " + response.statusCode));
				}
			})
			.pipe(fs.createWriteStream(savePath))
			.on("finish", () => {
				resolve("下载完成");
			})
			.on("error", (err) => {
				reject(new Error("下载错误: " + err));
			});
	});
}

function convertApngToGif(filePath, outputDirectoryPath) {
	try {
		const fileName = path.basename(filePath, ".png");
		const gifPath = path.join(outputDirectoryPath, `${fileName}.gif`);
		apng2gif.sync(filePath, gifPath);
		console.log(`Converted ${filePath} to ${gifPath}`);

		// 处理转换后的GIF文件
		const modifiedData = unlimitedGifRepetitions(gifPath);
		fs.writeFileSync(gifPath, modifiedData);
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

function batch(directoryPath, outputDirectoryPath) {
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

function moveFiles(sourceDir, destinationDir) {
	if (!fs.existsSync(destinationDir)) {
	  fs.mkdirSync(destinationDir);
	  console.log(`Created directory: ${destinationDir}`);
	}
  
	try {
	  const files = fs.readdirSync(sourceDir);
	  for (let file of files) {
		const sourcePath = path.join(sourceDir, file);
		const destinationPath = path.join(destinationDir, file);
		fs.renameSync(sourcePath, destinationPath);
		console.log(`Moved file: ${file}`);
	  }
	} catch (err) {
	  console.error("Failed to read directory:", err);
	}
  }
  

function deleteDirectory(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file) => {
      const filePath = `${directoryPath}/${file}`;
      if (fs.lstatSync(filePath).isDirectory()) {
        deleteDirectory(filePath); // 递归删除子目录
      } else {
        fs.unlinkSync(filePath); // 删除文件
      }
    });
    fs.rmdirSync(directoryPath); // 删除目录
    console.log(`已删除目录: ${directoryPath}`);
  }
}


const url =
	"http://dl.stickershop.line.naver.jp/products/0/0/1/24367877/iphone/stickerpack@2x.zip";

const regex = /(\d+)\/iphone/;
const matches = regex.exec(url);

// 提取的数字
const id = matches && matches[1];
// 使用示例
const zipUrl = `http://dl.stickershop.line.naver.jp/products/0/0/1/${id}/iphone/stickerpack@2x.zip`;
const savePath = "./file.zip";

download(zipUrl, savePath)
	.then((message) => {
		console.log(message);
		console.warn("=====解压中=====");
		const AdmZip = require("adm-zip");
		const zipDir = "./extracted";
		const zip = new AdmZip(savePath);
		zip.extractAllTo(zipDir, true /* overwrite */);

		console.warn("=====移动中=====");
		const originDir = "./origin";
		deleteDirectory(originDir);
		moveFiles(zipDir+"/animation@2x", originDir);

		console.warn("=====转换中======");
		const outputDir = "./output";
    	deleteDirectory(outputDir);
		batch(originDir, outputDir);
	})
	.catch((error) => {
		console.error(error);
	});
