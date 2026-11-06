import { prisma } from "./lib/prisma.js";

// Clear both tables and reset their auto-increment IDs
async function clearRecordAndResetId() {
  await prisma.$executeRaw`
    TRUNCATE TABLE "User", "Post" RESTART IDENTITY
  `;

  console.log("Tables cleared and IDs reset successfully.");
}

// Agenda:
// A. Run seeding file using: npx prisma db seed
// B. See N users and posts

//  (Pre-Requisite) 1.run  npx prisma db seed in terminal

async function seeUsers(count: number = 5) {
  const users = await prisma.user.findMany({
    take: count   
  });
  console.log("users records")
  console.log(users)
}

async function seePosts(count: number = 5) {
  const posts = await prisma.post.findMany({
    take: count
  });
  console.log("posts records")
  console.log(posts)
}

async function main() {
  // See N users
  await seeUsers(2);

  // See N posts
  await seePosts(2);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });