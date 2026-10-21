-- CreateTable
CREATE TABLE `Admin_user` (
    `Admin_id` BIGINT NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(150) NOT NULL,
    `Email` VARCHAR(150) NOT NULL,
    `Password_hash` VARCHAR(255) NOT NULL,
    `Role` VARCHAR(30) NOT NULL,
    `Is_active` CHAR(1) NOT NULL,

    UNIQUE INDEX `Admin_user_Email_key`(`Email`),
    PRIMARY KEY (`Admin_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
