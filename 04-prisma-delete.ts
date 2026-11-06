import { prisma } from "./lib/prisma.js";

async function  clearRecordAndResetId() {
    await prisma.$executeRaw 
    `TRUNCATE TABLE "User","Post" RESTART IDENTITY`
    console.log("Table cleared and ID reset success")
  }
async function main() {
//  Agenda: to do delete, deleteMany via prisma:

  //(Pre-Requisites) 1.create 5 records in user model 
    // const createUsers = await prisma.user.createManyAndReturn(
    //   {
    //     data:[
    //       {name:"User1",email:"User1@g.com"},        
    //       {name:"User2",email:"User2@g.com"},        
    //       {name:"User3",email:"User3@g.com"},        
    //       {name:"User4",email:"User4@g.com"},        
    //       {name:"User5",email:"User5@g.com"},        
    //       ]
    //   }
    // )
    // console.log(createUsers);

  //(Pre-Requisites) 2.see all users from  model named: user
    // const getAllUser = await prisma.user.findMany()
    // console.log(`Record of All users in User model:`);  
    // console.log(getAllUser);

  //(Actual-task) 3. delete users record where id = 2
    // const deletedUser = await prisma.user.delete({
    //   where:{id:2}
    // }
    // )
    // console.log("Delete User Success:",deletedUser);
  
 // (Actual-task) 4. delete whole users record 
    // const deletedManyUser = await prisma.user.deleteMany()
    // console.log("Delete User Success:", deletedManyUser);

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