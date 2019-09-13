'use strict';
module.exports = (sequelize, DataTypes) => {
  const Playlist = sequelize.define('Playlist', {
    name: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter a playlist name'
      }
    }, 
    query: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Please enter a query'
      }
    }, 
    userId: {
      type: DataTypes.INTEGER,
      onDelete: 'cascade',
      references: {
        model: 'User',
        key: 'id',
        as: 'userId'
      }
    }
  }, {});
  Playlist.associate = function(models) {
    // associations can be defined here
    Playlist.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    })
  };
  return Playlist;
};