require('dotenv').config();
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var request = require('request');


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var stateKey = 'spotify_auth_state';

var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret
var redirect_uri = process.env.REDIRECT_URI; // Your redirect uri

class Spotify {
    static login(req, res) {
        var state = generateRandomString(16);
        res.cookie(stateKey, state);

        // your application requests authorization
        var scope = 'user-read-private user-read-email user-read-playback-state';
        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: client_id,
                scope: scope,
                redirect_uri: redirect_uri,
                state: state
            }));
    }
    static callback(req, res) {

        // your application requests refresh and access tokens
        // after checking the state parameter

        var code = req.query.code || null;
        var state = req.query.state || null;
        var storedState = req.cookies ? req.cookies[stateKey] : null;

        // Return to main page if error
        if (state === null || state !== storedState) {
            res.redirect('http:localhost:3000/#' +
                querystring.stringify({
                    error: 'state_mismatch'
                }));
        } else {
            res.clearCookie(stateKey);

            var authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                form: {
                    code: code,
                    redirect_uri: redirect_uri,
                    grant_type: 'authorization_code'
                },
                headers: {
                    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
                },
                json: true
            };

            // Get authorization token
            request.post(authOptions, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var access_token = body.access_token,
                        refresh_token = body.refresh_token;

                    var options = {
                        url: 'https://api.spotify.com/v1/me',
                        headers: { 'Authorization': 'Bearer ' + access_token },
                        json: true
                    };

                    // use the access token to access the Spotify Web API
                    request.get(options, function (error, response, body) {

                        var apiOptions = {
                            url: 'http://localhost:9000/api/users/login',
                            body: { spotifyId: body.id },
                            json: true
                        }
                        // Create user from spotifyId in db or get userId if existing
                        request.post(apiOptions, function (error, response, body) {
                            var userId = response.body.userData.id
                            res.redirect('http://localhost:3000/#' +
                                querystring.stringify({
                                    access_token: access_token,
                                    refresh_token: refresh_token,
                                    userId: userId
                                }))
                        })
                    });

                // we can also pass the token to the browser to make requests from there        
                } else {
                    res.redirect('http:localhost:3000/#' +
                        querystring.stringify({
                            error: 'invalid_token'
                        }));
                }
            });
        }
    }
    static refresh_token(req, res) {

        // requesting access token from refresh token
        var refresh_token = req.query.refresh_token;
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
            form: {
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var access_token = body.access_token;
                res.send({
                    'access_token': access_token
                });
            }
        });
    }
}

export default Spotify