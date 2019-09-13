'use strict';
module.exports = (sequelize, DataTypes) => {
  const Song = sequelize.define('Song', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    spotifyId: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    artist: {
      type: DataTypes.STRING,
      allowNull: true
    },
    album: {
      type: DataTypes.STRING,
      allowNull: true
    },

  }, {});
  Song.associate = function(models) {
    // associations can be defined here
    Song.belongsToMany(models.Tag,  {
      through: models.TaggedSong,
      foreignKey: {
        name: 'songId',
        field: 'songId',
        allowNull: true
      }
    })
  };
  return Song;
};