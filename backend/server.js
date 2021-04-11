const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const socketio = require('socket.io');

const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');
const spotifylogin = require('./controllers/spotify')
const scopes = require('./controllers/scope')


const port = 4000
server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))


const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})


io.on("connection", (socket) => {
    console.log("new client connected");

    socket.on('sendmessage', (data) => {
        console.log(data)
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            // Send users and room info
            io.to(user.room).emit('info', "il a été deconnecté");
        }
    });
});

/*

const spotifyApi = new SpotifyWebApi({
    clientId: 'c83236ca0dce47f7a9fe9c5c6a47a5d8',
    clientSecret: 'deae60e658604bef8e55c0226289e529',
    redirectUri: 'http://localhost:4000/callback'
});
app.get('/login', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes.scope));
});

app.get('/callback', spotifylogin.login);
app.get('/test', (req, res, next) => {
    spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
        function(data) {
            console.log('Artist albums', data.body);
        },
        function(err) {
            console.error(err);
        }
    );
})*/