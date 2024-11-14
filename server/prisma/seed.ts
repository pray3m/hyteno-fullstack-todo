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
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      // Hash the user's password
      const hashedPassword = await bcrypt.hash(user.password, roundsOfHashing);

      // Create the user in the database
      const createdUser = await prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          password: hashedPassword,
          role: user.role,
        },
      });

      console.log(
        `Created user: ${createdUser.email} with role ${createdUser.role}`,
      );
    } else {
      console.log(
        `User already exists: ${existingUser.email} with role ${existingUser.role}`,
      );
    }
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
