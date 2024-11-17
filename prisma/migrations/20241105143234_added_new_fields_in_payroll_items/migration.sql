/*
  Warnings:

  - Added the required column `basicSalary` to the `PayrollItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bonuses` to the `PayrollItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deductions` to the `PayrollItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grossSalary` to the `PayrollItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `netSalary` to the `PayrollItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `PayrollItem` ADD COLUMN `basicSalary` DOUBLE NOT NULL,
    ADD COLUMN `bonuses` DOUBLE NOT NULL,
    ADD COLUMN `deductions` DOUBLE NOT NULL,
    ADD COLUMN `grossSalary` DOUBLE NOT NULL,
    ADD COLUMN `netSalary` DOUBLE NOT NULL;
