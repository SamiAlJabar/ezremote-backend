const bodyParser = require("body-parser");
var express = require("express");
var nlp = require("compromise");
var dbHandler = require("../dbHandler");
var posTagger = require("wink-pos-tagger");
var tagger = posTagger();
var router = express();
var upload = require("express-fileupload");
var cors = require("cors");

router.use(cors());
router.use(upload());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/test", function(req, res) {
    res.send('Success Test: delete');
});
router.post("/employeeorganization", function(req, res) {
    try {
        let sql = 'DELETE FROM employeeorganization WHERE userEmail = "'+req.body.userEmail+'" AND organizationId = "'+req.body.organizationId+'"';
        dbHandler.db.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        });
    } catch(e) {
        res.send("Error C-001: ", e);
    }
});

module.exports = router;