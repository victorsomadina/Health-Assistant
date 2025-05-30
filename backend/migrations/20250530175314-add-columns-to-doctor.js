'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('doctor', 'gender', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('doctor', 'phone', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('doctor', 'gender');
    await queryInterface.removeColumn('doctor', 'phone');
  }
};
