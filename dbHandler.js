var mysql = require('mysql');
var config = require('./config');

exports.db = mysql.createConnection(config.dbConfig);

exports.connectToDatabase = function() {
    try {
        exports.db.connect(function (err) {
            if (err) throw err;
            console.log('MySQL connection successful ... ');
        });
    } catch(err) {
        console.log(err);
    }
}
