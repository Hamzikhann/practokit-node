'use strict';

module.exports = (sequelize, DataTypes) => {
  const tags = sequelize.define('tags', {
    title: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
    isActive: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Y'
    },
  }, { timestamps: true });
  tags.associate = function (models) {
    // associations can be defined here
    tags.belongsTo(models.courses, { foreignKey: { name: "courseId", allowNull: false }})
    tags.belongsTo(models.users, { foreignKey: { name: 'createdBy', allowNull: false  } })
    tags.hasMany(models.questionTags, { foreignKey: { name: "tagsId", allowNull: false }})
  };
  return tags;
};