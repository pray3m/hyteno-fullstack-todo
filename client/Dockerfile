# Stage 1: Build the React app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN yarn build

# Stage 2: Serve the app with a static server
FROM node:18-alpine

# Install serve globally
RUN yarn global add serve

# Set working directory
WORKDIR /app

# Copy build files from builder
COPY --from=builder /app/dist ./dist

# Expose port 3000
EXPOSE 3000

# Command to run the app
CMD ["serve", "-s", "dist", "-l", "3000"]
