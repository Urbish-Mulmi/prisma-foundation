import { prisma } from "../lib/prisma.js";
import { faker } from "@faker-js/faker";

 // Clear existing records and reset auto-increment IDs
 async function clearRecordAndResetId(){
  await prisma.$executeRaw`
    TRUNCATE TABLE "Post", "User" RESTART IDENTITY CASCADE
  `;}

async function main() {
  const users = await prisma.user.createManyAndReturn({
    data: Array.from({ length: 10 }, () => ({
      email: faker.internet.email(),
      name: faker.internet.username()
    })),
    select: { id: true }
  });

  for (const user of users) {
    await prisma.post.createMany({
      data: Array.from({ length: 20 }, () => {
        const published = faker.datatype.boolean();
        const views = published
          ? faker.number.int({ min: 1, max: 1000 })
          : 0;

        return {
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraphs(),
          userId: user.id,
          published,
          views
        };
      })
    });
  }

  console.log("Seeding completed!");
}
// uncomment to clear and reset DB id
  //  clearRecordAndResetId()

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });