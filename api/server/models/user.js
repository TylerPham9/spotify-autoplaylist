'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    spotifyId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Tag, {
      foreignKey: 'userId',
    });
    User.hasMany(models.Playlist, {
      foreignKey: 'userId',
    });
  };
  return User;
};