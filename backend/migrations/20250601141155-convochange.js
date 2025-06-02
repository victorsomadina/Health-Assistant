'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove unique constraint from hospitalId
    await queryInterface.removeConstraint('conversationRecord', 'conversationRecord_doctorId_key'); // Adjust constraint name if different
  },

  down: async (queryInterface, Sequelize) => {
    // Re-add unique constraint (in case of rollback)
    await queryInterface.addConstraint('conversationRecord', {
      fields: ['hospitalId'],
      type: 'unique',
      name: 'conversationRecord_doctorId_key',
    });
  }
};