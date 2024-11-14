import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define the number of hashing rounds
const roundsOfHashing = 10;

async function main() {
  // Define the users to be seeded
  const users = [
    {
      email: 'admin@hy.com',
      name: 'Super Admin',
      password: 'password', // Plain text password
      role: Role.ADMIN,
    },
    {
      email: 'user@hy.com',
      name: 'Prem Gautam',
      password: 'password', // Plain text password
      role: Role.USER,
    },
  ];

  for (const user of users) {
    // Hash the user's password
    const hashedPassword = await bcrypt.hash(user.password, roundsOfHashing);

    // Upsert the user in the database
    const upsertedUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: hashedPassword,
        role: user.role,
      },
      create: {
        email: user.email,
        name: user.name,
        password: hashedPassword,
        role: user.role,
      },
    });

    console.log(
      `Upserted user: ${upsertedUser.email} with role ${upsertedUser.role}`,
    );
  }
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Disconnect Prisma Client
    await prisma.$disconnect();
  });
