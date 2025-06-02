'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('conversationRecord', 'purpose', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('conversationRecord', 'notes', {
      type: Sequelize.TEXT('long'),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('conversationRecord', 'purpose');
    await queryInterface.removeColumn('conversationRecord', 'notes');
  }
};
