# Stage 1: Builder
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock for caching
COPY package.json yarn.lock ./

# Install all dependencies (including devDependencies for seeding)
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN yarn prisma generate

# Build the NestJS application
RUN yarn build

# Stage 2: Production
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile

# Copy built application and Prisma folder from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# Copy seed script
COPY --from=builder /usr/src/app/prisma/seed.ts ./prisma/seed.ts

# Install ts-node for running the seed script
RUN yarn add ts-node

# Expose the application port
EXPOSE 3000

# Define the default command
CMD ["node", "dist/main"]
