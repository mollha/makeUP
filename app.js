const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const peep = require('./routes/people');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', peep);

let people = [
    {
        "username":"doctorwhocomposer",
        "forename":"Delia",
        "surname":"Derbyshire",
        "password":"delia123"},
    {
        "username":"annab3ll",
        "forename":"Anna",
        "surname":"Carenthos",
        "password":"annasWorld"},
    {
        "username":"catVonD",
        "forename":"Caterina",
        "surname":"Soors",
        "password":"cats2Cute"}
    ];

let packages =
    {
        nails: [
            {
                style: "Block colour",
                time: "20 minutes",
                cost: "45"
            },
            {
                style: "Perfect nude",
                time: "25 minutes",
                cost: "50"
            },
            {
                style: "Quirky",
                time: "40 minutes",
                cost: "60"
            }
        ],
        hair: [
            {
                style: "Textured updo",
                time: "30 minutes",
                cost: "70"
            },
            {
                style: "Sleek blow-dry",
                time: "15 minutes",
                cost: "50"
            },
            {
                style: "Insane curls",
                time: "20 minutes",
                cost: "60"
            }
        ],
        makeup: [
            {
                style: "Natural touch-up",
                time: "50 minutes",
                cost: "90"
            },
            {
                style: "Vibrant",
                time: "55 minutes",
                cost: "110"
            },
            {
                style: "Classic glam",
                time: "1 hour",
                cost: "120"
            }
        ]
    }


//routes

app.get('/people', function(req, res){
    res.send(people);
});

app.get('/packages', function(req, res){
    console.log(packages.keys());
    res.send(packages);
});

app.get('/packages/:item', function(req, res){
    res.send(packages[req.params.item]);
});

app.get('/people/:username', function(req, res){
    let success = false;
    for(let person in people) {
        if (req.params.username === people[person].username) {
            res.send(people[person]);
            success = true;
        }
    }
    if(success === false){
        res.send(null);
    }
});

app.post('/people', function(req, res){
    people.push(req.body);
    res.send("request to include new person called " + req.body.forename);
    console.log(people)
});

app.post('/people/:username', function(req, res) {
    const username = req.body.username;
    for(let person in people){
        if (username === people[person].username) {
            people[person][req.body.fieldName] = req.body.fieldVal;
            res.send(people[person]);
        }
    }
});

app.post('/login', function(req, res){
    const password = req.body.password;
    const user = getUser(req.body.username);

    if(user.username){
        //username exists
        if(password === user.password){
            //correct password
            res.send(true);
        }
        else{
            //incorrect / no password
            res.send(false);
        }
    }
    else{
        //username does not exist
        res.send(true);
    }
});

function getUser(username){
    for(let person in people) {
        if (username === people[person].username) {
            return people[person];
        }
    }
    return false;
}

console.log(people);
//make it accessible
//re watch stevens last lecture before making video demonstration

module.exports = app;