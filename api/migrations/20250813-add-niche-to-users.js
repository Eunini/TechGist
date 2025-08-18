import { DataTypes } from 'sequelize';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('Users', 'niche', {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: [['web-dev', 'mobile-dev', 'game-dev', 'cloud', 'cybersecurity', 'web3', 'ai-ml', 'devops', 'data-science', 'ui-ux']],
    },
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('Users', 'niche');
};
