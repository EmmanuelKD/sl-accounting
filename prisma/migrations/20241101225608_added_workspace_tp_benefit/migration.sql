/*
  Warnings:

  - Added the required column `workspaceId` to the `Benefit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Benefit` ADD COLUMN `workspaceId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Benefit` ADD CONSTRAINT `Benefit_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
