-- CreateTable
CREATE TABLE "XAccountImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "xAccount" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "XAccountImage_pkey" PRIMARY KEY ("id")
);
