const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

let people = [
    {
        "username":"doctorwhocomposer",
        "forename":"Delia",
        "surname":"Derbyshire"}
    ];

let packages =
    {
        nails: [
            {
                style: "Block colour",
                time: "20",
                cost: "45"
            },
            {
                style: "Perfect nude",
                time: "25",
                cost: "50"
            },
            {
                style: "Quirky",
                time: "40",
                cost: "60"
            }
        ],
        hair: [
            {
                style: "Textured updo",
                time: "30",
                cost: "70"
            },
            {
                style: "Sleek blow-dry",
                time: "15",
                cost: "50"
            },
            {
                style: "Insane curls",
                time: "20",
                cost: "60"
            }
        ],
        makeup: [
            {
                style: "Natural touch-up",
                time: "50",
                cost: "90"
            },
            {
                style: "Vibrant",
                time: "55",
                cost: "110"
            },
            {
                style: "Classic glam",
                time: "60",
                cost: "120"
            }
        ]
    };

let bookings = [{"username": "doctorwhocomposer", "packageList" : [ { package: 'nails', style: 'Perfect nude' } ]}];


//routes
app.get('/people', function(req, res){
    res.send(people);
});

app.get('/packages', function(req, res){
    res.send(packages);
});

app.get('/bookings', function(req, res){
    res.send(bookings);
});

app.get('/bookings/:username', function(req, res){
    let success = false;
    for(let booking in bookings) {
        if (req.params.username === bookings[booking].username) {
            res.send(bookings[booking].packageList);
            success = true;
        }
    }
    if(success === false){
        res.send(null);
    }
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
    if(req.headers.access_token === 'concertina'){
        if(checkUsername(req.body.username)){
            people.push(req.body);
            res.sendStatus(200);
        }
        else{
            res.sendStatus(400);
        }
    }
    else{
        res.sendStatus(403);
    }
});

function checkUsername(username){
    for(let person in people){
        if(person.username === username){
            return false;
        }
    }
    return true;
}

app.post('/people/:username', function(req, res) {
    const username = req.body.username;
    for(let person in people) {
        if (username === people[person].username) {
            people[person][req.body.fieldName] = req.body.fieldVal;
            res.send(people[person]);
        }
    }
});

app.post('/bookings', function(req) {
    people.push({"username" : req.body.username, "forename" : req.body.forename, "surname" : req.body.surname});
    let requestPackages = JSON.parse(req.body.packages);
    bookings.push({username : req.body.username, packageList : requestPackages});
});

//make it accessible
//re watch stevens last lecture before making video demonstration

module.exports = app;