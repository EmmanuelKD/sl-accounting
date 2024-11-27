"use server";
import { UploadFile } from "@prisma/client";
import fs from "fs";

const uploadDir = "public/images/usersImg/";
const uploadDirFiles = "public/images/employeesFiles/";
const uploadInventoryDirFiles = "public/images/inventoryFiles/";

const createDirectoryIfNotExists = (directoryPath: string) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
};

export const saveImageLocally = async (imagefd: FormData, userId: string) => {
  const imagePath = `${uploadDir}/${userId}.jpg`;
  const imageUrl = `/images/usersImg/${userId}.jpg`;
  createDirectoryIfNotExists(uploadDir);
  const image = imagefd.get("image") as File;
  const buffer = Buffer.from(await image.arrayBuffer());
  fs.writeFileSync(imagePath, buffer);
  return imageUrl;
};

export const saveStaffFiles = async (
  files: { fileName: string; file: File }[],
  employeeId: string,
  workspaceId: string,

) => {
  const uploadedFiles: Omit<UploadFile, "id">[] = [];
  for (const rawFile of files) {
    const imagePath = `${uploadDirFiles}/${employeeId}/${rawFile.fileName}.jpg`;
    const imageUrl = `/images/usersFiles/${employeeId}/${rawFile.fileName}.jpg`;

    createDirectoryIfNotExists(uploadDirFiles);

    const buffer = Buffer.from(await rawFile.file.arrayBuffer());
    fs.writeFileSync(imagePath, buffer);
    uploadedFiles.push({
      name: rawFile.fileName,
      url: imageUrl,
      workspaceId,
      employeeId
    });
  }
  return uploadedFiles;
};

export const saveStaffFile = async (
filefd: FormData,
  fileName: string,
  employeeId: string,
  workspaceId: string
) => {
  const imagePath = `${uploadDirFiles}${employeeId}/${fileName}.jpg`;
  // const imageUrl = `/images/usersFiles/${employeeId}/${fileName}.jpg`;
  const file = filefd.get("file") as File;


  createDirectoryIfNotExists(`${uploadDirFiles}${employeeId}`);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(imagePath, buffer);
  const uploadedFiles: Omit<UploadFile, "id"> = {
    name: fileName,
    url: imagePath,
    workspaceId,
    employeeId
  };
  return uploadedFiles;
};


export const saveInventoryFile = async (
  filefd: FormData,
    fileName: string,
    inventoryId: string,
  ) => {
    const imagePath = `${uploadInventoryDirFiles}${inventoryId}/${fileName}.jpg`;
    // const imageUrl = `/images/usersFiles/${employeeId}/${fileName}.jpg`;
    const file = filefd.get("inventory-image") as File;
  
    createDirectoryIfNotExists(`${uploadInventoryDirFiles}${inventoryId}`);
  
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(imagePath, buffer);
    
    return imagePath;
  };
  