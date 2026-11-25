/*
  Warnings:

  - You are about to drop the column `Alamat_domisili` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `Asal_komisariat` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `Asal_pc` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `Asal_perguruan_tinggi` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `Email` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `Jenis_kelamin` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `Jenjang_perkaderan` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `Link_berkas` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `Motivasi` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `Nama_lengkap` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `No_whatsapp` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `Program_studi` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `Riwayat_penyakit` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `Tanggal_lahir` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `Tempat_lahir` on the `Member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Member` DROP COLUMN `Alamat_domisili`,
    DROP COLUMN `Asal_komisariat`,
    DROP COLUMN `Asal_pc`,
    DROP COLUMN `Asal_perguruan_tinggi`,
    DROP COLUMN `Email`,
    DROP COLUMN `Jenis_kelamin`,
    DROP COLUMN `Jenjang_perkaderan`,
    DROP COLUMN `Link_berkas`,
    DROP COLUMN `Motivasi`,
    DROP COLUMN `Nama_lengkap`,
    DROP COLUMN `No_whatsapp`,
    DROP COLUMN `Program_studi`,
    DROP COLUMN `Riwayat_penyakit`,
    DROP COLUMN `Tanggal_lahir`,
    DROP COLUMN `Tempat_lahir`;

-- AlterTable
ALTER TABLE `Member_app` ADD COLUMN `Alamat_domisili` TEXT NULL,
    ADD COLUMN `Asal_komisariat` VARCHAR(150) NULL,
    ADD COLUMN `Asal_pc` VARCHAR(150) NULL,
    ADD COLUMN `Asal_perguruan_tinggi` VARCHAR(150) NULL,
    ADD COLUMN `Jenis_kelamin` VARCHAR(20) NULL,
    ADD COLUMN `Jenjang_perkaderan` VARCHAR(100) NULL,
    ADD COLUMN `Link_berkas` TEXT NULL,
    ADD COLUMN `Motivasi` TEXT NULL,
    ADD COLUMN `Program_studi` VARCHAR(150) NULL,
    ADD COLUMN `Riwayat_penyakit` TEXT NULL,
    ADD COLUMN `Tanggal_lahir` DATE NULL,
    ADD COLUMN `Tempat_lahir` VARCHAR(100) NULL;
