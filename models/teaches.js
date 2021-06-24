'use strict';

module.exports = (sequelize, DataTypes) => {
  const teaches = sequelize.define('teaches', {
    isActive: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Y'
    },
  }, { timestamps: true });
  teaches.associate = function (models) {
    // associations can be defined here
    teaches.belongsTo(models.courses)
    teaches.belongsTo(models.users)
  };
  return teaches;
};  