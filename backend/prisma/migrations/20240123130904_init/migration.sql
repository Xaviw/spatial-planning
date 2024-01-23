/*
  Warnings:

  - You are about to drop the column `sidebarId` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the `Sidebar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Material` DROP FOREIGN KEY `Material_sidebarId_fkey`;

-- DropForeignKey
ALTER TABLE `Sidebar` DROP FOREIGN KEY `Sidebar_menuId_fkey`;

-- DropIndex
DROP INDEX `Material_isTitle_sidebarId_overlayId_idx` ON `Material`;

-- AlterTable
ALTER TABLE `Material` DROP COLUMN `sidebarId`,
    ADD COLUMN `siderId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Sidebar`;

-- CreateTable
CREATE TABLE `Sider` (
    `id` VARCHAR(191) NOT NULL,
    `menuId` VARCHAR(191) NOT NULL,
    `position` ENUM('left', 'right') NOT NULL,
    `sort` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateTime` DATETIME(3) NOT NULL,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    INDEX `Sider_position_menuId_sort_isDelete_idx`(`position`, `menuId`, `sort`, `isDelete`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Material_isTitle_siderId_overlayId_idx` ON `Material`(`isTitle`, `siderId`, `overlayId`);

-- AddForeignKey
ALTER TABLE `Material` ADD CONSTRAINT `Material_siderId_fkey` FOREIGN KEY (`siderId`) REFERENCES `Sider`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sider` ADD CONSTRAINT `Sider_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `Menu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
