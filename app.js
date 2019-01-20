const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const peep = require('./routes/people');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/bird', peep);

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

let packages = [
    {
        "nails": [
            {
                "style": "Block colour",
                "duration": "20 minutes",
                "cost": "45"},
            {
                "style": "Perfect nude",
                "duration": "25 minutes",
                "cost": "50"},
            {
                "style": "Quirky",
                "duration": "40 minutes",
                "cost": "60"}
        ]},
    {
        "hair": [
            {
                "style": "Textured updo",
                "duration": "30 minutes",
                "cost": "70"},
            {
                "style": "Sleek blow-dry",
                "duration": "15 minutes",
                "cost": "50"},
            {
                "style": "Insane curls",
                "duration": "20 minutes",
                "cost": "60"}
        ]},
    {
        "makeup": [
            {
                "style": "Natural touch-up",
                "duration": "50 minutes",
                "cost": "90"},
            {
                "style": "Vibrant",
                "duration": "55 minutes",
                "cost": "110"},
            {
                "style": "Classic glam",
                "duration": "1 hour",
                "cost": "120"}
        ]}
]



//routes


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

app.get('/packages.html/:section', function(req, res) {
    res.send(req.params.section);
});

app.post('/people', function(req, res){
    people.push(req.body);
    res.send("request to include new person called " + req.body.forename);
    console.log(people)
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