'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn('patient', 'knownAllergies', {
      type: Sequelize.TEXT('long'),
      allowNull: true
    });

    await queryInterface.addColumn('patient', 'chronicConditions', {
      type: Sequelize.TEXT('long'),
      allowNull: true
    });

    await queryInterface.addColumn('patient', 'DOB', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('patient', 'knownAllergies');
    await queryInterface.removeColumn('patient', 'chronicConditions');
    await queryInterface.removeColumn('patient', 'DOB');
  }
};
