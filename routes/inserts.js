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
router.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
router.use(bodyParser.json({limit: '50mb', extended: true}));
router.use(express.json({limit: '50mb', extended: true}));
router.use(express.urlencoded({limit: '50mb', extended: true}));

router.get("/test", function(req, res) {
    let sql = 'SELECT * FROM classdefinition';
    dbHandler.db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
});

router.post("/users", function(req, res) {
    try {
        let sql = 'INSERT INTO users (username, password, role, email) VALUES ("'+req.body.username+'","'+req.body.password+'","'+req.body.role+'","'+req.body.email+'")';
        dbHandler.db.query(sql, async (err, result) => {
            console.log(result);
            res.send(req.body.username);
        });
    } catch(e) {
        res.send("Error C-001: ", e);
    }
});
router.post("/organizations", function(req, res) {
    try {
        let sql = 'INSERT INTO organizations (name, weblink, email) VALUES ("'+req.body.name+'","'+req.body.weblink+'","'+req.body.email+'")';
        dbHandler.db.query(sql, async (err, result) => {
            console.log(result);
            res.send("SUCCESS");
        });
    } catch(e) {
        res.send("Error C-001: ", e);
    }
});
router.post("/employeeorganization", function(req, res) {
    try {
        let sql = 'INSERT INTO employeeorganization (organizationHead, userEmail, organizationId, organizationName) VALUES ("'+req.body.organizationHead+'","'+req.body.userEmail+'","'+req.body.organizationId+'","'+req.body.organizationName+'")';
        dbHandler.db.query(sql, async (err, result) => {
            console.log(result);
            res.send("SUCCESS");
        });
    } catch(e) {
        res.send("Error C-001: ", e);
    }
});
router.post("/goals", function(req, res) {
    try {
        let sql = 'INSERT INTO goals (goal, priority, organizationId, description, organizationHead) VALUES ("'+req.body.goal+'","'+req.body.priority+'","'+req.body.organizationId+'","'+req.body.description+'","'+req.body.email+'")';
        dbHandler.db.query(sql, async (err, result) => {
            console.log(result);
            res.send("SUCCESS");
        });
    } catch(e) {
        res.send("Error C-001: ", e);
    }
});
router.post("/tasks", function(req, res) {
    console.log("INSERT OPERATION");
    try {
        let sql = 'INSERT INTO tasks (empName, creatorEmail, task, description, organizationId, goalId, assignedTo) VALUES'
         + '("'+req.body.empName+'","'+req.body.creatorEmail+'","'+req.body.task+'","'+req.body.description+'","'+req.body.organizationId+'","'+req.body.goalId+'","'+req.body.assignedTo+'")';
        dbHandler.db.query(sql, async (err, result) => {
            console.log(result);
            res.send("SUCCESS");
        });
    } catch(e) {
        res.send("Error C-001: ", e);
    }
});




















router.post("/updateAcronyms", function(req, res) {
    try {
        let acronyms = req.body.acronyms.acronyms;
        console.log("acronyms: ", acronyms);
        let storeAcro = [];
        let acroDelete = [];
        let forUnknownStore = [];
        for(t in acronyms) {
            console.log("INDEX: ", acronyms[t].keyword);
            let onto = [];
            onto.push(acronyms[t].keyword);
            onto.push('');
            onto.push(acronyms[t].meaning);
            onto.push('acronym');
            storeAcro.push(onto);
            let unknow = [];
            unknow.push(acronyms[t].keyword);
            unknow.push(acronyms[t].meaning);
            unknow.push('acronym');
            forUnknownStore.push(unknow)
            acroDelete.push(acronyms[t].keyword); //samisami
        }
    
        let sql = "DELETE FROM unknownwords WHERE term in (?)"
        try {
            dbHandler.db.query(sql, [acroDelete], async (err, result1) => {
                if(err) throw err;
            });
        } catch(e) {
            console.log(e);
        }
        try {
            sql = "DELETE FROM ontology WHERE keyword in (?)"
            dbHandler.db.query(sql, [acroDelete], async (err, result1) => {
                if(err) throw err;
                console.log("PHASE:: 1");
                sql = "INSERT INTO ontology (keyword, class, meaning, type) VALUES ?"
                try {
                    await dbHandler.db.query(sql, [storeAcro], async (err, result2) => {
                        if(err) throw err;
                        console.log("PHASE:: 2");
                        sql = "INSERT INTO unknownwords (term, meaning, type) VALUES ?"
                        await dbHandler.db.query(sql, [forUnknownStore], async (err, result3) => {
                            if(err) throw err;
                            console.log("PHASE:: 3");
                            sql = 'SELECT * FROM textobjects';
                            let ontoValues = [];
                            await dbHandler.db.query(sql, async (err, resultTwo) => {
                                if(err) throw err;
                                console.log("PHASE:: 4");
                                for(text in resultTwo) {
                                    for(acro in acronyms) {
                                        let ontos = []
                                        let words = resultTwo[text].text.split(" ");
                                        for (let i = 0; i < words.length; i += 1) {
                                            console.log("WORDS: ", words[i]);
                                            if(words[i].toLowerCase() == acronyms[acro].keyword.toLowerCase()) {
                                                ontos.push(resultTwo[text].id)
                                                ontos.push(acronyms[acro].keyword);
                                                ontos.push("");
                                                ontos.push(acronyms[acro].meaning);
                                                ontos.push('acronym');
                                                ontoValues.push(ontos);
                                            }
                                        }
                                    }
                                }
                                if(ontoValues.length == 0) {
                                    res.send();
                                } else {
                                    sql = "DELETE FROM ontomatch WHERE keyword in (?) and type = 'acronym'"
                                    try {
                                        await dbHandler.db.query(sql, [acroDelete], async (err, result1) => {
                                            if(err) throw err;
                                            sql = "INSERT INTO ontoMatch (textObjectId, keyword, class, meaning, type) VALUES ?"
                                            await dbHandler.db.query(sql, [ontoValues], async (err, resultThree) => {
                                                console.log("PHASE:: 5");
                                                if(err) throw err;
                                                res.send('SUCCESS');
                                            });
                                        });
                                    } catch(e) {
                                        console.log(e);
                                        res.send('FAILURE');
                                    }
                                }
                            });
                        });
                    });
                }catch(e2) {
                    res.send("Error C-001: ", e2);
                }
            });
        } catch(e1) {
            res.send("Error C-001: ", e1);
        }
    } catch(e) {
        res.send("Error C-001: ", e);
    }
});

router.post("/tableData", async function(req, res) {
    console.log("Table DATA INNNNNNN 4: ", req.body);
    try {
        let tableDatafromServer = req.body;
        console.log(tableDatafromServer);
        let tableData = [];
        for(t in tableDatafromServer) {
            let tData = [];
            tData.push(tableDatafromServer[t].fromDocument);
            tData.push(tableDatafromServer[t].parentId);
            tData.push(tableDatafromServer[t].pageNo);
            tData.push(tableDatafromServer[t].tableData);
            tableData.push(tData);
        }
        let sql = "INSERT INTO documentTables (fromDocument, parentId, pageNo, tableData) VALUES ?"
        await dbHandler.db.query(sql, [tableData], async (err, result) => {
            if(err) throw err;
            res.send('SUCCESS');
        });
    } catch(e) {
        res.send("Error C-001: ", e);
    }
});

module.exports = router;