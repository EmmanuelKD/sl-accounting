-- AlterTable
ALTER TABLE `Invoice` ADD COLUMN `accountsPayableId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Payment` ADD COLUMN `accountsPayableId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `AccountsPayable` (
    `id` VARCHAR(191) NOT NULL,
    `balance` DOUBLE NOT NULL DEFAULT 0.0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `vendorId` VARCHAR(191) NOT NULL,
    `workspaceId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `APTransaction` (
    `id` VARCHAR(191) NOT NULL,
    `accountsPayableId` VARCHAR(191) NOT NULL,
    `transactionDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `description` VARCHAR(191) NULL,
    `amount` DOUBLE NOT NULL,
    `type` ENUM('DEBIT', 'CREDIT') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_accountsPayableId_fkey` FOREIGN KEY (`accountsPayableId`) REFERENCES `AccountsPayable`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_accountsPayableId_fkey` FOREIGN KEY (`accountsPayableId`) REFERENCES `AccountsPayable`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccountsPayable` ADD CONSTRAINT `AccountsPayable_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccountsPayable` ADD CONSTRAINT `AccountsPayable_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `APTransaction` ADD CONSTRAINT `APTransaction_accountsPayableId_fkey` FOREIGN KEY (`accountsPayableId`) REFERENCES `AccountsPayable`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
