/*
  Warnings:

  - You are about to drop the column `deductionsAfterTax` on the `Salary` table. All the data in the column will be lost.
  - You are about to drop the column `deductionsBeforTax` on the `Salary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Salary` DROP COLUMN `deductionsAfterTax`,
    DROP COLUMN `deductionsBeforTax`;
