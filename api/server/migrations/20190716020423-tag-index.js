'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('Tags', ['userId', 'name'], {
      type: 'unique',
      name: 'userIdName'
    })
  },

  down: queryInterface => queryInterface.removeConstraint('Tags', 'userIdName')
};
