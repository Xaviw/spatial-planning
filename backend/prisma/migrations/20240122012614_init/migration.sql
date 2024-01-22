-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(60) NOT NULL,
    `password` VARCHAR(50) NOT NULL,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateTime` DATETIME(3) NOT NULL,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Config` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(50) NOT NULL,
    `value` JSON NOT NULL,

    UNIQUE INDEX `Config_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attachment` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('image', 'audio', 'vedio', 'office', 'other') NOT NULL,
    `url` VARCHAR(120) NOT NULL,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Attachment_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Menu` (
    `id` VARCHAR(191) NOT NULL,
    `parentId` VARCHAR(191) NULL,
    `name` VARCHAR(60) NOT NULL,
    `sort` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateTime` DATETIME(3) NOT NULL,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    INDEX `Menu_isDelete_idx`(`isDelete`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Material` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('BarChart', 'Carousel', 'Collapse', 'DataCard', 'Description', 'FileList', 'LineChart', 'PieChart', 'Progress', 'SubTitle', 'Table', 'Timeline', 'Title') NOT NULL,
    `props` JSON NOT NULL,
    `isTitle` BOOLEAN NOT NULL,
    `sidebarId` VARCHAR(191) NULL,
    `overlayId` VARCHAR(191) NULL,

    INDEX `Material_isTitle_sidebarId_overlayId_idx`(`isTitle`, `sidebarId`, `overlayId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sidebar` (
    `id` VARCHAR(191) NOT NULL,
    `menuId` VARCHAR(191) NOT NULL,
    `position` ENUM('left', 'right') NOT NULL,
    `sort` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateTime` DATETIME(3) NOT NULL,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    INDEX `Sidebar_position_menuId_sort_isDelete_idx`(`position`, `menuId`, `sort`, `isDelete`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Layer` (
    `id` VARCHAR(191) NOT NULL,
    `menuId` VARCHAR(191) NOT NULL,
    `asLegend` BOOLEAN NOT NULL DEFAULT false,
    `name` VARCHAR(60) NOT NULL,
    `legendImg` VARCHAR(120) NOT NULL,
    `sort` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateTime` DATETIME(3) NOT NULL,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    INDEX `Layer_menuId_sort_isDelete_idx`(`menuId`, `sort`, `isDelete`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Overlay` (
    `id` VARCHAR(191) NOT NULL,
    `layerId` VARCHAR(191) NOT NULL,
    `type` ENUM('Marker', 'Polyline', 'BezierCurve', 'Polygon', 'Rectangle', 'Circle', 'Ellipse', 'Text', 'LabelMarker', 'ElasticMarker', 'ImageLayer') NOT NULL,
    `name` VARCHAR(60) NOT NULL,
    `props` JSON NOT NULL,
    `detailTitle` VARCHAR(60) NOT NULL,
    `detailWidth` VARCHAR(20) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateTime` DATETIME(3) NOT NULL,
    `isDelete` BOOLEAN NOT NULL DEFAULT false,

    INDEX `Overlay_layerId_isDelete_idx`(`layerId`, `isDelete`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Material` ADD CONSTRAINT `Material_sidebarId_fkey` FOREIGN KEY (`sidebarId`) REFERENCES `Sidebar`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Material` ADD CONSTRAINT `Material_overlayId_fkey` FOREIGN KEY (`overlayId`) REFERENCES `Overlay`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sidebar` ADD CONSTRAINT `Sidebar_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `Menu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Layer` ADD CONSTRAINT `Layer_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `Menu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Overlay` ADD CONSTRAINT `Overlay_layerId_fkey` FOREIGN KEY (`layerId`) REFERENCES `Layer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
