-- CreateTable
CREATE TABLE "Pelanggan" (
    "id_pelanggan" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telepon" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,

    CONSTRAINT "Pelanggan_pkey" PRIMARY KEY ("id_pelanggan")
);

-- CreateTable
CREATE TABLE "Produk" (
    "id_produk" TEXT NOT NULL,
    "nama_produk" TEXT NOT NULL,
    "harga" DECIMAL(65,30) NOT NULL,
    "stok" INTEGER NOT NULL,
    "deskripsi" TEXT,

    CONSTRAINT "Produk_pkey" PRIMARY KEY ("id_produk")
);

-- CreateTable
CREATE TABLE "Transaksi" (
    "id_transaksi" TEXT NOT NULL,
    "id_pelanggan" TEXT NOT NULL,
    "id_produk" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_harga" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Transaksi_pkey" PRIMARY KEY ("id_transaksi")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pelanggan_email_key" ON "Pelanggan"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Pelanggan_telepon_key" ON "Pelanggan"("telepon");

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_id_pelanggan_fkey" FOREIGN KEY ("id_pelanggan") REFERENCES "Pelanggan"("id_pelanggan") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_id_produk_fkey" FOREIGN KEY ("id_produk") REFERENCES "Produk"("id_produk") ON DELETE CASCADE ON UPDATE CASCADE;
