'use strict';

module.exports = (sequelize, DataTypes) => {
  const questionTags = sequelize.define('questionTags', {
    isActive: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Y'
    },
  }, { timestamps: true });
  questionTags.associate = function (models) {
    // associations can be defined here
    questionTags.belongsTo(models.questions)
    questionTags.belongsTo(models.tags, { foreignKey: { name: "tagsId", allowNull: false }})
  };
  return questionTags;
};