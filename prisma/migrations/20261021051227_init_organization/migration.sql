-- CreateTable
CREATE TABLE `Admin_user` (
    `Admin_id` BIGINT NOT NULL,
    `Name` VARCHAR(150) NOT NULL,
    `Email` VARCHAR(150) NOT NULL,
    `Password_hash` VARCHAR(255) NOT NULL,
    `Role` VARCHAR(30) NOT NULL,
    `Is_active` CHAR(1) NOT NULL,

    PRIMARY KEY (`Admin_id`, `Email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Announcement` (
    `Announcement_id` BIGINT NOT NULL,
    `Tittle` VARCHAR(200) NOT NULL,
    `Content` LONGTEXT NULL,
    `Status` VARCHAR(20) NOT NULL,
    `Created_at` DATE NOT NULL,
    `Publish_at` DATE NULL,
    `Organization_Organization_id` BIGINT NOT NULL,
    `Category_Category_id` BIGINT NOT NULL,
    `Category_Name` VARCHAR(100) NOT NULL,
    `Admin_user_Admin_id` BIGINT NOT NULL,
    `Admin_user_Email` VARCHAR(150) NOT NULL,

    PRIMARY KEY (`Announcement_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Audit_log` (
    `Audit_id` BIGINT NOT NULL,
    `Action` VARCHAR(100) NOT NULL,
    `Entity_type` VARCHAR(50) NOT NULL,
    `Entity_id` BIGINT NOT NULL,
    `Created_at` DATE NOT NULL,
    `Details` LONGTEXT NULL,
    `Admin_user_Admin_id` BIGINT NOT NULL,
    `Admin_user_Email` VARCHAR(150) NOT NULL,

    PRIMARY KEY (`Audit_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `Category_id` BIGINT NOT NULL,
    `Name` VARCHAR(100) NOT NULL,
    `Description` LONGTEXT NOT NULL,

    PRIMARY KEY (`Category_id`, `Name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dapartemen` (
    `Departemin_id` BIGINT NOT NULL,
    `Name` VARCHAR(100) NOT NULL,
    `Description` LONGTEXT NULL,
    `Contact_email` VARCHAR(150) NOT NULL,
    `Organization_Organization_id` BIGINT NOT NULL,

    PRIMARY KEY (`Departemin_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `Event_id` BIGINT NOT NULL,
    `Tittle` VARCHAR(200) NOT NULL,
    `Description` LONGTEXT NOT NULL,
    `Location` VARCHAR(200) NOT NULL,
    `Start_at` DATE NULL,
    `End_at` DATE NOT NULL,
    `Status` VARCHAR(20) NOT NULL,
    `Organization_Organization_id` BIGINT NOT NULL,
    `Admin_user_Admin_id` BIGINT NOT NULL,
    `Admin_user_Email` VARCHAR(150) NOT NULL,

    PRIMARY KEY (`Event_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Member` (
    `Member_Id` BIGINT NOT NULL,
    `Member_No` VARCHAR(30) NOT NULL,
    `Joined_at` DATE NOT NULL,
    `Status` VARCHAR(20) NOT NULL,
    `Member_app_App_id` BIGINT NOT NULL,
    `Member_app_Email` VARCHAR(150) NOT NULL,

    UNIQUE INDEX `Member__IDX`(`Member_app_App_id`, `Member_app_Email`),
    PRIMARY KEY (`Member_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Member_app` (
    `App_id` BIGINT NOT NULL,
    `Full_Name` VARCHAR(150) NOT NULL,
    `Email` VARCHAR(150) NOT NULL,
    `Phone_Number` VARCHAR(30) NOT NULL,
    `Submitted_at` DATE NOT NULL,
    `Status` VARCHAR(20) NOT NULL,
    `Organization_Organization_id` BIGINT NOT NULL,
    `Admin_user_Admin_id` BIGINT NOT NULL,
    `Admin_user_Email` VARCHAR(150) NOT NULL,

    PRIMARY KEY (`App_id`, `Email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Organization` (
    `Organization_id` BIGINT NOT NULL,
    `Name` VARCHAR(150) NOT NULL,
    `Description` LONGTEXT NOT NULL,
    `Vision` LONGTEXT NULL,
    `Mission` LONGTEXT NULL,
    `Email` VARCHAR(150) NOT NULL,
    `Logo_url` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`Organization_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Announcement` ADD CONSTRAINT `Announcement_Organization_FK` FOREIGN KEY (`Organization_Organization_id`) REFERENCES `Organization`(`Organization_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Announcement` ADD CONSTRAINT `Announcement_Category_FK` FOREIGN KEY (`Category_Category_id`, `Category_Name`) REFERENCES `Category`(`Category_id`, `Name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Announcement` ADD CONSTRAINT `Announcement_Admin_user_FK` FOREIGN KEY (`Admin_user_Admin_id`, `Admin_user_Email`) REFERENCES `Admin_user`(`Admin_id`, `Email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Audit_log` ADD CONSTRAINT `Audit_log_Admin_user_FK` FOREIGN KEY (`Admin_user_Admin_id`, `Admin_user_Email`) REFERENCES `Admin_user`(`Admin_id`, `Email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dapartemen` ADD CONSTRAINT `Dapartemen_Organization_FK` FOREIGN KEY (`Organization_Organization_id`) REFERENCES `Organization`(`Organization_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_Organization_FK` FOREIGN KEY (`Organization_Organization_id`) REFERENCES `Organization`(`Organization_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_Admin_user_FK` FOREIGN KEY (`Admin_user_Admin_id`, `Admin_user_Email`) REFERENCES `Admin_user`(`Admin_id`, `Email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_Member_app_FK` FOREIGN KEY (`Member_app_App_id`, `Member_app_Email`) REFERENCES `Member_app`(`App_id`, `Email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Member_app` ADD CONSTRAINT `Member_app_Organization_FK` FOREIGN KEY (`Organization_Organization_id`) REFERENCES `Organization`(`Organization_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Member_app` ADD CONSTRAINT `Member_app_Admin_user_FK` FOREIGN KEY (`Admin_user_Admin_id`, `Admin_user_Email`) REFERENCES `Admin_user`(`Admin_id`, `Email`) ON DELETE RESTRICT ON UPDATE CASCADE;
