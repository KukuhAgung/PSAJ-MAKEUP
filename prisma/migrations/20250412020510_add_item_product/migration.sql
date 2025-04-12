-- CreateTable
CREATE TABLE "HeroProduct" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemProduct" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "banner" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItemProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryProduct" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GalleryProduct" ADD CONSTRAINT "GalleryProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ItemProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
