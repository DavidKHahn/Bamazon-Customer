DROP DATABASE bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (

  itemid INTEGER(50) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(50) not null,
  department_name VARCHAR(50) not null,
  price DECIMAL(10,4) not null,
  stock_quantity INTEGER(10) not null,
  primary key(itemid)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Snickers", "Food and Beverages", 1.00, 1000),
		("Air Force Ones", "Clothing", 100.00, 100),
		("Levi's Jeans", "Clothing", 50.00, 100),
		("Cat Litter", "Pet Goods", 20.00, 150),
		("Leather Bag", "Utility", 100.00, 25),
		("China Plates", "Kitchenware", 100.00, 100.00),
		("Dog Treat", "Pet Goods", 2.00, 250),
		("Ray Bans Sunglasses", "Accessories", 150.00, 100),
		("ON Whey Protein", "Food and Beverages", 50.00, 100),
		("Intelligent Investor", "Books", 20.00, 100);
		
SELECT*FROM bamazon_DB.products;