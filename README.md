<p align="center"><img src="https://github.com/bhumijgupta/DALP/raw/master/assets/DALP-logo.png" alt="DALP logo"/></p>
<p align="center">DALP is a swiss army knife solution for distant real time academic learning</p>

## Features

- Real time WebRTC based teaching solution
- Automatic lecture notes generation
- In built proctoring support
- Equipped with functionality to take quizzes/assesments
- Support for students with low bandwidth connection, i.e. **low bandwidth mode**
- Automatic transcript generation

## What is low bandwidth mode

Most of the students are not endowed with a high bandwidth internet connection. These students are then particularly not able to take advantage of realtime online classes. Low bandwidth mode solves this problem by -

- Sending stil images from the live stream every 3 seconds instead of full stream
- To account for lost audio, live transcription will of teacher will be sent to user

## Tech Stack used

1. NodeJS
2. React JS
3. Python
4. Azure - Cognitive Services and Functions
5. MongoDB

## Aditional Info

1. [DALP pitch ppt](https://docs.google.com/presentation/d/16YCmMV2YsVV7RM8i6hxq74m41vX9nmcNBcpOttAk0nY/edit?usp=sharing)
2. [DALP demo URL](https://youtu.be/bHOUIv7PNXY)

## Running the project locally

1. Deploy the azure function
2. Start the backend servers
   - Set mongoDB URI in config folder

```cmd
cd backend
npm install -g peer
peerjs --port 9000 --key peerjs --path /myapp
npm run start
npm run socket
```

3. Start the front end server

```cmd
cd website
npm run start
```

4. Go to [http://localhost:3000](http://localhost:3000) for the kick of awesomeness

## Developed by

This platform is proudly made by team `unpaid_interns`

- [Allandhir Megharaj](https://github.com/allandhir/)
- [Aditya Chandak](https://github.com/adityachandak287)
- [Bhumij Gupta](https://github.com/bhumijgupta)
- [Yash Mehrota](https://github.com/YashMeh)

## License

MIT License
