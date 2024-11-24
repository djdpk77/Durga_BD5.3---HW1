const { DataTypes, sequelize } = require('./../lib/index');

let post = sequelize.define('post', {
  title: DataTypes.STRING,
  content: DataTypes.STRING,
  author: DataTypes.STRING,
});

module.exports = { post };
