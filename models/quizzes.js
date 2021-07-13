'use strict';

module.exports = (sequelize, DataTypes) => {
  const quizzes = sequelize.define('quizzes', {
    title: DataTypes.STRING,
    questionTagsIdList: DataTypes.TEXT,
    questionDifficultiesCount: DataTypes.TEXT,
    questionsPool: DataTypes.TEXT,
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
    quizzes.hasMany(models.quizSubmissions, { foreignKey: { name: "quizzId", allowNull: false }})
    quizzes.hasMany(models.assignTo)
  };
  return quizzes;
};