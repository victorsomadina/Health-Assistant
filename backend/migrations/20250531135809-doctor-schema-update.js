'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove unique constraint from hospitalId
    await queryInterface.removeConstraint('doctor', 'doctor_hospitalId_key'); // Adjust constraint name if different
  },

  down: async (queryInterface, Sequelize) => {
    // Re-add unique constraint (in case of rollback)
    await queryInterface.addConstraint('doctor', {
      fields: ['hospitalId'],
      type: 'unique',
      name: 'doctor_hospitalId_key', // Same name used above
    });
  }
};