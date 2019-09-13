import model from '../models';

const { Playlist } = model;

class Playlists {
    static create(req, res) {
        const { name, query, userId } = req.body
        return Playlist
            .create({
                name,
                query,
                userId
            })
            .then(playlist => res.status(201).send({
                success: true,
                message: `The Playlist ${name} has been created`,
                playlist
            }))
    }
    static list(req, res) {
        return Playlist
            .findAll()
            .then(playlists => res.status(200).send(playlists));
    }
    static modify(req, res) {
        const { name, query, userId } = req.body
        return Playlist
            .findByPk(req.params.playlistId)
            .then((playlist) => {
                playlist.update({
                    name: name || playlist.name,
                    query: query || playlist.query,
                    userId: userId || playlist.userId
                })
                .then((updatedPlaylist) => {
                    res.status(200).send({
                        message: 'Playlist updated successfully',
                        data: {
                            name: name || playlist.name,
                            query: query || playlist.query,
                            userId: userId || song.userId
                        }
                    })
                })
                .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    }
      static delete(req, res) {
          return Playlist
            .findByPk(req.params.playlistId)
            .then(playlist => {
              if(!playlist) {
                return res.status(400).send({
                message: 'Playlist Not Found',
                });
              }
              return playlist
                .destroy()
                .then(() => res.status(200).send({
                  message: 'Playlist successfully deleted'
                }))
                .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error))
        }
}

export default Playlists;