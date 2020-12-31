const Pet = require('../models/pet')
const config = require('../config/dbconfig')

var functions = {
    create: function (req, res) {
        if (!req.body.name) {
            res.json({success: false, msg: 'Enter all fields'})
        } else {
            var newPet = new Pet({
                name: req.body.name
            });
            newPet.save(function (err, newPet) {
                if (err) {
                    res.json({success: false, msg: 'Failed to save'})
                } else {
                    res.json({success: true, msg: 'Successfully saved'})
                }
            })
        }
    },    
    read: function (req, res) {
        var query = req.body.name ? {name: req.body.name} : {}
        Pet.find(query, function (err, pets) {
            let names = pets
                .filter(function (doc) { return doc })
                .map(function (doc) { return doc.name })
            if(names.length > 0) {
                res.json({success: true, msg: names})
            } else {
                res.json({success: false, msg: 'Not found'})
            }
        });
    },
    update: function (req, res) {        
    },
    delete: function (req, res) {
    }
}

module.exports = functions