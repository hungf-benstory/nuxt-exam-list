# Use Node.js image to build
FROM node:18-alpine

# Create the application directory inside the container
WORKDIR /usr/src/app

# Remove node_modules, package-lock.json
RUN rm -rf node_modules package-lock.json

# Copy package.json, package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn

# Copy the entire source code to the container
COPY . .

# Build the application for production
RUN yarn build

# Expose the port 3000 
EXPOSE 3000

# Run the Nuxt.js application
CMD [ "yarn", "dev" ]
