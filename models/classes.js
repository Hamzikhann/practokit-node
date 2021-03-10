'use strict';

module.exports = (sequelize, DataTypes) => {
  const classes = sequelize.define('classes', {
    title: DataTypes.STRING,
    isActive: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Y'
    },
  }, {});
  classes.associate = function (models) {
    // associations can be defined here
    classes.hasMany(models.courses)
    classes.belongsTo(models.users, { foreignKey: { name: 'createdBy', allowNull: false }})
  };
  return classes;
};