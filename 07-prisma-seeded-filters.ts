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
// B. Fetch record with some filter applied

//  (Pre-Requisite) 1.run  npx prisma db seed in terminal


async function main() {

  // gt: greater than
  // startsWith: filter based on starting string
  // endsWith: filter based on ending string
  // some: at least one record matching criteria
  // And : logical ands


  // gt: greater than
    // const popularPosts = await prisma.post.findMany({
    //   where:{
    //     views:{
    //       gt:500,
    //     }
    //   }
    // })
    // console.log(`# of posts with more than 500 views ${popularPosts.length}`)
  
  //  startsWith: filter based onstarting string
  {const posts = await prisma.post.findMany({
    where:{
      title:{
        startsWith:"D"
      }
    }
  })
   console.log(`# of posts starting with letter D ${posts.length}`)
  }

  //  endsWith: filter based on ending string
  {const posts = await prisma.user.findMany({
    where:{
      email:{
        endsWith:"hotmail.com"
      }
    }
  })
   console.log(`# of emails ending with hotmail.com   ${posts.length}`)   
  }

  const usersWithPublishedPosts = await prisma.user.findMany({
    where:{
      posts:{
        some:{
          published:true,
          views:{
            lt:100
          }
        }
      }

    }
  })
  console.log( `Users with published post and view less than 100 ${usersWithPublishedPosts.length}`)

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