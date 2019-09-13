'use strict';
module.exports = (sequelize, DataTypes) => {
  const TaggedSong = sequelize.define('TaggedSong', {
      tagId: {
        type: DataTypes.INTEGER
      },
      songId: {
        type: DataTypes.INTEGER
      }
  }, {});
  TaggedSong.associate = function(models) {
    // associations can be defined here
  };
  return TaggedSong;
};