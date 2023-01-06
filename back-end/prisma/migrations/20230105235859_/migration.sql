-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Post" (
    "postId" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "likeID" TEXT NOT NULL,
    CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Post_likeID_fkey" FOREIGN KEY ("likeID") REFERENCES "PostLikes" ("likeId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostLikes" (
    "likeId" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "PostLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "isLiked" (
    "likeID" TEXT NOT NULL PRIMARY KEY,
    "isLiked" TEXT NOT NULL,
    "isId" TEXT NOT NULL,
    CONSTRAINT "isLiked_likeID_fkey" FOREIGN KEY ("likeID") REFERENCES "PostLikes" ("likeId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Post_postId_key" ON "Post"("postId");

-- CreateIndex
CREATE INDEX "Post_userId_idx" ON "Post"("userId");

-- CreateIndex
CREATE INDEX "Post_likeID_idx" ON "Post"("likeID");

-- CreateIndex
CREATE INDEX "PostLikes_userId_idx" ON "PostLikes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "isLiked_isLiked_key" ON "isLiked"("isLiked");

-- CreateIndex
CREATE INDEX "isLiked_likeID_idx" ON "isLiked"("likeID");
