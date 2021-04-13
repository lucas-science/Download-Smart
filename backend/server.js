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
        const dir = '/musique';

        // create new directory
        fs.mkdir(__dirname + dir, (err) => {
            if (err) {
                throw err;
            }
            console.log("Directory is created.");
            for (let i = 0; i < musique_data.length; i++) {
                console.log(i)
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

    });
    socket.on('disconnect', () => {
        console.log("User disconnect")
    });
});

app.use('/test', async(req, res, next) => {
    zl.archiveFolder(__dirname + "/musique", __dirname + "/musique2.zip").then(function() {
        console.log("done");
        res.download(__dirname + '/musique2.zip');
        res.status(200);
        fs.rmdir(__dirname + "/musique", { recursive: true }, (err) => {
            if (err) {
                throw err;
            }
            console.log(`is deleted!`);
        });
        fs.rmdir(__dirname + "/musique2.zip", { recursive: true }, (err) => {
            if (err) {
                throw err;
            }
            console.log(` is deleted!`);
        });
    }, function(err) {
        console.log(err);
    });
});