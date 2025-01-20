## Getting Started

1. Install PostgreSQL
2. Create a new user and database for the project and put this into a .env file. `DATABASE_URL="postgresql://ADMIN:PASSWORD@localhost:5432/DB?schema=public"`. Replace `ADMIN` `PASSWORD` & `DB` respectively.
3. Run `yarn prisma:push` to push schema into database.
4. Run `yarn dev`
5. Visit [http://localhost:3000](http://localhost:3000).
