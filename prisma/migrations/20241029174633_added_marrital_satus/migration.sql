/*
  Warnings:

  - Added the required column `maritalStatus` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isTaxExempt` to the `PayrollItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Employee` ADD COLUMN `NIN_Number` VARCHAR(191) NULL,
    ADD COLUMN `NRA_Tin_Number` VARCHAR(191) NULL,
    ADD COLUMN `maritalStatus` ENUM('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED') NOT NULL;

-- AlterTable
ALTER TABLE `PayrollItem` ADD COLUMN `isTaxExempt` BOOLEAN NOT NULL;
