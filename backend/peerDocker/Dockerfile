FROM node:8.7.0-alpine
RUN mkdir /peer-server
# WORKDIR /peer-server
# COPY bin ./bin
# COPY dist ./dist
# COPY package.json .
RUN npm install peer -g 
EXPOSE 9000
# ENTRYPOINT ["node", "bin/peerjs"]
CMD [ "peerjs", "--port", "9000", "--key", "peerjs", "--path", "/myapp"]