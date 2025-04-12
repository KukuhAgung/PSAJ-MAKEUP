-- CreateTable
CREATE TABLE "DescriptionSection" (
    "id" SERIAL NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DescriptionSection_pkey" PRIMARY KEY ("id")
);
