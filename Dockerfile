# Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Build the project
RUN npm run build

# Expose app port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:prod"]
