import model, { Sequelize } from '../models';

const { Tag, Song } = model;

class Tags {
    static create(req, res) {
        const { name, userId } = req.body
        return Tag
            .create({
                name,
                userId
            })
            .then(tag => res.status(201).send({
                success: true,
                message: `The tag ${name} has been created by ${userId}`,
                tag
            })).catch(Sequelize.UniqueConstraintError, function (err) {
                res.status(422).send({
                    success: false,
                    message: 'Tag is not Unique'
                })
            }).catch(Sequelize.DatabaseError, function (err) {
                res.status(500).send({
                    success: false,
                    message: err.errors
                })
            })
    }
    static list(req, res) {
        return Tag
            .findAll()
            .then(tags => res.status(200).send(tags));
    }
    static modify(req, res) {
        const { name } = req.body
        return Tag
            .findByPk(req.params.tagId)
            .then((tag) => {
                tag.update({
                    name: name || tag.name,
                }).then((updatedTag) => {
                    res.status(200).send({
                        message: 'Tag updated successfully',
                        data: {
                            name: name || tag.name,
                        }
                    })
                }).catch(error => res.status(400).send(error));
            }).catch(error => res.status(400).send(error));
    }
    static delete(req, res) {
        return Tag
            .findByPk(req.params.tagId)
            .then(tag => {
                if (!tag) {
                    return res.status(400).send({
                        message: 'Tag Not Found',
                    });
                }
                return tag
                    .destroy()
                    .then(() => res.status(200).send({
                        message: `Tag ${tag.name} successfully deleted`
                    }))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error))
    }

    static listByUser(req, res) {
        // const { userId } = req.params
        const userId = req.user.id
        return Tag
            .findAll({
                where: { userId: userId },
            })
            .then(tags => res.status(200).send(tags));
    }

    static listBySong(req, res) {
        const spotifyId = req.params.songId;
        const userId = req.user.id;
        return Tag.findAll({
            attributes: ['id','name'],
            where: {userId: userId},
            include: [{
                model: Song,
                where: {spotifyId: spotifyId}
            }]
        })
        .then(tags => res.status(200).send(tags));
    }
}

export default Tags;