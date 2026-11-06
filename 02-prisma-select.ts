import { prisma } from "./lib/prisma.js";

async function  clearRecordAndResetId() {
    await prisma.$executeRaw 
    `TRUNCATE TABLE "User","Post" RESTART IDENTITY`
    console.log("Table cleared and ID reset success")
  }
async function main() {
// Agenda: To do explicit field or column selections to display to user via prisma:

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
  
  // (Actual-Observation) 3. BY Default, prisma selects all field and returns to displayit
  const userDefault = await prisma.user.findUnique({
    where:{id:6}
  })
  console.log(userDefault)
  
  // (Actual-Task) 4. Explicitly select fields(columns) in Prisma:
  const user = await prisma.user.findUnique({
    where:{id:6},
   
    select:{ name:true,email:true}

  })
  console.log(user)
}

// uncomment below to clear records and reset auto increment id as well
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