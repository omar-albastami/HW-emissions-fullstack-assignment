FROM node:20-alpine

WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the API source
COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]