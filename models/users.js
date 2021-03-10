'use strict';

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isActive: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Y'
    },
  }, { timestamps: true });
  users.associate = function (models) {
    // associations can be defined here
    users.belongsTo(models.roles, { foreignKey: { name: "roleId", allowNull: false }})
    users.hasMany(models.quizzes, { foreignKey: { name: 'createdBy', allowNull: false  } })
    users.hasMany(models.questions, { foreignKey: { name: 'createdBy', allowNull: false  } })
    users.hasMany(models.tags, { foreignKey: { name: 'createdBy', allowNull: false  } })
  };
  return users;
};