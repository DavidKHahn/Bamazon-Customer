var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_DB"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connection is successful");
    console.log("\nWelcome to Bamazon - Manager Ver.\n");
    start();
});


function start() {
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "Select Option Below",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit"
            ]
        }
    ])
        .then(function (response) {
            switch (response.options) {
                case "View Products for Sale":
                    viewProducts();
                    break;

                case "View Low Inventory":
                    viewLowInventory();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    addProduct();
                    break;

                case "Exit":
                    process.exit();
                    break;
            }
        });
};
function viewProducts() {
    connection.query("SELECT * FROM products", function (err, data) {
        if (err) throw err;
        for (var i = 0; i < data.length; i++) {
            console.log(data[i].itemid + " | " + data[i].department_name + " | " + data[i].product_name + " | " + data[i].price + " | " + data[i].stock_quantity + " | ");
        }
        start();
    });
};
function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity<=5", function (err, data) {
        if (err) throw err;
        for (var i = 0; i < data.length; i++) {
            console.log(data[i].itemid + " | " + data[i].department_name + " | " + data[i].product_name + " | " + data[i].price + " | " + data[i].stock_quantity + " | ");
        }
        start();
    });
};
function addInventory() {
    connection.query("SELECT * FROM products", function (err, data) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Choose item to Update Inventory",
                name: "update",
                type: "list",
                choices: function () {
                    var updateArray = [];
                    for (var i = 0; i < data.length; i++) {
                        updateArray.push(data[i].itemid + " | " + data[i].product_name);
                    }
                    return updateArray;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "Enter quantity to add: ",
                valide: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
            .then(function (answer) {
                var itemArr = (answer.choice).split("-");
                var id = parseInt(itemArr[0]);
                var chosenItem;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].itemid === id) {
                        chosenItem = data[i];
                    }
                }
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: chosenItem.stock_quantity + parseInt(answer.quantity)
                        },
                        {
                            itemid: chosenItem.itemid
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        console.log(answer.quantity + " units have been added to " + chosenItem.product_name);
                        start();
                    }
                );
            });
    });
};
function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "product_name",
            message: "Enter Product Name: "
        },
        {
            type: "input",
            name: "department_name",
            message: "Enter Department: "
        },
        {
            type: "input",
            name: "price",
            message: "Enter Item Price: ",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;

                }
                return false;
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "Enter Quantity: ",
            valide: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
        .then(function (answer) {
            connection.query("INSERT INTO products SET ?",
                {
                    product_name: answer.product_name,
                    department_name: answer.department_name,
                    price: answer.price,
                    stock_quantity: answer.quantity
                },
                function (error) {
                    console.log(answer.product_name + " has been added onto Bamazon.");
                    start();
                }
            );
        })
}