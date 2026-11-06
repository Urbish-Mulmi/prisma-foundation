import { prisma } from "./lib/prisma.js";

async function  clearRecordAndResetId() {
    await prisma.$executeRaw 
    `TRUNCATE TABLE "User","Post" RESTART IDENTITY`
    console.log("Table cleared and ID reset success")
  }
async function main() {

// Agenda:  To do updates in records, perform Upsert via Prisma:

  // (Pre-Requisite) 1. Create 5 records in user model 
    // const createUsers = await prisma.user.createManyAndReturn(
    //   {
    //     data:[
    //       {name:"User1", email:"User1@g.com"},{name:"User2", email:"User2@g.com"},        
    //       {name:"User3", email:"User3@g.com"},{name:"User4", email:"User4@g.com"},        
    //       {name:"User5", email:"User5@g.com"},        
    //       ]
    //   }
    // )
    // console.log(createUsers);

  // (Pre-Requisite)  2. Return to see all users from  model named: user
    const getAllUser = await prisma.user.findMany()
    console.log(`Record of All users in User model:`);  
    console.log(getAllUser);
  

  // (Actual-Task) 3. Update name of 2nd id  to June
    // const updatedUser = await prisma.user.update({
    //   where:{id:2},
    //   data:{
    //     name:"June"
    //   }}
    // )
    // console.log("Update User Success:",updatedUser);

  // (Actual-Task) 4. UpdateMany: to Update  name of every record  to Redacted
    // const updatedMany = await prisma.user.updateManyAndReturn({
    //   data:{
    //     name:"Redacted"
    //   }}
    // )
    // console.log("Name Update of every record Success:",updatedMany);
  
  //  (Actual-Task) 5.Upsert: Upsert Updates if exists else adds a new record
    const upsertedUser = await prisma.user.upsert({
      where:{
        email:"u3@g.com"
      },
      create:{
        name:"UpsertCreated UserName",
        email:"u3@g.com"
      },
      update:{
        name:"UpsertUpdated UserName"
      }
    });
    console.log("see the results in gui, run npx prisma studio in terminal!");
    console.log(upsertedUser);
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