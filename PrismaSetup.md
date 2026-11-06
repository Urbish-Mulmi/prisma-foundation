# Prisma ORM 7 Setup — PostgreSQL + TypeScript

## 1. Create a TypeScript project

```powershell
mkdir PrismaProject
cd PrismaProject

npm init -y
npm pkg set type=module

npm install typescript tsx @types/node --save-dev
npx tsc --init
```

## 2. Install dependencies

```powershell
npm install prisma@7 @types/pg --save-dev
npm install @prisma/client@7 @prisma/adapter-pg pg dotenv
```

**Package purpose:**

- `prisma` — CLI for Prisma commands, migrations and Client generation.
- `@prisma/client` — Prisma Client library for database queries.
- `@prisma/adapter-pg` — Connects Prisma Client to PostgreSQL through a driver adapter.
- `pg` — PostgreSQL Node.js driver.
- `@types/pg` — TypeScript definitions for the PostgreSQL driver.
- `dotenv` — Loads environment variables from `.env`.
- `typescript` — TypeScript compiler.
- `tsx` — Runs TypeScript files directly during development.

## 3. Configure TypeScript

Replace `tsconfig.json` with:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",

    "strict": true,
    "esModuleInterop": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "skipLibCheck": true,

    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    "sourceMap": true,

    "rootDir": ".",
    "outDir": "./dist"
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist", "generated"]
}
```

## 4. Set up PostgreSQL

Start your PostgreSQL Docker container.

Create a database from terminal, run:

```
docker exec -it postgres-db psql -U postgres -c "CREATE DATABASE yourDatabaseName";
```

Replace `postgres-db` and `postgres` with your actual container name and PostgreSQL username if different.

Ensure PostgreSQL is accessible on port `5432`.

## 5. Initialize Prisma

```powershell
npx prisma init --datasource-provider postgresql --output ../generated/prisma
```

This creates:

- `prisma/schema.prisma` — Database schema and models.
- `.env` — Environment variables.
- `prisma.config.ts` — Prisma CLI configuration.
  - Prisma 7.10+ generates `prisma7.config.ts`.

## 6. Configure the database connection

Inside `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/yourDatabaseName?schema=public"
```

Replace `password` with your actual PostgreSQL password.

configure connection Inside the generated Prisma config file `prisma7.config.ts` its auto generated just verify as below:

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});

```

## 7. Define actual database schema

Inside `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}
```

## 8. Create migration and generate Prisma Client

```powershell
npx prisma migrate dev --name init
npx prisma generate
```

- `migrate dev` — Creates a migration from schema changes and applies it to the development database.
- `generate` — Generates Prisma Client based on the schema.

**Note:** Prisma 7 does not automatically generate Prisma Client after migrations. Run `prisma generate` explicitly.

## 9. Initialize Prisma core component Prisma Client

Create `lib/prisma.ts`:

```typescript
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!
});

const prisma = new PrismaClient({ adapter });

export { prisma };
```

This module initializes and exports a reusable Prisma Client instance for database operations throughout the application.

**Important:** Generally, create one Prisma Client instance for a long-running application rather than creating a new instance for every query.

## 10. Actual file to run and test project

Create `index.ts` or `script.ts`:

```typescript
import { prisma } from "./lib/prisma.js";

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@prisma.io",
      posts: {
        create: {
          title: "Hello World",
          content: "My first post",
          published: true
        }
      }
    },
    include: {
      posts: true
    }
  });

  console.log("Created user:", user);

  const users = await prisma.user.findMany({
    include: {
      posts: true
    }
  });

  console.log("All users:", users);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run:

```powershell
npx tsx index.ts or npx tsx script.ts
```

## 11. Explore database using Prisma Studio

```powershell
npx prisma studio
```

Opens a GUI to view and manage database records.

---
## 12. Imp Frequently used commands

**When you change `prisma/schema.prisma`** — adding models, columns, fields, or constraints:

```powershell
# Apply schema changes to PostgreSQL
npx prisma migrate dev --name describe_change

# Regenerate the Prisma Client, so that your client component gets synchronized and updated access to new models, fields
npx prisma generate
```

Replace `describe_change` with a meaningful name, such as `add_user_age`.

**Q. When you change CRUD logic in `index.ts` or `script.ts`:**

No migration or generation is normally needed. 
- `tsx watch` automatically reruns the application when you save.
- just append below line in package.json
```
"scripts": { "dev": "tsx watch index.ts"}
```

##  !!Mental model:

- `migrate dev` = update the database.
- `prisma generate` = update the generated client.
- `npm run dev` = run your application.
- `npx prisma studio` = run gui prisma application to view db with ease.
## Understanding project structure

```text
PrismaProject/
│
├── generated/
│   └── prisma/              # Generated Prisma Client
│
├── lib/
│   └── prisma.ts            # Prisma Client instance inside library named folder
│
├── prisma/
│   ├── migrations/          # Migration history
│   └── schema.prisma        # Database models defined by user
│
├── node_modules/
│
├── .env                     # Database connection source path stored
├── .gitignore
├── index.ts                 # Test/Applications entry point
├── package.json
├── prisma7.config.ts        # Prisma CLI configuration
└── tsconfig.json
```

**Important:** Add the following to `.gitignore`:

```gitignore
node_modules/
.env
dist/
generated/prisma/
```

