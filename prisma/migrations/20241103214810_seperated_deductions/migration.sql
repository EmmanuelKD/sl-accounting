/*
  Warnings:

  - You are about to drop the column `deductions` on the `Salary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Salary` DROP COLUMN `deductions`,
    ADD COLUMN `deductionsAfterTax` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `deductionsBeforTax` DOUBLE NOT NULL DEFAULT 0;
