-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `nickname` VARCHAR(50) NULL DEFAULT '番茄用户',
    `password` TEXT NOT NULL,
    `avatar` JSON NULL,
    `email` VARCHAR(50) NULL,
    `mobile` VARCHAR(50) NULL,
    `status` ENUM('0', '1') NULL DEFAULT '1',
    `ban_start` DATETIME(0) NULL,
    `ban_end` DATETIME(0) NULL,
    `is_active` ENUM('0', '1') NOT NULL DEFAULT '1',
    `create_time` DATETIME(0) NOT NULL,
    `update_time` DATETIME(0) NOT NULL,

    UNIQUE INDEX `username`(`username`),
    INDEX `id`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(50) NULL,
    `auth_list` JSON NOT NULL,
    `is_active` ENUM('0', '1') NOT NULL DEFAULT '1',
    `create_time` DATETIME(0) NOT NULL,
    `update_time` DATETIME(0) NOT NULL,

    UNIQUE INDEX `id`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
