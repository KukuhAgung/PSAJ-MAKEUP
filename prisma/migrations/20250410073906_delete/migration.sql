/*
  Warnings:

  - You are about to drop the `DescriptionSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SectionVideo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SectionVideo" DROP CONSTRAINT "SectionVideo_descriptionSectionId_fkey";

-- DropTable
DROP TABLE "DescriptionSection";

-- DropTable
DROP TABLE "SectionVideo";
