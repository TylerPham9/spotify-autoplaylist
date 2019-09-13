'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('TaggedSongs', ['songId', 'tagId'], {
      type: 'unique',
      name: 'songIdTagId'
    })

  },

  down: queryInterface => queryInterface.removeConstraint('TaggedSongs', 'songIdTagId')
};
