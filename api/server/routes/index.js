import Users from '../controllers/user';
import Tags from '../controllers/tag';
import Songs from '../controllers/song';
import TaggedSongs from '../controllers/taggedsong';
import Playlists from '../controllers/playlist';

export default (app) => {

  const authCheck = (req, res, next) => {
    if (!req.user) {
      res.status(401).json({
        authenticated: false,
        message: "user has not been authenticated"
      });
    } else {
      next();
    }
  };

  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Spotify Autoplaylist API!',
  }));

  // TODO REMOVE THIS LATER
  app.get('/api/authcheck', authCheck, (req, res) => {
    res.status(200).send({
      message: `Welcome to the Spotify Autoplaylist API with user ${req.user.id}`,
    })
  });

  app.post('/api/users/login', Users.loginOrCreate);
  app.post('/api/users/create', Users.signUp); // API route for user to signup
  app.get('/api/users', Users.list); // API route for getting all users

  app.post('/api/tags/create', authCheck, Tags.create); // API route for user to create a tag
  app.get('/api/tags/all', authCheck, Tags.list); // API route for user to get all tags in the database
  app.put('/api/tags/:tagId', authCheck, Tags.modify); // API route for user to edit a tag
  app.delete('/api/tags/:tagId', authCheck, Tags.delete); // API route for user to delete a tag
  // TODO: Add verification
  app.get('/api/tags/user/:userId', authCheck, Tags.listByUser); // API route to view all tags by user
  app.get('/api/tags/', authCheck, Tags.listByUser); // API route to view all tags by user
  app.get('/api/tags/song/:songId', authCheck, Tags.listBySong); // API route to view all tags by user

  app.post('/api/songs/create', authCheck, Songs.findOrCreate); // API route for user to create a song
  app.get('/api/songs/all', authCheck, Songs.list); // API route for user to get all songs in the database
  app.put('/api/songs/:songId', authCheck, Songs.modify); // API route for user to edit a song
  app.delete('/api/songs/:songId', authCheck, Songs.delete); // API route for user to delete a song

  // TODO: Add verification
  app.get('/api/songs/user/:userId', authCheck, Songs.queryByUser); // API route to view all songs by user with a tag query
  // app.get('/api/songs/', heck, Songs.queryByUser); 

  app.post('/api/taggedsongs/create', authCheck, TaggedSongs.create); // API route for user to create a taggedsong
  app.post('/api/taggedsongs/bulkcreate', authCheck, TaggedSongs.bulkCreate); // API route for user to create a taggedsong
  app.get('/api/taggedsongs', authCheck, TaggedSongs.list); // API route for user to get all taggedsongs in the database
  app.delete('/api/taggedsongs/delete', authCheck, TaggedSongs.delete); // API route for user to delete a taggedsong

  app.post('/api/playlists/create', authCheck, Playlists.create); // API route for user to create a playlist
  app.get('/api/playlists/all', authCheck, Playlists.list); // API route for user to get all playlists in the database
  app.put('/api/playlists/:playlistId', authCheck, Playlists.modify); // API route for user to edit a playlist
  app.delete('/api/playlists/:playlistId', authCheck, Playlists.delete); // API route for user to delete a playlist
  // app.get('/api/playlists/', authCheck, Playlists.listByUser);
};