# DALP backend

## Installation

`npm install`

## Setting up

- Create a config folder in backend/
- Create dev.json or test.json file based on your usecase
- Add the following code to dev/test.json

`{"dbURI":"YOUR DATABASE URI"}`

## Running the peer.js server

```cmd
npm install -g peer
peerjs --port 9000 --key peerjs --path /myapp
```

## Running the main server

`npm start`

## Running the socket server

`npm run socket`

**Note**: All the three servers are required for proper functioning of the website

## Testing

`npm test`
