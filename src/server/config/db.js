var mysql = require("mysql");
var pool = mysql.createPool({
    host:"47.104.80.143",
    user:"root",
    password:"123456",
    database:"testnode"
});

function query(sql,callback){
    pool.getConnection(function(err,connection){
        connection.query(sql, function (err,rows) {
            callback(err,rows);
            connection.release();
        });
    });
}

exports.query = query;