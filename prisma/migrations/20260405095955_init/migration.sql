-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "weatherCity" TEXT NOT NULL,
    "weatherTemp" REAL NOT NULL,
    "weatherDesc" TEXT NOT NULL
);
