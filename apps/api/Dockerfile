# Use an official Node LTS image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the API source
COPY . .

# Expose the port your app listens on
EXPOSE 3000

# Start the server
CMD ["node", "src/server.js"]

HEALTHCHECK --interval=10s --timeout=2s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1