'use strict';

module.exports = (sequelize, DataTypes) => {
  const classes = sequelize.define('classes', {
    title: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
    isActive: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Y'
    },
  }, {});
  classes.associate = function (models) {
    // associations can be defined here
    classes.hasMany(models.courses, { foreignKey: { name: "classId", allowNull: false }})
    classes.belongsTo(models.users, { foreignKey: { name: 'createdBy', allowNull: false }})
  };
  return classes;
};