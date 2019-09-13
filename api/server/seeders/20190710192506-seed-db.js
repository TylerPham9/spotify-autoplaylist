const models = require('../models');
const User = models.User
const Tag = models.Tag
const Song = models.Song

module.exports = {
  up: async (queryInterface, Sequelize) => {
    var user1 = await User.findOne({
      where: {spotifyId: 'f8194xepj85qolydfksrwknf2'},
    });
    var user2 = await User.findOne({
      where: {spotifyId: 'NotARealAccount'},
    });
    if (!user1 || !user2) {
      await queryInterface.bulkInsert('Users', [{
        spotifyId: 'f8194xepj85qolydfksrwknf2',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
      }, {
        spotifyId: 'NotARealAccount',
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
      }], {});
      await queryInterface.bulkInsert('Songs', [{
        spotifyId: '3n3Ppam7vgaVa1iaRUc9Lp',
        name: "Mr. Brightside",
        artist: "The Killers",
        album: "Hot Fuss",
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
      }, {
        spotifyId: '5xPsybHWRHbTYO44xnREY5',
        name: "Love Story",
        artist: "Taylor Swift",
        album: "Fearless",
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
      }, {
        spotifyId: '7MKNP9GEcCj4Vcfw3IerQ6',
        name: "Old Town Road",
        artist: "Lil Nas X",
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
      }], {});
      
      user1 = await User.findOne({
        where: {spotifyId: 'f8194xepj85qolydfksrwknf2'},
      });
      user2 = await User.findOne({
        where: {spotifyId: 'NotARealAccount'},
      });
      
      // Mr Brightside
      const song1 = await Song.findOne({
        where: {id: 1},
      });
  
      // Love Story
      const song2 = await Song.findOne({
        where: {id: 2},
      });
  
      // Old Town Road
      const song3 = await Song.findOne({
        where: {id: 3},
      });
      await queryInterface.bulkInsert('Tags', [{
        name: 'Rock',
        userId: user1.id,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
      }, {
        name: 'Punk',
        userId: user1.id,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
      }, {
        name: 'Country',
        userId: user1.id,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
      }, {
        name: 'Country',
        userId: user2.id,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
      }, {
        name: 'Rap',
        userId: user2.id,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
      }]);
  
      // Rock
      const tag1 = await Tag.findOne({
        where: {id: 1},
      });
      
      // Punk
      const tag2 = await Tag.findOne({
        where: {id: 2},
      });
      // Country
      const tag3 = await Tag.findOne({
        where: {id: 3},
      });
      
      // Country
      const tag4 = await Tag.findOne({
        where: {id: 4},
      });
  
      return await queryInterface.bulkInsert('TaggedSongs', [{
        tagId: tag1.id,
        songId: song1.id,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
      }, {
        tagId: tag2.id,
        songId: song2.id,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
      }, {
        tagId: tag3.id,
        songId: song3.id,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
      }, {
        tagId: tag4.id,
        songId: song3.id,
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
      }], {});
      }
    },
    down: async (queryInterface) => {
      await queryInterface.bulkDelete('Tags', null, {});
      await queryInterface.bulkDelete('Users', null, {});
      await queryInterface.bulkDelete('Songs', null, {});
      await queryInterface.bulkDelete('TaggedSongs', null, {});
    }    


};
