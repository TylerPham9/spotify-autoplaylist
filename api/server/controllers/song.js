import model, { Sequelize } from '../models';

const { Song, Tag } = model;

class Songs {
    static create(req, res) {
        const { name, artist, album, spotifyId } = req.body
        return Song
            .create({
                name,
                artist,
                album,
                spotifyId
            })
            .then(song => res.status(201).send({
                success: true,
                message: `The Song ${name} has been created`,
                song
            })).catch(Sequelize.UniqueConstraintError, function (err) {
                res.status(422).send({
                    success: false,
                    message: err.errors
                })
            }).catch(Sequelize.ValidationError, function (err) {
                res.status(422).send({
                    success: false,
                    message: err.errors
                })
            })
    }
    static list(req, res) {
        return Song
            .findAll()
            .then(songs => res.status(200).send(songs));
    }

    static modify(req, res) {
        const { name, artist, album } = req.body
        return Song
            .findByPk(req.params.songId)
            .then((song) => {
                song.update({
                    name: name || song.name,
                    artist: artist || song.artist,
                    album: album || song.album,
                    spotifyId: spotifyId || song.spotifyId,
                })
                    .then((updatedSong) => {
                        res.status(200).send({
                            message: 'Song updated successfully',
                            data: {
                                name: name || song.name,
                                artist: artist || song.artist,
                                album: album || song.album,
                                spotifyId: spotifyId || song.spotifyId,
                            }
                        })
                    })
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    }
    static delete(req, res) {
        return Song
            .findByPk(req.params.songId)
            .then(song => {
                if (!song) {
                    return res.status(400).send({
                        message: 'Song Not Found',
                    });
                }
                return song
                    .destroy()
                    .then(() => res.status(200).send({
                        message: `Song ${song.name} successfully deleted`
                    }))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error))
    }

    // TODO: Add verification
    // List songs by user, if tags present, use that to filter
    // tags can be a list
    static queryByUser(req, res) {
        const { userId } = req.params
        if (req.query.tags) {
            var tags = JSON.parse(req.query.tags)
        } else {
            var tags = null
        }

        // If tag not given, return all the songs
        var filterBy = {};
        if (tags) {
            filterBy = { name: tags, userId: userId }
        } else { filterBy = { userId: userId } }

        return Song
            //Find all song ids by the user and the tag
            .findAll({
                attributes: ['id'],
                include: [{
                    model: Tag,
                    where: filterBy,
                    attributes: []
                }],
                raw: true
                // Convert the song ids to a list of ids
            }).then(songs => {
                return songs.map(song => song.id)
            })
            .then(ids => {
                // Find all songs with the ids, this is done to retain all the other 
                // tags that the song might have
                // If no ids
                if (ids == []) {
                    res.status(200).send({
                        message: `User does not have any songs with tag ${tags}`
                    })
                }
                return Song.findAll({
                    // Find all songs with those IDs
                    where: { id: { [Sequelize.Op.or]: [ids] } },
                    include: [{
                        model: Tag,
                        // Only get the name of the tag
                        attributes: ['name'],
                        // To ignore the join table
                        through: { attributes: [] }
                    }]
                })
            })
            .then(songs => {
                if (songs.length != 0) {
                    res.status(200).send(songs)
                } else {
                    // If the list of songs is empty
                    if (tags) {
                        var message = `User does not have any songs with tag ${tags}`
                    } else {
                        var message = `User does not have any songs`
                    }
                    res.status(200).send({ message: message })
                }
            });
    }

    static findOrCreate(req, res) {
        const { name, artist, album, spotifyId } = req.body
        return Song.findOrCreate({
            where: { spotifyId: spotifyId },
            defaults: {
                name,
                artist,
                album
            }
        }).then(([song, created]) => {
            if (created) {
                console.log("Song was a created");
                res.status(201).send({
                    success: true,
                    message: 'newSong successfully created',
                    songData: song.dataValues
                })
            } else {
                console.log("Song exists already")
                console.log(song.dataValues);
                res.status(200).send({
                    success: true,
                    message: 'Song data successfully found',
                    songData: song.dataValues
                })
            }
        })
    }
}

export default Songs;