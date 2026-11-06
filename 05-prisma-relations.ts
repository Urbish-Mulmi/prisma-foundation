import { prisma } from "./lib/prisma.js";

// Clear both tables and reset their auto-increment IDs
async function clearRecordAndResetId() {
  await prisma.$executeRaw`
    TRUNCATE TABLE "User", "Post" RESTART IDENTITY
  `;
  console.log("Tables cleared and IDs reset successfully.");
}

async function main() {
  // Agenda: 
  // A)One-to-many relationship: One User can have multiple Posts.
  // B)Practice Prisma's include and select for retrieving related records.

  // (Pre-Requisite) 1. Create multiple users
  // const createUsers = await prisma.user.createManyAndReturn({
  //   data: [
  //     { name: "User1", email: "User1@g.com" },
  //     { name: "User2", email: "User2@g.com" },
  //     { name: "User3", email: "User3@g.com" },
  //     { name: "User4", email: "User4@g.com" },
  //     { name: "User5", email: "User5@g.com" }
  //   ]
  // });
  // console.log(createUsers);

  // (Pre-Requisite) 2. Retrieve all users
  // const getAllUsers = await prisma.user.findMany();
  // console.log("All users:", getAllUsers);

  // (Actual-Task) 3. Create a post using the foreign key (userId) value directly
  // const newPost = await prisma.post.create({
  //   data: {
  //     title: "My third post",
  //     content: "Content of third post",
  //     userId: 1
  //   }
  // });
  // console.log(newPost);

  // (Actual-Task) 4. Create a post using connect and the relation field name.
  // const newPost = await prisma.post.create({
  //   data: {
  //     title: "My fourth post",
  //     content: "Content of fourth post",
  //     user: {
  //       connect: {
  //         id: 1
  //       }
  //     }
  //   }
  // });
  // console.log(newPost);

  // (Actual-Task) 5. Retrieve a user and all their related posts using include
  // include returns all scalar fields of the parent and included relation.
  // const userPosts = await prisma.user.findUnique({
  //   where: { id: 1 },
  //   include: {
  //     posts: true
  //   }
  // });
  // console.log(userPosts);

  // (Actual-Task) 6. Retrieve a user and selected fields from their related posts using select
  // select allows explicit control over the fields returned.
  // const userPosts = await prisma.user.findUnique({
  //   where: { id: 1 },
  //   select: {
  //     id: true,
  //     name: true,
  //     email: true,
  //     posts: {
  //       select: {
  //         title: true,
  //         content: true,
  //         published: true
  //       }
  //     }
  //   }
  // });
  // console.log(userPosts);

  // (Actual-Task) 7. Retrieve posts belonging to a user and include their associated user
  // const postsUser = await prisma.post.findMany({
  //   where: {
  //     userId: 1
  //   },
  //   include: {
  //     user: true
  //   }
  // });
  // console.log(postsUser);

}

// Uncomment to clear both tables and reset their IDs.
// await clearRecordAndResetId();

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
