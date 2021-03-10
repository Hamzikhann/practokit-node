'use strict';

module.exports = (sequelize, DataTypes) => {
  const questionDifficulties = sequelize.define('questionDifficulties', {
    title: DataTypes.STRING,
    isActive: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Y'
    },
  }, { timestamps: true });
  questionDifficulties.associate = function (models) {
    // associations can be defined here
    questionDifficulties.hasMany(models.questions, { name: "questionDifficultiesId", foreignKey: { allowNull: false }}),
    questionDifficulties.belongsTo(models.users, { foreignKey: { name: 'createdBy', allowNull: false } })
  };
  return questionDifficulties;
};