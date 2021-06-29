'use strict';

module.exports = (sequelize, DataTypes) => {
  const questionType = sequelize.define('questionType', {
    title: DataTypes.STRING,
    isActive: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Y'
    },
  }, { timestamps: true });
  questionType.associate = function (models) {
    // associations can be defined here
  };
  return questionType;
};