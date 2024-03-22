const Product = require("./Product");
const Category = require("./Category");
const Tag = require("./Tag");
const ProductTag = require("./ProductTag");

Product.belongsTo(Category, {
  foreignKey: "category_id",
});

Category.hasMany(Product, {
  foreignKey: "category_id",
  onDelete: "CASCADE",
});

Products.belongsToMany(Tag, {
  through: ProductTag,
});

Tag.belongsToMany(Product, {
  foreignKey: ProductTag,
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
