/*
  Warnings:

  - You are about to drop the column `anonym` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductService` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductService" DROP CONSTRAINT "ProductService_productId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_productId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "anonym",
DROP COLUMN "transactionId";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "ProductService";

-- DropTable
DROP TABLE "Transaction";
