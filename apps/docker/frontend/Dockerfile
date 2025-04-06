# Use an appropriate base image
FROM node:22.11.0-alpine

# Set the working directory
WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY ./frontend/package*.json ./

# Install dependencies
RUN npm install


# Expose the application port
EXPOSE 3000

# Run the application
CMD ["npm", "run", "dev"]

