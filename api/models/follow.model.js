import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Follow = sequelize.define('Follow', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  followerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  followingId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
}, {
  timestamps: true,
});

Follow.associate = (models) => {
  Follow.belongsTo(models.User, { as: 'Follower', foreignKey: 'followerId' });
  Follow.belongsTo(models.User, { as: 'Following', foreignKey: 'followingId' });
};

export default Follow;
