import * as fs from "fs";
import { env, storagePath } from "../config";

export const getStorageFilePath = (filename: string) => {
  return `${storagePath}/${env}/${filename}`;
};

export const writeFileIfNotExists = (filename: string, content: any) => {
  const filePath = getStorageFilePath(filename);
  if (fs.existsSync(filePath)) {
    return false;
  }

  const body = JSON.stringify(content); //Covert to JSON string

  fs.writeFile(filePath, body, "utf8", function (err) {
    if (err) {
      throw err;
    }
    console.log(`Wrote content to ${filePath}`);
  });
};

export const readFile = (filename: string, defaultValue: any = undefined) => {
  const filePath = getStorageFilePath(filename);
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf8");
    return fileContent && fileContent.length > 0
      ? JSON.parse(fileContent)
      : defaultValue;
  } else {
    return defaultValue;
  }
};
