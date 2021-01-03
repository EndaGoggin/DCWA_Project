var mysql = require('promise-mysql');
var pool;

mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'geography'
})
    .then((result) => {
        pool = result
    })
    .catch((error) => {
        console.log(error)
    })
// Query to get country
var getCountries = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from country')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })

    })
}
// Query to get city
var getCity = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from city')
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })

    })
}
// Query to get city details
var getDetailsCity = function (cty_code) {
    return new Promise((resolve, reject) => {


        var myQuery = {
            sql: 'SELECT ci.*, co.co_name FROM city ci inner join country co on co.co_code = ci.co_code WHERE cty_code = ?',
            values: [cty_code]
        }

        pool.query(myQuery)
            .then((result) => {

                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
// Query to get country details
var getDetails = function (co_code) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: ('select * from country where co_code = ?'),
            values: [co_code]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
// Query to get country details
var getDetailsCountry = function (co_code) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: ('select * from country where co_code = ?'),
            values: [co_code]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// add country query
var addCountry = function (co_code, co_name, co_details) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'INSERT INTO country VALUES (?, ?, ?)',
            values: [co_code, co_name, co_details]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })

    })
}
// query edit country
var editCountry = function (co_code, co_name, co_details) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'UPDATE country SET co_name = ?, co_details = ? WHERE co_code = ?',
            values: [co_name, co_details, co_code]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)
            })
            .catch((error) => {
                reject(error)
            })

    })
}
// query for deleting from database
var deleteCountry = function (co_code) {
    return new Promise((resolve, reject) => {
        var myQuery = {
            sql: 'delete from country where co_code = ?',
            values: [co_code]
        }
        pool.query(myQuery)
            .then((result) => {
                resolve(result)

            })
            .catch((error) => {
                reject(error)
            })
    })
}

module.exports = {
    getCountries, getCity, addCountry, deleteCountry,
    editCountry, getDetails, getDetailsCountry, getDetailsCity
}