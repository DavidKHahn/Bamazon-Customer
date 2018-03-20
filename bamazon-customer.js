//installing npm packages: mysql, inquirer in order to store into sequel pro database.
//installing inquirer in order to properly adminster npm commands
var mysql = require("mysql");
var inquirer = require("inquirer");
//creating connection to mysql
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon_DB"
})
//connecting user to mysql database and starting first function to initialize purchase setup for Bamazon
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connection is successful");
    readTable();
})
//first function which lists items for sale
    function readTable(){
    console.log("\n  WELCOME TO BAMAZON!  \n");
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].itemid + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].price + " | " + res[i].stock_quantity + " | ");
            console.log("-------------------------------------------------");
        }
        purchaseItem(res);
    })
}
//2nd function allowing user to pick out their item to buy
function purchaseItem(res) {
    inquirer.prompt([{
        type: 'input',
        name: 'choice',
        message: "Which item would you like to buy (Please type your selection)? [Press 'X' to exit]"
    }]).then(function(answer) {
        var correct = false;
        //if user decides to stop shopping then X will allow them to exit the terminal
        if(answer.choice.toUpperCase()=="X"){
            process.exit();
        }
        for (var i = 0; i < res.length; i++) {
            //if product name equals to one of the selections then returns true for purchase
            if (res[i].product_name == answer.choice) {
                correct = true;
                //product = choice the buyer made
                var product = answer.choice;
                //id of the item
                var id = i;
                //asks user how many of the item which they chose they would like to purchase
                inquirer.prompt({
                    type: "input",
                    name: "quantity",
                    message: "How many would you like to buy?",
                    //validate function below checks to see if the value inputted is a number
                    validate: function (value) {
                        if (isNaN(value) == false) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }).then(function (answer) {
                    //if number isn't less than stock quantity then the purchase is allowed to happen as well as updating the database minus the quantity purchased
                    if ((res[id].stock_quantity-answer.quantity) > 0) {
                        connection.query("UPDATE products SET stock_quantity=' " + (res[id].stock_quantity-answer.quantity) + "' WHERE product_name='" + product + "'", function (err, res2) {
                            console.log("Thank you for your purchase!");
                            purchaseItem(res);
                        })
                    } else { 
                        //if product is sold out or less than quantity wanting to purchase then console log below
                        console.log("Insufficient quantity!");
                        purchaseItem(res);
                }
            })
        }
    }
    //if customer chooses a selection not within bamazon then console log will load and return user to purchaseItem
   if (i == res.length && correct == false) {
       console.log("Item does not exist in store");
       purchaseItem(res);   
   }
})
}

