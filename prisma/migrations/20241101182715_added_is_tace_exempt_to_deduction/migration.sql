/*
  Warnings:

  - You are about to drop the column `isTaxExempt` on the `PayrollItem` table. All the data in the column will be lost.
  - Added the required column `isTaxExempt` to the `Deduction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Deduction` ADD COLUMN `isTaxExempt` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `PayrollItem` DROP COLUMN `isTaxExempt`;
