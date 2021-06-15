/* jshint esversion:6 */

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
let mongoClient = require("mongodb").MongoClient;
let url = "mongodb://localhost:27017/mydb";
let bcrypt = require('bcryptjs');
const saltRounds = 10;
console.log("Starting up server");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const port = 5000;
app.use(session({
    key: 'user_sid',
    secret: process.env.NODE_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

let sessionChecker = (req,res,next) => {
    if (!req.session.user) {
        console.log("User is not logged in yet!");
        res.sendStatus(403);
    }
    else{
        console.log("User is logged in! Proceed ...");
        next();
    }
};
app.get('/isLoggedIn',sessionChecker,(req,res) =>{
    res.sendStatus(200);
});
app.get('/',sessionChecker, (req,res) =>{
    res.redirect('/login');
});

app.get('/home',sessionChecker, (req,res) =>{
    res.sendStatus(200);
});

app.post('/sendlocation',(req,res) => {
    mongoClient.connect(url,function(err,db){
        var collection = db.db().collection('MTrackUser');
        var currentDate = new Date();
        collection.find({
            _id: req.body.email
        }).toArray(function(err,document){
            if (err) console.error(err);
            if (document.length === 0) {
                    collection.insertOne({
                        email:req.body._id,
                        lon:req.body.long,
                        lat:req.body.lat,
                        timestamp : currentDate.getTime()},function(err,data){
                            if (err) console.error(err);
                        },function(err,docs){
                            if (err) console.log(err);
                            db.close();
                        });
            }
            else{
                db.close();
            }   
        });
});
    res.send("Update was a success");
});

app.get('/getlocation',(req,res) =>{
    mongoClient.connect(url,function(err,db){
        if (err)
        {
            console.error(err);
            res.sendStatus(500);
        }
        else
        {
            var collection = db.db().collection('MTrackUser');
            collection.find(
            { email: req.query.id,
              timestamp: {
                  $gte: new Date(req.query.sd).getTime(),
                  $lte: new Date(req.query.ed).getTime()
              } }
            ).toArray(function(err,document){
                if (err) console.error(err);
                if (document.length > 0){
                    res.send(document);
                }
                else{
                    let message = "{}";
                    res.send(JSON.parse(message));
                }
                
                db.close();
            });
        }
        
});
 });

app.post('/register',(req,res)=>{
    mongoClient.connect(url,function(err,db){
            let collection = db.db().collection('MTracker');
            collection.find({
                _id:req.body.email
            }).toArray(function(err,document){
                if (err) console.error(err);
                if (document.length === 0) {
                    bcrypt.hash(req.body.password,saltRounds,function(err,hash){
                        collection.insertOne({
                            _id:req.body.email,
                            password:hash},function(err,data){
                                if (err) console.error(err);
                            },function(err,docs){
                                if (err) console.log(err);
                                db.close();
                                res.sendStatus(200);
                            });
                    });
                }
                else{
                    db.close();
                    res.sendStatus(409);
                }   
            });
    });
});


app.post('/login',function(req,res){
    mongoClient.connect(url,function(err,db){
        let collection = db.db().collection('MTracker');
        collection.find({
            _id: req.body.email
        }).toArray(function(err,document){
            if (err) console.error(err);
            if (document.length > 0) {
                bcrypt.compare(req.body.password,document[0].password,function(err,result){
                    if (result === true)
                    {
                        req.session.user = document[0]["_id"];
                        res.sendStatus(200);
                    }
                    else 
                    {
                        res.sendStatus(409);
                    }
                    db.close();
                });
            }
            else{
                res.sendStatus(401);
                db.close();
            }   
        });
    
});

});


app.listen(port, () => console.log("Listening on port "+port+" ...") );