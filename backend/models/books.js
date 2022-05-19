'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Books extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Books.belongsTo(models.Categories, {
        foreignKey: 'categoryId',
        onDelete: 'CASCADE',
      });
    }
  }
  Books.init(
    {
      name: DataTypes.STRING,
      author: DataTypes.STRING,
      price: DataTypes.STRING,
      availability: DataTypes.BOOLEAN,
      publication: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Books',
    }
  );
  return Books;
};
