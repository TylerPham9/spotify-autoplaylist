# Spotify Autoplaylist

For Spotify Playback features, the account must be a premium account <br/>
After logging in, you need to connect to the Spotify Autoplaylist device through a Spotify App <br/>

## Notable features
- string together public spotify playlists using a graph view
- search and tag songs
- View all playlists available
- view and query tagged songs

## Docker

To build and run the docker image: <br/>
`docker-compose build && docker-compose up`

To take down: <br/>
`docker-compose down` <br/>
if you run the command with `-v` it will delete the db and volume.
### MAKE SURE TO DO A DOCKER-COMPOSE DOWN BETWEEN EACH RESTART TO RESET THE DB

The API can be found at http://localhost:9000/api/
The Client can be found at http://localhost:3000



## To run the client
1. Go to the __client__ folder
2. Run command `npm start`
3. Go to http://localhost:3000



## To run the api

Create a `.env` file with the following variables: <br/>

```
CLIENT_ID =
CLIENT_SECRET=
REDIRECT_URI=http://localhost:9000/callback

```

You can get the `CLIENT_ID` and `CLIENT_SECRET` from https://developer.spotify.com/. Make sure to add the `REDIRECT_URI` to the spotify app

###  `.env` for the given test account:
```
CLIENT_ID=e5895765e39e4fbead571701ba746ec0
CLIENT_SECRET=1b499ace34d34dcd83eb0dcbf89d7a90
REDIRECT_URI=http://localhost:9000/callback
```


1. Go to the __api__ folder
2. Run command `npm start`
4. Run the script `db-setup.sh` to create a Postgres database `spotify` and perform the db migrations and seeding

5. Test the api with `GET http://localhost:9000/api/` <br/>
You should get message like `"Welcome to the Spotify Autoplaylist API!"`



## Spotify Account
Email: `spotifyautoplaylist@gmail.com` <br/>
Password: `spotifycmpt470`


