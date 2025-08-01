import { existsSync, rmSync } from "fs";
import path from "path";

const removeFile = (name, type) => {
  const filePath = path.join(process.cwd(), "public", type, name);
  console.log(filePath);
  if (existsSync(filePath)) {
    rmSync(filePath);
  }
};

export default removeFile;
