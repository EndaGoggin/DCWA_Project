var express = require('express');
var mySQLDAO = require('./mySQLDAO');
var mongoDAO = require('./mongoDAO')
var bodyParser = require('body-parser');
const { body, validationResult, check } = require('express-validator');

var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:false}))

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
})

// Displays sql database on countries page
app.get('/countries', (req, res) => {
    mySQLDAO.getCountries()
        .then((result)=>{
            res.render('showCountries', {countries:result})
        })
        .catch((error)=>{
            res.send(error)
        })
})

// Adds country to the sql database
app.post('/addCountry', 
[check('code').isLength({min:3}).withMessage("Country Code must be 3 characters"), 
check('name').isLength({min:3}).withMessage("Country Name must be at least 3 characters"),
],
(req, res)=>{  
    var errors = validationResult(req)

        if(!errors.isEmpty()){
            res.render("addCountry", {
                errors:errors.errors,
                co_code:req.body.code,
                co_name:req.body.name,
                co_details:req.body.details
            })

        } else {
            mySQLDAO.addCountry(req.body.code, req.body.name, req.body.details)
            res.send(req.body.name + " has been added!<a href='/'>Home</a>")
        }
 })


// Gets inputs for new country
app.get('/addCountry', (req, res) => {
    res.render("addCountry", {
    errors: undefined,
    co_code: "",
    co_name: "",
    co_details: ""})
})

// Delete country from sql database
app.get('/deleteCountry/:country', (req, res)=>{
    mySQLDAO.deleteCountry(req.params.country)
       .then((result)=>{
           res.send(result)
       })
       .catch((error)=>{
           res.send(error)
       })
})

// Update country from sql database
app.post('/editCountry', (req, res) => {
    mySQLDAO.editCountry(req.body.code, req.body.name, req.body.details)
    .then((result)=>{
        console.log(result)
        res.send("<h1>Country " + req.body.code + " has been updated</h1> <a href='/countries'>Return Home</a>")
    })
    .catch((error)=>{
        res.send(error)
    })
})

// Gets inputs for new country
app.get('/editCountry/:country', (req, res) => {
    mySQLDAO.getDetailsCountry(req.params.country)
    .then((result)=>{
        res.render("editCountry", {
        co_code: result[0].co_code,
        co_name: result[0].co_name,
        co_details: result[0].co_details})
    })
    .catch((error)=>{
        res.send(error)
    })
   
})

// Gets all cities from sgl database
app.get('/cities', (req, res) => {
    mySQLDAO.getCity()
    .then((result)=>{
        res.render('showCities', {city:result})
    })
    .catch((error)=>{
        res.send(error)
    })
})

// All details page with city code
app.get('/allDetails/:city', (req, res)=>{
    mySQLDAO.getDetailsCity(req.params.city)
       .then((result)=>{
            
            res.render("allDetails", {
            cty_code: result[0].cty_code,
            cty_name: result[0].cty_name,
            population: result[0].population,
            isCoastal: result[0].isCoastal,
            areaKM: result[0].areaKM,
            co_code: result[0].co_code,
            co_name : result[0].co_name
            })
         
       })
       .catch((error)=>{
           res.send(error)
       })
})

app.get('/headsOfState', (req, res) => {
    mongoDAO.getHeadsOfState()
    .then((documents)=>{
        res.render("showState", {states:documents})
    })
    .catch((error)=>{
        res.send(error);
    })
})

app.post('/addHeadOfState', 
[check('_id').isLength({min:3}).withMessage("Country Code must be 3 characters"), 
check('name').isLength({min:3}).withMessage("Head of State must be at least 3 characters"),
], (req, res)=>{  
    var errors = validationResult(req)
console.log(req.body)
        if(!errors.isEmpty()){
            res.render("addHeadOfState", {
                errors:errors.errors,
                _id :req.body._id,
                headOfState:req.body.name
            })

        } else {
            mongoDAO.addHeadOfState(req.body._id, req.body.name)
            res.send(req.body._id + " " + req.body.name + " has been added!<a href='/'>Home</a>")
        }
 })

app.get('/addHeadOfState', (req, res) => {
    res.render("addHeadOfState", {
        errors:undefined,
        _id : "",
        headOfState: ""
    })
})

app.listen(3000, ()=> {
    console.log("Listening on port 3000")
});