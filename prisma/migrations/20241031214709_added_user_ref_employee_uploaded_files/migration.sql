/*
  Warnings:

  - Added the required column `employeeId` to the `UploadFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UploadFile` ADD COLUMN `employeeId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `UploadFile` ADD CONSTRAINT `UploadFile_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
