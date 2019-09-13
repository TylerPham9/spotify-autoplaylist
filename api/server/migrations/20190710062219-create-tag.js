'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        unique: 'userIdName',
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
        },
        allowNull: false

      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: 'userIdName'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: queryInterface /* , Sequelize */ => queryInterface.dropTable('Tags')
};