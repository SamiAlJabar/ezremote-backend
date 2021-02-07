const bodyParser = require("body-parser");
var express = require("express");
var dbHandler = require("../dbHandler");
var posTagger = require("wink-pos-tagger");
var router = express();
var upload = require("express-fileupload");
var cors = require("cors");
var tagGenerator = require("../tagGenerator");
var actionDetector = require("../detectAction");

router.use(cors());
router.use(upload());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/organizations/:email", function(req, res) {
    try {
        let sql = 'SELECT * FROM organizations where email = "'+req.params.email+'"';
        dbHandler.db.query(sql, (err, result) => {
            if(err) throw err;
            sql = 'SELECT * FROM employeeorganization where organizationHead = "'+req.params.email+'"'
            dbHandler.db.query(sql, (err, result2) => {
                if(err) throw err;
                res.send({
                    organization: result,
                    employee: result2
                });
            });
        });
    } catch(e) {
        res.send("Error C-001: ", e);
    }
});
router.get("/employeeorganization/:organizationId", function(req, res) {
    try {
        let sql = 'SELECT users.username, users.email, users.status, users.leave_status, employeeorganization.organizationId, employeeorganization.organizationName FROM users INNER JOIN employeeorganization ON users.email = employeeorganization.userEmail where employeeorganization.organizationId = "'+req.params.organizationId+'"';
        dbHandler.db.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
        });
    } catch(e) {
        res.send("Error C-001: ", e);
    }
});
router.get("/goals/:organizationId", function(req, res) {
    try {        
        let sql = 'SELECT * FROM goals where organizationId = "'+req.params.organizationId+'"';
        dbHandler.db.query(sql, (err, result) => {
            sql = 'SELECT * FROM tasks where organizationId = "'+req.params.organizationId+'"';
            dbHandler.db.query(sql, (err, result2) => {
                if(err) throw err;
                res.send({
                    goals: result,
                    tasks: result2
                });
            });
        });
    } catch(e) {
        res.send("Error C-001: ", e);
    }
});
router.get("/tasks/:goalId", function(req, res) {
    try {
        let sql = 'SELECT * FROM tasks where goalId = "'+req.params.goalId+'"';
        dbHandler.db.query(sql, async (err, result) => {
            console.log(result);
            res.send(result);
        });
    } catch(e) {
        res.send("Error C-001: ", e);
    }
});
router.get("/allTasks/:orgId", function(req, res) {
    try {
        let sql = 'SELECT * FROM tasks where organizationId = "'+req.params.orgId+'"';
        dbHandler.db.query(sql, async (err, result) => {
            console.log(result);
            res.send(result);
        });
    } catch(e) {
        res.send("Error C-001: ", e);
    }
});
router.get("/employeetasks/:email", function(req, res) {
    try {
        let sql = 'SELECT tasks.*, goals.goal, goals.description as goalDescription, goals.priority FROM tasks INNER JOIN goals ON tasks.goalId = goals.id where tasks.assignedTo = "'+req.params.email+'"';
        // let sql = 'SELECT * FROM tasks where assignedTo = "'+req.params.email+'"';
        dbHandler.db.query(sql, async (err, result) => {
            res.send(result);            
        });
    } catch(e) {
        res.send("Error C-001: ", e);
    }
});
router.get("/search/:searchText", async function(req, res) {
    try {
        var tags = await tagGenerator.getTags(req.params.searchText);
        var action = await actionDetector.getAction(tags);
        console.log(action);
        res.send(action);
    } catch(e) {
        res.send("Error C-001: ", e);
    }
});
router.post("/filteredTasks", async function(req, res) {
    var filters = req.body.filter;
    var searchResult = req.body.searchResult;
    try {
        let sql = 'SELECT * FROM '+searchResult.element+'s where '+filters[0]+' = "'+filters[1]+'" AND organizationId = "'+req.body.organizationId+'"';
        dbHandler.db.query(sql, async (err, result) => {
            res.send(result);            
        });
    } catch(e) {
        res.send("Error C-001: ", e);
    }
});
router.post("/filteredAll", async function(req, res) {
    var searchResult = req.body.searchResult;
    try {
        let sql = 'SELECT * FROM '+searchResult.element+'s where organizationId = "'+req.body.organizationId+'"';
        dbHandler.db.query(sql, async (err, result) => {
            res.send(result);            
        });
    } catch(e) {
        res.send("Error C-001: ", e);
    }
});

module.exports = router;