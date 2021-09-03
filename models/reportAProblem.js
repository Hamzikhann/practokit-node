'use strict';

module.exports = (sequelize, DataTypes) => {
  const reportAProblem = sequelize.define('reportAProblem', {
    subject: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'not-fixed'
    },
    isActive: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Y'
    },
  }, { timestamps: true });
  reportAProblem.associate = function (models) {
    // associations can be defined here
    reportAProblem.belongsTo(models.users, { foreignKey: { name: "createdBy", allowNull: false }})
  };
  return reportAProblem;
};