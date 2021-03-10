'use strict';

module.exports = (sequelize, DataTypes) => {
  const questionsOptions = sequelize.define('questionsOptions', {
    title: DataTypes.STRING,
    image: DataTypes.TEXT,
    imageSource: DataTypes.STRING,
    correct: DataTypes.BOOLEAN,
    isActive: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Y'
    },
  }, { timestamps: true });
  questionsOptions.associate = function (models) {
    // associations can be defined here
    questionsOptions.belongsTo(models.questions, { foreignKey: { name: "questionsId", allowNull: false }})
  };
  return questionsOptions;
};