const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.set('view engine', 'ejs')

app.use(express.static('public')) //sending our static file
app.use(bodyParser.urlencoded({ extended: true }));

//creating database connection 
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbms_project'
});

db.connect(function (err) {
    if (!err) {
        console.log("connected succesfully!!!");
    } else throw err;
});





app.get('/', function (req, res) {
    res.render('header')
})

// rendering userlogin page 
app.get('/user_login', function (req, res) {
    res.render('user_login')
})

// rendering adminlogin page
app.get('/admin_login', function (req, res) {
    res.render('admin_login')
})

// rendering admin_dashboard page
app.get("/admin_dashboard", function(req, res){
    res.render('admin_dashboard',{user: admin_user});
})

//rendering tables page
app.get('/tables', function(req,res){
    res.render('tables');
})

// *********************************************************************
// *********************************************************************
//                   ADMIN VIEW

// rendering add_items

//rendering add item page
app.get('/add_item', function (req, res) {
    res.render('add_item', {user:admin_user})
})

//rendering add staff page
app.get('/add_staff', function (req, res) {
    res.render('add_staff', {user:admin_user})
})

//rendering add item page
app.get('/modify_items', function (req, res) {
    res.render('modify_items', {user:admin_user})
})

//rendering manage_stores page
app.get('/manage_stores', function(req,res){
    
    var sql = "select * from stores";
    db.query(sql, function(err, result){
        if(err){
            throw err;
        }else{
            res.render('manage_stores',{result: result, user: admin_user});
        }
    })

})

//rendering manage_products page
app.get('/manage_products', function(req,res){
    
    var sql = "select * from menu";
    db.query(sql, function(err, result){
        if(err){
            throw err;
        }else{
            res.render('manage_products',{result: result,user: admin_user});
        }
    })

})

//rendering manage_orders page
app.get('/manage_orders', function(req,res){
    
    var sql = "select * from orders";
    db.query(sql, function(err, result){
        if(err){
            throw err;
        }else{
            res.render('manage_orders',{result: result, user: admin_user});
        }
    })

})

//rendering manage_customers page
app.get('/manage_customers', function(req,res){
    
    var sql = "select * from user_login";
    db.query(sql, function(err, result){
        if(err){
            throw err;
        }else{
            res.render('manage_customers',{result: result, user: admin_user});
        }
    })

})

//rendering modify_stores page
app.get('/modify_stores', function(req, res) {
    console.log("Modifying stores!!!")
    var sql="select BranchID from stores";
    db.query(sql,function(err,result){
        if(err){
            throw err;
        }else if(result==0){
            console.log("No stores found!!!");
        }else{
            res.render('modify_stores',{result:result,user:admin_user})
        }
    })
})


// **********************************************************************************
// **********************************************************************************

//                       USER VIEW


//rendering user registration page
app.get('/user_registration', function (req, res) {
    res.render('user_registration')
})

//rendering user dashboard dashboard
app.get('/user_dashboard', function (req, res) {
    res.render('user_dashboard',{user: user})
})

//rendering oreders page
app.get('/orders', function(req, res){
    // res.render('orders',{user: user});
    
    var sql = 'select * from orders where email=?';
    db.query(sql,[user],function(err, result){
        if(err){
            throw err;
        }else if(result.length===0){
           console.log("No active orders!!!");
           res.render('orders',{result:result})
        }else{
            console.log(result)
            res.render("orders",{result:result});
        }
    })
})

//rendering create order page
app.get('/create_order', function (req, res) {
    
    var sql = "select * from menu";
    db.query(sql,function(err, result){
        if(err){
        throw err;
        }else if(result===0){
            console.log("No menu found!!");
        }else{
            res.render('create_order',{user: user, result: result})
        }
    })
    
    
})

// renderig delete_store page
app.get('/delete_store', function (req, res) {
    
    var sql = "select * from stores";
    db.query(sql,function(err, result){
        if(err){
        throw err;
        }else if(result===0){
            console.log("No stores found!!");
        }else{
            res.render('delete_store',{user: admin_user, result: result})
        }
    })
    
    
})

// renderig delete_item page
app.get('/delete_item', function (req, res) {
    
    var sql = "select * from menu";
    db.query(sql,function(err, result){
        if(err){
        throw err;
        }else if(result===0){
            console.log("No items found!!");
        }else{
            res.render('delete_item',{user: admin_user, result: result})
        }
    })
    
    
})

//rendering stores page
app.get('/stores', function(req,res){
    
    var sql = "select * from stores";
    db.query(sql, function(err, result){
        if(err){
            throw err;
        }else{
            res.render('stores',{result: result, user: user});
        }
    })

})

//rendering menu page
app.get('/menu', function(req,res){
    
    var sql = "select * from menu";
    db.query(sql, function(err, result){
        if(err){
            throw err;
        }else{
            res.render('menu',{result: result, user: user});
        }
    })

})

//rendering view_staff page
app.get('/view_staff', function(req,res){
    
    var sql = "CALL getStaff()";
    db.query(sql, function(err, result){
        if(err){
            throw err;
        }else{
            console.log(result);
            res.render('view_staff',{result: result[0], user: admin_user});
        }
    })

})

