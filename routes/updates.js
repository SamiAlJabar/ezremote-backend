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
router.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
router.use(bodyParser.json({limit: '50mb', extended: true}));
router.use(express.json({limit: '50mb', extended: true}));
router.use(express.urlencoded({limit: '50mb', extended: true}));

router.get("/test", function(req, res) {
    res.send('Success Test: update');
});
router.post("/tasks", function(req, res) {
    try {
        let sql = 'UPDATE tasks SET assignedTo = "'+req.body.assignedTo+'", status = "'+req.body.status+'", empName = "'+req.body.empName+'" WHERE id = '+req.body.id;
        dbHandler.db.query(sql, async (err, result) => {
            console.log(result);
            res.send("SUCCESS");
        });
    } catch(e) {
        res.send("Error C-001: ", e);
    }
});
router.post("/users", function(req, res) {
    try {
        let sql = 'UPDATE users SET status = "'+req.body.status+'", leave_status = "'+req.body.leave_status+'" WHERE email = "' + req.body.email + '"';
        dbHandler.db.query(sql, async (err, result) => {
            console.log(result);
            res.send("SUCCESS");
        });
    } catch(e) {
        res.send("Error C-001: ", e);
    }
});
router.post("/fromQuery", function(req, res) {

    var results = req.body.searchResult;
    var email = req.body.email;
    var orgId = req.body.orgId;
    let sql = '';
    if(results.action == 'create') {
        if(results.element == 'task') {
            sql = 'INSERT INTO tasks (creatorEmail, task, organizationId, goalId) VALUES'
         + '("'+email+'","'+results.variables[0].value+'","'+orgId+'","'+results.variables[1].value+'")';
        } else if(results.element == 'goal') {
            
        }
        else if(results.element == 'organization') {
            
        }
        
    } else if(results.action == 'update') { 
    
    } else if(results.action == 'assign') { 
        console.log("READY TO ASSIGN");
        sql = 'UPDATE tasks SET assignedTo = "'+results.variables[1].value+'", empName = "'+results.variables[0].value+'" WHERE id = '+results.variables[2].value;
    }
    try {
        dbHandler.db.query(sql, async (err, result) => {
            console.log(result);
            res.send("SUCCESS");
        });
    } catch(e) {
        res.send("Error C-001: ", e);
    }
});

module.exports = router;