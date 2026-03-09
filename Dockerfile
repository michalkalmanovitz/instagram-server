FROM node:20-alpine
ENV PORT=5216

RUN addgroup -g 1001 -S digital-group && adduser -S digital -u 1001
USER digital:digital-group

# Specify our working directory, this is in our container/in our image
WORKDIR /app

# Copy the package.jsons from host to container
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Here we install all the deps
RUN npm ci

# Bundle app source / copy all other files
COPY . .

# Build the app to the /dist folder
RUN npm run build

EXPOSE 5216

# Run app
CMD [ "node", "./dist/main.js" ]
