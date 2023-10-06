English | [简体中文](./README_ZH.md)

## Usage

Project Name: GIF Converter

## Project Overview

This is a tool that converts APNG files to GIF files and allows modification of the converted GIF files. It provides two main functionalities:

1. Convert APNG to GIF: By utilizing the apng2gif library, it can convert APNG files to GIF files and save them to the specified output directory.

2. Modify GIF Files: For the converted GIF files, the tool offers a function to modify the looping behavior. By default, GIF files have a limited number of loop repetitions, but with this tool, you can set the loop count to infinite.

## Usage Instructions

To use the GIF Converter tool for APNG to GIF conversion and GIF modification, follow these steps:

1. Install Dependencies: Run the following command in the project root directory to install the required dependencies:

```sh
npm install
```

2. Prepare Files: Place the APNG files you wish to convert in the specified input directory. By default, the input directory is `./origin`.

3. Create Output Directory: If the output directory doesn't exist, it will be automatically created during runtime. Alternatively, you can manually create the output directory. The default output directory is `./output`.

4. Run Conversion and Modification: Execute the following command in the project root directory to perform the conversion and modification:

```sh
npm start
```

5. View Results: In the console output, you will see the conversion and modification status for each file, along with the output file paths.

6. Completion: The converted and modified GIF files will be saved in the output directory. You can locate and use them there.

Note: Ensure that you have Node.js and npm installed before running the tool.

## Configuration Options

You can modify the following configuration options as per your requirements:

- Input Directory: Default is `./origin`. You can modify the `directoryPath` variable in the `batchModifyGifFilesInDirectory` function to specify the input directory path.

- Output Directory: Default is `./output`. You can modify the `outputDirectoryPath` variable in the `batchModifyGifFilesInDirectory` function to specify the output directory path.

I hope this project overview and usage instructions are helpful to you! If you have any questions or need further assistance, feel free to ask.
