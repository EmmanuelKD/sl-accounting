/*
  Warnings:

  - Added the required column `NASSIT` to the `Salary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `NRA` to the `Salary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Role` MODIFY `level` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `Salary` ADD COLUMN `NASSIT` DOUBLE NOT NULL,
    ADD COLUMN `NRA` DOUBLE NOT NULL;

-- CreateTable
CREATE TABLE `Benefit` (
    `id` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `type` ENUM('HEALTH_INSURANCE', 'RETIREMENT_PLAN', 'PTO', 'BONUS', 'ALLOWANCE', 'EDUCATIONAL_ASSISTANCE', 'OTHER') NOT NULL,
    `description` VARCHAR(191) NULL,
    `value` DOUBLE NOT NULL,
    `effectiveDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `isTaxable` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Benefit` ADD CONSTRAINT `Benefit_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
