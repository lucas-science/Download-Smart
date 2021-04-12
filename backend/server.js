const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const socketio = require('socket.io');
const fs = require('fs');
const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const path = require('path');
const zl = require("zip-lib");
const cors = require('cors')
const bodyParser = require('body-parser');



const port = 4000
server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true
    })
);


const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    console.log("new client connected");

    socket.on('sendmessage', async(url) => {
        const playlist = await ytpl(url);
        const playlistItem = playlist.items

        socket.emit('listmusique', playlistItem)
        const musique_data = []
        for (let i = 0; i < playlistItem.length; i++) {
            musique_data.push({ titre: playlistItem[i].title, url: playlistItem[i].url })
        }

        let downloaded = []
        for (let i = 0; i < musique_data.length; i++) {
            const dl = ytdl(musique_data[i].url)
            dl.on('end', function(val) {
                console.log("Dowloaded " + i)
                downloaded.push(i)
                socket.emit('telecharger', i)
                if (downloaded.length === playlistItem.length) {
                    console.log('la')
                    socket.emit('dl-activate', true)
                }
            });
            dl.pipe(fs.createWriteStream(__dirname + "/musique/" + musique_data[i].titre + ".mp3"));
        }
    });
    socket.on('disconnect', () => {
        console.log("User disconnect")
    });
});

app.use('/test', async(req, res, next) => {
    zl.archiveFolder(__dirname + "/musique", __dirname + "/muisque2.zip").then(function() {
        console.log("done");
        res.download(__dirname + '/muisque2.zip');
        res.status(200);
    }, function(err) {
        console.log(err);
    });
});


/*

const spotifyApi = new SpotifyWebApi({
    clientId: 'c83236ca0dce47f7a9fe9c5c6a47a5d8',
    clientSecret: 'deae60e658604bef8e55c0226289e529',
    redirectUri: 'http://localhost:4000/callback'
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