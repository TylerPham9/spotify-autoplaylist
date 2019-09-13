import model, { Sequelize } from '../models';

const { User } = model;

class Users {
  static signUp(req, res) {
    const { name, spotifyId } = req.body
    return User
      .create({
        name,
        spotifyId
      })
      .then(userData => res.status(201).send({
        success: true,
        message: 'User successfully created',
        userData
      })).catch(Sequelize.ValidationError, function (err) {
        res.status(422).send({
          success: false,
          message: err.errors
        })
      })
  }

  static loginOrCreate(req, res) {
    const { spotifyId } = req.body
    return User.findOrCreate({
      where: {
        spotifyId: spotifyId
      }
    }).then(([user, created]) => {
      if (created) {
        console.log("User was a created");
        console.log(user.dataValues);

        res.status(201).send({
          success: true,
          message: 'User successfully created',
          userData: user.dataValues
        })
      } else {
        console.log("User exists already")
        console.log(user.dataValues);
        res.status(200).send({
          success: true,
          message: 'User data successfully logged in',
          userData: user.dataValues
        })
      }
    })
  }

  static list(req, res) {
    return User
      .findAll()
      .then(users => res.status(200).send(users));
  }
}

export default Users;