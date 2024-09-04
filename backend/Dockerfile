# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Install dependencies for the Node.js application
COPY package*.json ./
RUN npm install

# Install additional packages for C++ and Python runtime
RUN apt-get update && apt-get install -y \
    g++ \
    build-essential \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Copy the rest of your application code
COPY . .

# Copy the .env file
COPY .env .env

# Expose the port your application runs on
EXPOSE 5000

# Start the Node.js application
CMD ["node", "server.js"]
