# Setup
Ensure that you have Postgresql installed. The api uses `postgres` as for both user and password

After using `npm install`, use `db-setup.sh`. The script will create a database called `spotify` and migrate/seed

Api can be accessed at http://localhost:9000/

## GET
[/api/users](http://localhost:9000/api/users) <br/>
Gets a list of all users

[/api/tags](http://localhost:9000/api/tags) <br/>
Gets a list of all tags

[/api/tags/user/{:userId}](http://localhost:9000/api/tags/user) <br/>
Gets a list of `userId`'s tags <br/>
Requires: `userId` <br/>

[/api/taggedsongs](http://localhost:9000/api/taggedsongs) <br/>
Gets a list of all tagged songs

[/api/playlists](http://localhost:9000/api/playlists) <br/>
Gets a list of all playlists

[/api/songs](http://localhost:9000/api/songs) <br/>
Gets a list of all songs

[/api/songs/user/{:userId}](http://localhost:9000/api/songs/user/) <br/>
Gets a list of `userId`'s songs, can filter by tag <br/>
Requires: `userId` <br/>
Optional: `tags` <br/>

Example Request:
```
http://localhost:9000/api/songs/user/1/?tags=["Rock","Country"]
```


## POST
[/api/users/create](http://localhost:9000/api/users/create) <br/>
Create a new user <br/>
Requires: `spotifyId` <br/>

[/api/tags/create](http://localhost:9000/api/tags/create) <br/>
Create a new tag <br/>
Requires: `name`, `userId` <br/>

[/api/songs/create](http://localhost:9000/api/songs/create) <br/>
Create a new song <br/>
Requires: `name`, `spotifyId` <br/>

[/api/taggedsongs/create](http://localhost:9000/api/taggedsongs/create) <br/>
Create a new tagged song <br/>
Requires: `songId`, `tagId` <br/>

[/api/playlists/create](http://localhost:9000/api/playlists/create) <br/>
Create a new playlist <br/>
Requires: `name`, `userId` <br/>


## PUT
[/api/tags/:tagId](http://localhost:9000/api/tags/:tagId) <br/>
Edit a tag <br/>
Requires: `tagId` <br/>

[/api/songs/:songId](http://localhost:9000/api/songs/:songId) <br/>
Edit a song <br/>
Requires: `songId` <br/>

[/api/taggedsongs/:taggedsongId](http://localhost:9000/api/taggedsongs/:taggedsongId) <br/>
Edit a tagged song <br/>
Requires: `taggedSongId` <br/>

[/api/playlists/:playlistId](http://localhost:9000/api/playlists/:playlistId) <br/>
Edit a playlist <br/>
Requires: `playlistId` <br/>


## DELETE
[/api/tags/:tagId](http://localhost:9000/api/tags/:tagId) <br/>
Delete a tag <br/>
Requires: `tagId` <br/>

[/api/songs/:songId](http://localhost:9000/api/songs/:songId) <br/>
Delete a song <br/>
Requires: `songId` <br/>

[/api/taggedsongs/:taggedsongId](http://localhost:9000/api/taggedsongs/:taggedsongId) <br/>
Delete a tagged song <br/>
Requires: `taggedSongId` <br/>

[/api/playlists/:playlistId](http://localhost:9000/api/playlists/:playlistId) <br/>
Delete a playlist <br/>
Requires: `playlistId` <br/>

