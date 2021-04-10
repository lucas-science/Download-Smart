const express = require('express')
const app = express()
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');
const spotifylogin = require('./controllers/spotify')
const scopes = require('./controllers/scope')
const port = 4000
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

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

})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})