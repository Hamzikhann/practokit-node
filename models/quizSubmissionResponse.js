'use strict';

module.exports = (sequelize, DataTypes) => {
  const quizSubmissionResponse = sequelize.define('quizSubmissionResponse', {
    response: DataTypes.TEXT,
    isActive: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Y'
    },
  }, { timestamps: true });
  quizSubmissionResponse.associate = function (models) {
    // associations can be defined here
    quizSubmissionResponse.belongsTo(models.quizSubmission, { foreignKey: { name: "quizSubmissionId", allowNull: false }})
  };
  return quizSubmissionResponse;
};