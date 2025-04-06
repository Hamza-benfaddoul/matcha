# Use the official Node.js image.
FROM node:20.16.0-alpine

# install nodemon
RUN npm i -g nodemon

# Set the working directory.
WORKDIR /app/backend

# Install dependencies.
COPY ./backend/package*.json ./
RUN npm install

# Expose the port on which the app will run.
EXPOSE 5000

# Command to run the app.
CMD ["npm", "run", "dev"]
