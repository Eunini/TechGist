'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Posts', 'topicId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'topics',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    await queryInterface.removeColumn('Posts', 'topic');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Posts', 'topic', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.removeColumn('Posts', 'topicId');
  }
};
