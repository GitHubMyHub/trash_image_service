# Use an official Node.js runtime as a parent image
FROM node:latest AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install -g bun
RUN bun install

#RUN bun -v | sed

# Copy the rest of the application
COPY index.ts .

# Build the app
#RUN bun dev
#RUN node index.ts

CMD ["bun", "dev"]

# Expose port 80
#EXPOSE 80
