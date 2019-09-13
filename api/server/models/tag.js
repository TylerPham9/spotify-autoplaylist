'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    userId: {
      type: DataTypes.INTEGER,
      onDelete: 'cascade',
      unique: 'userIdName',
      references: {
        model: 'User',
        key: 'id',
        as: 'userId'
      },
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      unique: 'userIdName',
      allowNull: {
        args: false,
        msg: 'Please enter a tag name'
      }
    }
  }, {});
  Tag.associate = function(models) {
    // associations can be defined here
    Tag.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    }),

    Tag.belongsToMany(models.Song,  {
      through: models.TaggedSong,
      foreignKey: {
        name: 'tagId',
        field: 'tagId',
        allowNull: true
      }
    })
  };
  return Tag;
};