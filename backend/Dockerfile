#Using an alpine version of node
FROM node:8.7.0-alpine

#Create app directory and use it as the working directory
RUN mkdir -p /backend
WORKDIR /backend

#Copying the package files from localstorage to image
COPY package.json /backend
COPY package-lock.json /backend

#Installing dependencies
RUN npm install

#Copying all the files from localstorage to image
COPY . /backend

#Expose the port for standalone container
EXPOSE 8080

#Starting the server using nodemon
CMD ["npm","run","start"]