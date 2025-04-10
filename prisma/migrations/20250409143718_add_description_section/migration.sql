-- CreateTable
CREATE TABLE "DescriptionSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DescriptionSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionVideo" (
    "id" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "descriptionSectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SectionVideo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SectionVideo" ADD CONSTRAINT "SectionVideo_descriptionSectionId_fkey" FOREIGN KEY ("descriptionSectionId") REFERENCES "DescriptionSection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
