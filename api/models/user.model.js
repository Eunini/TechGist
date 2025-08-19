import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'local', // 'local' | 'google' (future: github, etc.)
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profilePicture: {
    type: DataTypes.STRING,
    defaultValue: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
  },
  bio: {
    type: DataTypes.TEXT,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',
    validate: {
      isIn: [['user', 'contributor', 'admin']],
    },
  },
  niche: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: [['web-dev', 'mobile-dev', 'game-dev', 'cloud', 'cybersecurity', 'web3', 'ai-ml', 'devops', 'data-science', 'ui-ux']],
    },
  },
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.email) {
        user.email = user.email.toLowerCase();
      }
      if (user.password) {
        try {
          if (process.env.DEBUG_SIGNUP === 'true') {
            console.log('[user][beforeCreate] hashing password (len=%d)', user.password.length);
          }
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        } catch (e) {
          console.error('[user][hash][error][create]', e.message);
          throw e;
        }
      } else if (process.env.DEBUG_SIGNUP === 'true') {
        console.warn('[user][beforeCreate] empty password field');
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('email') && user.email) {
        user.email = user.email.toLowerCase();
      }
      if (user.changed('password')) {
        try {
          if (process.env.DEBUG_SIGNUP === 'true') {
            console.log('[user][beforeUpdate] hashing updated password');
          }
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        } catch (e) {
          console.error('[user][hash][error][update]', e.message);
          throw e;
        }
      }
    },
  },
});

User.prototype.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
}

export default User;
