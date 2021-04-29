'use strict';

module.exports = (sequelize, DataTypes) => {
  const quizzes = sequelize.define('quizzes', {
    questionTagsIdList: DataTypes.TEXT,
    questionDifficultyList: DataTypes.TEXT,
    isActive: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Y'
    },
  }, { timestamps: true });
  quizzes.associate = function (models) {
    // associations can be defined here
    quizzes.belongsTo(models.users, { foreignKey: { name: 'createdBy', allowNull: false  } })
    quizzes.belongsTo(models.courses, { foreignKey: { allowNull: false }})
    quizzes.hasMany(models.quizSubmission, { foreignKey: { name: "quizzId", allowNull: false }})
    quizzes.belongsTo(models.questionType, { foreignKey: { allowNull: false }})
  };
  return quizzes;
};