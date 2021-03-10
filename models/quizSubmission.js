'use strict';

module.exports = (sequelize, DataTypes) => {
  const quizSubmission = sequelize.define('quizSubmission', {
    result: DataTypes.INTEGER,
    isActive: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Y'
    },
  }, { timestamps: true });
  quizSubmission.associate = function (models) {
    // associations can be defined here
    quizSubmission.belongsTo(models.quizzes, { foreignKey: { name: "quizzId", allowNull: false }})
    quizSubmission.hasMany(models.quizSubmissionResponse)
  };
  return quizSubmission;
};