# Use official node image as a base
FROM node:20-alpine
# Set working directory in the container
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the backend port
EXPOSE 5001

# Start the backend server
CMD ["npm", "start"]