FROM node:14.1-alpine

ENV CI=true

WORKDIR /code

COPY package.json package-lock.json /code/

RUN npm ci

# Copy app source code
COPY . .

#Expose port and start application
EXPOSE 3000
CMD ["npm", "start"]