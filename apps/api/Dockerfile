FROM node:20-alpine

WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the API source
COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]

# Ping health endpoint every 10s
HEALTHCHECK --interval=10s --timeout=2s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1