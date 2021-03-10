'use strict';

module.exports = (sequelize, DataTypes) => {
  const roles = sequelize.define('roles', {
    title: DataTypes.STRING,
    isActive: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Y'
    },
  }, { timestamps: true });
  roles.associate = function (models) {
    // associations can be defined here
  };
  return roles;
};