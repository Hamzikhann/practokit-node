'use strict';

module.exports = (sequelize, DataTypes) => {
  const assignTo = sequelize.define('assignTo', {
    isActive: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Y'
    },
  }, { timestamps: true });
  assignTo.associate = function (models) {
    // associations can be defined here
    assignTo.belongsTo(models.users)
    assignTo.belongsTo(models.quizzes)
  };
  return assignTo;
};