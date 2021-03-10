'use strict';

module.exports = (sequelize, DataTypes) => {
  const questions = sequelize.define('questions', {
    statement: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    points: DataTypes.INTEGER,
    isActive: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Y'
    },
  }, { timestamps: true });
  questions.associate = function (models) {
    // associations can be defined here
    questions.belongsTo(models.questionDifficulties, { name: "questionDifficultiesId", foreignKey: { allowNull: false }})
    questions.belongsTo(models.questionType, { foreignKey: { name: "questionTypeId", allowNull: false }})
    questions.belongsTo(models.courses, { foreignKey: { name: "coursesId", allowNull: false }})
    questions.belongsTo(models.users, { foreignKey: { name: 'createdBy', allowNull: false  } })
    questions.hasMany(models.questionsAttributes)
    questions.hasMany(models.questionsOptions, { foreignKey: { name: "questionsId", allowNull: false }})
    questions.hasMany(models.questionTags)
  };
  return questions;
};