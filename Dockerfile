FROM node:14.5.0

# Create app directory
WORKDIR /srv/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./token_api/package*.json ./
COPY ./token_api/yarn.lock ./

RUN yarn global add nodemon
RUN yarn install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./token_api/ .

RUN yarn cdn

# Expose is NOT supported by Heroku
# EXPOSE $PORT

CMD [ "node", "./src/server.js" ]