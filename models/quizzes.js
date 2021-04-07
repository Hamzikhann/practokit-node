'use strict';

module.exports = (sequelize, DataTypes) => {
  const quizzes = sequelize.define('quizzes', {
    questionsCount: DataTypes.INTEGER,
    questionTagsIdList: DataTypes.STRING,
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
    quizzes.hasMany(models.quizSubmission, { foreignKey: { name: "quizId", allowNull: false }})
    quizzes.belongsTo(models.questionDifficulties, { foreignKey: { allowNull: false }})
    quizzes.belongsTo(models.questionType, { foreignKey: { allowNull: false }})
  };
  return quizzes;
};