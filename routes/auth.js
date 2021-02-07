const bodyParser = require("body-parser");
var express = require("express");
var dbHandler = require("../dbHandler");
var nlp = require("compromise");
var posTagger = require("wink-pos-tagger");
var tagger = posTagger();
var router = express();
var upload = require("express-fileupload");
var cors = require("cors");

router.use(cors());
router.use(upload());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/signin", function(req, res) {
    try {
        let sql = 'SELECT * FROM users where email = "'+req.body.email+'" and password = "'+req.body.password+'"';
        dbHandler.db.query(sql, async (err, result) => {
            console.log(result);
            if(!result) {
                res.send("FAILE");
            } else {
                res.send({
                    username: result[0].username,
                    role: result[0].role,
                    email: result[0].email,
                    status: result[0].status,
                    activityStatus: result[0].leave_status
                });
            }
        });
    } catch(e) {
        res.send("Error C-001: ", e);
    }
});

module.exports = router;