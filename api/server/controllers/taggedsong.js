import model from '../models';

const { TaggedSong, Song, Tag } = model;


class TaggedSongs {
    static create(req, res) {
        const { songId, tagId } = req.body
        return TaggedSong
            .create({
                songId,
                tagId
            })
            .then(tag => res.status(201).send({
                success: true,
                message: `Song ${songId} is tagged with tag ${tagId}`,
                tag
            }))
    }
    static list(req, res) {
        return TaggedSong
            .findAll()
            .then(taggedSongs => res.status(200).send(taggedSongs));
    }

    static delete(req, res) {
        const { tagId, spotifyId } = req.body;
        return Song.findOne({
            where:{spotifyId: spotifyId}
        }).then(song =>{
            TaggedSong.destroy({
                where: {
                    tagId: tagId,
                    songId: song.id
                }
            })
            .then(() => res.status(200).send({
                message: `Song with Tag deleted`
            }))
            .catch(error => res.status(500).send(error));
            })
        }
    

    static bulkCreate(req, res) {
        const songId = req.body.songId;
        const tags = req.body.tags;
        let taggedSongs = tags.map(
            tag => {
                return {
                    songId: songId,
                    tagId: tag
                }
            })
        return TaggedSong
            .bulkCreate(taggedSongs, { ignoreDuplicates: true })
            .then(() =>
                res.status(200).send({
                    message: `Song ${songId} tagged with ${tags}`
                })
            )
    }
}


export default TaggedSongs;