//rendering orderlogs page
app.get('/order_logs', function(req,res){
    
    var sql = "select * from order_count";
    db.query(sql, function(err, result){
        if(err){
            throw err;
        }else{
            console.log(result);
            res.render('order_logs',{result: result, user: admin_user});
        }
    })

})


//user login and validation
app.post('/user_login', function(req, res){
    user = req.body.useremail;
    const pass = req.body.password;
    
    let sql = "select * from user_login where Email=? AND Password=?";
    db.query(sql, [user,pass], function(err, result){
        if(result.length===0)
        {
            console.log("Invalid Credentials!!! Please try again!!");
            res.redirect("/user_registration");
        }else{
            res.redirect("/user_dashboard");
            console.log("Login Successfull");
        }
    })

})


// Admin Login 
app.post('/admin_login', function(req, res){
    admin_user = req.body.adminemail;
    const pass = req.body.password;
    
    let sql = "select * from admin_login where Email=? AND Password=?";
    db.query(sql, [admin_user,pass], function(err, result){
        if(result.length===0)
        {
            console.log("Invalid Credentials!!! Please try again!!");
            res.redirect("/admin_login");
        }else{
            res.redirect("/admin_dashboard");
            console.log("Login Successfull");
        }
    })

})

// post create_order page
app.post("/create_order", function(req, res){
    var name = req.body.name;
    var quantity = req.body.quantity;
    var email = req.body.email;
    let today = new Date().toISOString().slice(0, 10);
    
    // Updating the order table
    
    let order = {
        Item : name,
        Quantity : quantity,
        Date : today,
        email : user
    }

    sql1 = "Insert into orders SET ?";
    db.query(sql1, order, function(err, result2){
        if(err){
            throw err;
        }else{
            res.redirect("/orders");
        }
    })
})

// post add_staff page
app.post("/add_staff", function(req, res){
    var id = req.body.newstaffid;
    var name = req.body.newstaffname;
    var position = req.body.position;
    var workperiod = req.body.workingperiod;
    var sal = req.body.salary;
    var d = req.body.date;

    // Updating the staff table
    
    let staffinfo = {
        staffID : id,
        name : name,
        position : position,
        workingperiod : workperiod,
        salary : sal,
        joiningdate : d
    
    }

    var sql = "Insert into staff SET ?";
    db.query(sql, staffinfo, function(err, result2){
        if(err){
            throw err;
        }else{
            res.redirect("/view_staff");
        }
    })
})

// add_item page (insert in database)
app.post("/add_item", function(req, res){
    var id = req.body.newdishid;
    var name = req.body.newproductname;
    var ratings = req.body.rating;
    var dish = req.body.dish;
    var price = req.body.productprice;

    // Updating the staff table
    
    let dishinfo = {
        DishID : id,
        Name : name,
        Rating : ratings,
        Type : dish,
        Price : price,
    
    }

    var sql = "Insert into menu SET ?";
    db.query(sql, dishinfo, function(err, result2){
        if(err){
            throw err;
        }else{
            res.redirect("/manage_products");
        }
    })
})


// delete_store post method
app.post("/delete_store", function(req, res){
    var id = req.body.brid;

    // Updating the store table
    
    let store = {
        BranchID: id
    }

    sql1= "Delete from stores where ?"
    // sql1 = "Insert into orders SET ?";
    db.query(sql1, store, function(err, result2){
        if(err){
            throw err;
        }else{
            res.redirect("/manage_stores");
        }
    })
})

// delete_item post method
app.post("/delete_item", function(req, res){
    var name = req.body.productname;

    // Updating the menu table
    
    let product = {
        Name: name
    }

    sql1= "Delete from menu where ?"
    db.query(sql1, product, function(err, result2){
        if(err){
            throw err;
        }else{
            res.redirect("/manage_products");
        }
    })
})


// post user_registration page
app.post("/user_registration", function(req, res){
    var name = req.body.name;
    var email = req.body.email;
    var sex = req.body.gender;
    var password = req.body.password;
    var phone = req.body.phone;

    // Updating the user login table
    let info = {
        Name : name,
        Email : email,
        Password : password,
        Sex : sex,
        Phone : phone
    }
    var sql = "Insert into user_login SET ?";
    db.query(sql, info, function(err, result2){
        if(err){
            throw err;
        }else{
            console.log(info)
            res.redirect("/user_login");
        }
    })
})

// post request for modifying stores table
app.post("/modify_store", function(req, res){
    var newstoreid = req.body.newstoreid;
    var newstorename = req.body.newstorename;
    var newstorephone = req.body.newstorephone;
    var newstoremanager = req.body.newstoremanager;
    var newstoreadd = req.body.newstoreadd;
    var activestatus = req.body.activestatus;
    var newmanagerid = req.body.newmanagerid;

    console.log(newstoreid, newstorename, newstorephone, newstoremanager, newstoreadd, activestatus);

    var store = {
        BranchID : newstoreid,
        Name : newstorename,
        Phone : newstorephone,
        ManagerId : newmanagerid,
        ManagerName : newstoremanager,
        Address : newstoreadd,
        Status : activestatus
    }

    var sql = "insert into stores SET ?";
    db.query(sql, store, function(err, result){
        if(err){
            throw err;
        }else{
            console.log("Store added successfully!!!");
            res.redirect("/manage_stores");
        }
    })
})



app.listen(3001, function (req, res) {
    console.log('Server is running at port 3001');
})
