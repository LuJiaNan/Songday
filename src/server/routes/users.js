var express = require('express');
var router = express.Router();

var db = require("../config/db");

/**
 * 查询列表页
 */
router.get("/",function(req,res,next){
    db.query("select * from user",function(err,rows){
        if(err){
            res.render("users",{title:"用户列表",datas:[]});
        }else {
            res.render("users",{title:"用户列表",datas:rows});
        }
    });
});

/**
 * 添加用户
 */
router.get("/add",function(req,res,next){
    res.render("add");
});
router.post("/add",function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    var sql = "select * from user where username = '"+ username +"'";
    db.query(sql,function(err,rows){
        if(err){
            res.send("新增失败"+err);
        }else{
            if(rows.length === 0){
                db.query("insert into user(username,password) values('"+username+"','"+ password +"')",function(err,rows){
                    if(err){
                        res.send("新增失败"+err);
                    }else {
                        res.redirect("/users");
                    }
                });
            }else{
                res.send('用户已存在！');
            }
        }
    })
});

/**
 * 删除用户
 */
router.get("/del/:id",function(req,res){
    var id = req.params.id;
    db.query("delete from user where id = " + id,function(err,rows){
        if(err){
            res.send("删除失败"+err);
        }else {
            res.redirect("/users");
        }
    });
});

/**
 * 修改
 */
router.get("/toUpdate/:id",function(req,res,next){
    var id = req.params.id;
    var sql = "select * from user where id = " + id;
    console.log(sql);
    db.query(sql,function(err,rows){
        if(err){
            res.send("修改页面跳转失败");
        }else {
            res.render("update",{datas:rows});
        }
    });
});

router.post("/update",function(req,res,next){
    var id = req.body.id;
    var username = req.body.username;
    var password = req.body.password;
    var sql = "update user set username = '"+ username +"',password = '"+ password +"' where id = " + id;
    console.log(sql);
    db.query(sql,function(err,rows){
        if(err){
            res.send("修改失败 " + err);
        }else {
            res.redirect("/users");
        }
    });
});


/**
 * 查询
 */
router.post("/search",function(req,res,next){
    var username = req.body.s_username;
    var password = req.body.s_password;
    var sql = "select * from user";
    if(username){
        sql += " where username = '"+ username +"'";
    }
    //if(age){
    //    sql += " and age = '" + age + "'";
    //}

    sql.replace("and","where");
    db.query(sql,function(err,rows){
        if(err){
            res.send("查询失败: "+err);
        }else{
            res.render("users",{title:"用户列表",datas:rows,s_username:username,s_password:password});
        }
    });
})

module.exports = router;