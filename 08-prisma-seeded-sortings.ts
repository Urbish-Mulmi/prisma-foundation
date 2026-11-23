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
// B. Fetch record with sorting filter applied

//  (Pre-Requisite) 1.run  npx prisma db seed in terminal


async function main() {

  // sort by views of the posts

  // startsWith: filter based on starting string
  // endsWith: filter based on ending string
  // some: at least one record matching criteria
  // And : logical ands


  
// sort by views of the posts
{  const posts = await prisma.post.findMany({
    where:{published:true,},
    orderBy:{views:"desc",},
    select:{ views:true, title:true},
  })
  console.log( `Post with published true in sorted`)
  console.log(posts)}

// sort by users name in ascending order
  {  const users = await prisma.user.findMany({
      where:{},
      orderBy:{name:'asc'},
      select:{name:true}
    })
    console.log("Users name in ascending order")
    console.log(users)}

// sort  users by no of posts they have in descending order
const users = await prisma.user.findMany({
  orderBy: {
    posts: {
      _count: 'desc', // Sorts highest to lowest at the database level
    },
  },
  select: {
    name: true,
    _count: {
      select: { posts: true }, // Grabs just the numeric count
    },
  },
});

for (const user of users) {
  console.log(`${user.name} has ${user._count.posts} posts`);
}

}


// uncomment to clear db record
  // clearRecordAndResetId();

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });