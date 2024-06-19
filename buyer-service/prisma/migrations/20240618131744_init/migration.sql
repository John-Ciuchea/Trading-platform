/*
  Warnings:

  - You are about to drop the column `total_price` on the `Deal` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[deliverySequence]` on the table `Deal` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deliverySequence` to the `Deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Deal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "total_price",
ADD COLUMN     "deliverySequence" INTEGER NOT NULL,
ADD COLUMN     "totalPrice" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Deal_deliverySequence_key" ON "Deal"("deliverySequence");
