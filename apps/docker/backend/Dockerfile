# Use the official Node.js image.
FROM node:20.16.0-alpine

# Expose the port on which the app will run.
EXPOSE 5000

# install nodemon
RUN npm i -g nodemon

# Set the working directory.
WORKDIR /app/backend

# Install dependencies.
COPY ./backend/package*.json ./
RUN npm install

COPY ./backend/entrypoint /entrypoint
RUN chmod +x /entrypoint

ENTRYPOINT ["/entrypoint"]

