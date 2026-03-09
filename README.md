# Logmar NestJS Template

## Getting started

Congratulations! You don't have to start from scratch. \
We've got quite a few things set up for you already. \
All you have to do is configure a few things and you're good to go.

1. Environment variables \
  Create a `.env` file in the root of the project, using `.env.example`. \
  Read more about environment variables [here](#environment-variables).

2. Install dependencies \
  Run `npm ci` to install all the dependencies according to `package-lock.json`, which kinda guarantees it to succeed.

3. Start the application \
  Run `npm start` to start the application and make sure it actually works. \
  Remember that if your DB is on AWS, you need to be connected to the VPN. 
   
4. Update metadata \
  Go to `package.json` and update the metadata to match your project. \
  Update Swagger metadata in `src/core/swagger/swagger.ts`. \
  Update this README file to match your project, make sure to keep ["Common topics"](#common-topics).

## About the template

### Contents
- NestJS
  - CLI
  - Throttler
  - CORS
  - Logger
  - Helmet
  - Compression
  - Swagger
- TypeORM
- Click authentication
- Environment variable validation (via Joi)
- ESLint
- Prettier
- Docker & Docker Compose (with local DB)

## Common topics

### Environment variables
Whenever you add a new environment variable, go to `src/core/config/config.module.ts` and add a validation for it. \
This way, the application will not start if the environment variable is not set. \
If you want to update an existing environment variable, make sure to update the validation as well, and the `.env.example` file too.

### Organization APIs
When trying to access an organization API, you need an access token. \
You can get an access token by using the `AzureAccessTokenProvider` class.

### Docker
This project has a `Dockerfile` and a `docker-compose.yml` file. \
You can use them to run the application in a container, which helps to debug production bugs. \
First, make sure to have Docker installed on your machine. \
Then, run `docker compose up --build` to start the application. \
By default, the application will connect to a local DB. \
If you want to connect to a different DB, you can change the `DB_` environment variables in the `docker-compose.yml` file.