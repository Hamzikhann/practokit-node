'use strict';

module.exports = (sequelize, DataTypes) => {
  const quizSubmission = sequelize.define('quizSubmissions', {
    result: DataTypes.INTEGER,
    totalMarks: DataTypes.INTEGER,
    // attempted: DataTypes.INTEGER,
    wrong: DataTypes.INTEGER,
    totalQuestions: DataTypes.INTEGER,
    timeSpend: DataTypes.INTEGER,
    isActive: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Y'
    },
  }, { timestamps: true });
  quizSubmission.associate = function (models) {
    // associations can be defined here
    quizSubmission.belongsTo(models.quizzes, { foreignKey: { name: "quizzId", allowNull: false }})
    quizSubmission.hasOne(models.quizSubmissionResponse)
  };
  return quizSubmission;
};