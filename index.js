const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");


//Configure View Engine
app.set('view engine', 'ejs');

//Establishing Connection to database
var connection = mysql.createConnection({
    host: "sql12.freemysqlhosting.net",
    user: "sql12380101",
    password: "sql123",
    database: "sql12380101",
    dateStrings: 'date'
});

connection.connect(function (error) {
    if (error) {
        console.log("Error in Connecting Database");
        throw error;
    }
    else {
        console.log("Connected to Database");
    }
});

//Used to access static files from public folder
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));


//////////Routing Starts
var primary_email,primary_bal,primary_name;
var message = "initial";
app.get("/",function(req,res){
    message = "initial";
    res.render("home");
})

app.get("/all_cust",function(req,res){
    connection.query("select * from customers",function(err,rows){
        if(err){
            console.log(err);
            res.redirect("/");
        }
        else{
            primary_email = rows[0].email;
            primary_bal = rows[0].balance;
            primary_name = rows[0].Name;
            res.render("all_cust",{rows,message});
        }
    })
    
});
app.post("/transfer",function(req,res){
    var email = req.body.email;
    var amount = parseFloat(req.body.amount);
    var name;
    connection.query("select * from customers where email=?",[email],function(err,row){
        if(err){
            console.log(err);
        }
        else if(row.length === 0){
            message = "ANF";
            console.log("Account Not Found!!");
            res.redirect("/all_cust");
        }
        else{
            if(amount >  primary_bal){
                message = "IB";
                console.log("Insufficient Balance");
                res.redirect("/all_cust");
            }
            else{
                name = row[0].Name;
                connection.query("update customers set balance = balance - ? where email=?",[amount,primary_email],function(err){
                    if(err){
                        console.log(err);
                    }
                    else{
                        connection.query("update customers set balance = balance + ? where email=?",[amount,email],function(err){
                            if(err){
                                console.log(err);
                            }
                            else{
                                connection.query("insert into trans(Name,email,amount) values(?,?,?)",[name,email,amount],function(err){
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        console.log("Transfer Successful!");
                                        message = "Success";
                                        res.redirect("/all_cust");
                                    }
                                });
                            }
                        })
                    }
                });
            }
        }
    })
});

app.get("/all_trans",function(req,res){
    message = "Initial";
    connection.query("select * from trans order by time_stamp desc",function(err,rows){
        if(err){
            console.log(err);
            res.redirect("/");
        }
        else{
            res.render("all_trans",{rows,primary_bal,primary_name});
        }
    })
    
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server started at port 3000");
    
});