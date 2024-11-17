/*
  Warnings:

  - The values [CREDIT_CARD] on the enum `PayrollItem_paymentMode` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Payment` MODIFY `method` ENUM('BANK_TRANSFER', 'CASH', 'CHEQUE', 'MOBILE_PAYMENT') NOT NULL;
