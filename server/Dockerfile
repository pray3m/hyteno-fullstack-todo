# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to leverage Docker cache
COPY package.json yarn.lock ./

# Install all dependencies (including devDependencies if needed)
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Install Prisma CLI globally (optional if Prisma is a dependency)
RUN yarn global add prisma

# Generate Prisma Client
RUN yarn prisma generate

# Build the NestJS application
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["node", "dist/main"]
