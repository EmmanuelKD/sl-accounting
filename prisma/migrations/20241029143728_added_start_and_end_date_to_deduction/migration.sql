-- AlterTable
ALTER TABLE `Deduction` ADD COLUMN `endDate` DATETIME(3) NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
