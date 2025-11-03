# Use official node image as a base
FROM node:20-alpine

# Set working directory in the container
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the frontend port (Vite default port 5173)
EXPOSE 5173

# Start the dev server
CMD ["npm", "run", "dev"]