'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Movie.hasMany(models.Order,{
        foreignKey:'idMovie'});
  };

}
  Movie.init({
    title: DataTypes.STRING,
    idMovie: DataTypes.INTEGER,
    poster_path: DataTypes.STRING,
    genre: DataTypes.STRING
  }, 
  {
    sequelize,
    modelName: 'Movie',
  }
  );
  return Movie;
};