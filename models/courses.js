'use strict';

module.exports = (sequelize, DataTypes) => {
  const courses = sequelize.define('courses', {
    title: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
    isActive: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Y'
    },
  }, { timestamps: true });
  courses.associate = function (models) {
    // associations can be defined here
    courses.belongsTo(models.classes, { foreignKey: { name: "classId", allowNull: false }})
    courses.belongsTo(models.users, { foreignKey: { name: 'createdBy', allowNull: false  } })
    courses.hasMany(models.quizzes)
    courses.hasMany(models.questions, { foreignKey: { name: "coursesId", allowNull: false }})
    courses.hasMany(models.tags, { foreignKey: { name: "courseId", allowNull: false }})
  };
  return courses;
};  