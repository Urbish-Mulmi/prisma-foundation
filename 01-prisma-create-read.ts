import { prisma } from "./lib/prisma.js";

async function  clearRecordAndResetId() {
    await prisma.$executeRaw 
    `TRUNCATE TABLE "User","Post" RESTART IDENTITY`
    console.log("Table cleared and ID reset success")
  }
async function main() {

  // Agenda: Create Records, Read them
  
  //(Actual-Task) 1. create a single user with (name=a1, email)
    // const createUser = await prisma.user.create({
    //   data:{  email:"a1@g.com",name:"a1"}
    // })
    // console.log(createUser);
  
  // (Actual-Task) 2. create many users at once
    //  const manyNewUsers = await prisma.user.createMany({
    //   data:[
    //     {name:"a2", email:"a2@g.com"},
    //     {name:"a3", email:"a3@g.com"}
    //   ]
    //  });
    //  console.log(manyNewUsers);

  // (Actual-Task) 3. create many users and return with inbuilt
    // const manyNewUsersAndReturn = await prisma.user.createManyAndReturn({
    //   data:[
    //     {name:"a4", email:"a4@g.com"},
    //     {name:"a5", email:"a5@g.com"}
    //   ]
    // });
    // console.log(manyNewUsersAndReturn);

  //(Actual-Task) 4. Return all users from  model named: user
    const getAllUser = await prisma.user.findMany()
    console.log(`Record of All users in User model:`);  
    console.log(getAllUser);

  //(Actual-Task) 5.fetching only first record from a model
  const firstUser = await prisma.user.findFirst()
  // console.log(firstUser)

  // (Actual-Task) 6.fetching record based on particular email
  const userByEmail = await prisma.user.findUnique({
    where:{email:"a3@g.com"}}
  )
  console.log(`User found by email parameter ${JSON.stringify(userByEmail)}`)

}

// uncomment to clear records and reset auto increment id as well
    // await clearRecordAndResetId(); 

main()
  .then(async()=>{
    await prisma.$disconnect();
  })
  .catch(async(err)=>{
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  })