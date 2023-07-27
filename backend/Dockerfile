FROM node:20.5-alpine

# Set working directory
WORKDIR /app

# Copy code to our image
COPY . ./

# Install Dependencies
RUN npm install -production

# Run app
CMD ["npm", "run", "prod"]
