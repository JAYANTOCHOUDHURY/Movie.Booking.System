const Theater = require('../models/Theater.js');

exports.createTheater = async function( req, res){
    try { 
        const {name, location} = req.body;

        const newTheater = new Theater({name, location});
        await newTheater.save();

        res.status(201).json({message: 'Theater created Successfully', theater : newTheater});
    }
    catch(err){
        res.status(500).json({message: 'Failed to create theater', error : err.message});
    }
};

exports.getAllTheaters = async function(req, res){
    try { 
        const theaters = await Theater.find();
        res.status(200).json(theaters);
    }
    catch(err){
        res.status(500).json({message: 'Error fetching Theaters', error: err.message});
    }
}