'use strict';

module.exports = (sequelize, DataTypes) => {
  const questionsAttributes = sequelize.define('questionsAttributes', {
    statementImage: DataTypes.TEXT,
    statementImageSource: DataTypes.STRING,
    hint: DataTypes.TEXT,
    hintFile: DataTypes.TEXT,
    hintFileSource: DataTypes.STRING,
    solutionFile: DataTypes.TEXT,
    solutionFileSource: DataTypes.STRING,
    isActive: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Y'
    },
  }, { timestamps: true });
  questionsAttributes.associate = function (models) {
    // associations can be defined here
    questionsAttributes.belongsTo(models.questions, { name: "questionsId", foreignKey: { allowNull: false }})
  };
  return questionsAttributes;
};