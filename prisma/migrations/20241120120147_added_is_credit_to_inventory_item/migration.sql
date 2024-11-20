-- AlterTable
ALTER TABLE `InventoryItem` ADD COLUMN `fullyDepreciated` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `fullyPaid` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isCredit` BOOLEAN NOT NULL DEFAULT false;
