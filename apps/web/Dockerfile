FROM node:20-alpine

WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev"]