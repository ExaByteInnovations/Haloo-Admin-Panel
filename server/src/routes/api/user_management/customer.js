const express = require('express');
const router = express.Router();
const Customer = require('../../../models/user_management/customer');
const fs = require('fs');
const upload = require('../../../controller/multer');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

router.get('/',async (req,res) =>{
    console.log('Got query:', req.query);
    if (req.query._id) {
        req.query._id = ObjectId(req.query._id) 
    }
    try {
        // data = await Customer.find(findQuery);
        data = await Customer.aggregate([
            {
                $match : req.query
            },
            {
                $lookup: {
                    from: 'jobs',
                    localField: '_id',
                    foreignField: 'customerId',
                    as: 'jobDetails'
                }
            },
            {
                "$lookup": {
                    "from": "reviews",
                    "let": { "cId": "$_id" },

                    "pipeline": [
                        {
                            "$match": {
                                $expr: { $eq: ["$customerId", {"$toObjectId": "$$cId"}] },
                                "reviewFor": "customer"
                            }
                        },
                        { $group: { _id: null, avg : { $avg : '$rating' } } }
                    ],
                    "as": "reviewDetails"
                }
            },
            { 
                $addFields: {noOfJobs: {$size: "$jobDetails"}}
            },
            {
                $project : { jobDetails : 0, reviewDetails : 0 }
            }
        ]);



        res.send({data:data});
    }   catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})

router.post('/', upload.fields([{name: 'profileImage', maxCount: 1}]), async (req,res) =>{
    console.log('Got query:', req.query);
    console.log('Got body:', req.body);

    try{
        var { customerName, emailAddress, phone, ageBracket, noOfJobs, address, city, state, pincode, averageRating, lastAccessOn, codStatus, status } = req.body;

        var profileImage;
        if (req.files.profileImage) {
            profileImage = 'uploads/images/' + req.files.profileImage[0].filename;
        }

        var newCustomer = new Customer({customerName, profileImage, emailAddress, address, city, state, pincode,  phone, ageBracket, noOfJobs, averageRating, lastAccessOn, codStatus, status});
        
        await newCustomer.save();

        return res.status(200).send('ok');
    } catch (error) {
        console.log(error);
        return res.status(400).send(error); 
    }
})

router.delete("/" ,async function(req,res){
    // console.log('Got query:', req.query);
    // console.log('Got body:', req.body);
    var _id = req.query._id;
    if (!_id){
        res.send({error: "Please provide an id"});
    }else{
        //  remove element by id
        Customer.findOneAndDelete({_id:_id})
        .then((item) => {
                if (item.profileImage) {
                    fs.unlink(item.profileImage, (err) => {
                        if (err) throw err;
                        console.log('successfully deleted profileImage');
                    });
                }
                res.sendStatus(200);
        }).catch((error) => {
            //error handle
            console.log(error);
            res.sendStatus(400);       
        });
    }
});

router.put("/", upload.fields([{name: 'profileImage', maxCount: 1}]) ,async function(req,res){
    console.log('Got query:', req.query);
    console.log('Got body:', req.body);
    var _id = req.query._id;


    data = await Customer.findOne({
        _id: _id
    })
    console.log(data);
    if (!_id){
        res.send({error: "Please provide an id"});
    }else if (!_id){
        res.send({error: "Please provide an id"});
    }else{

        if (req.files.profileImage) {
            req.body.profileImage = 'uploads/images/' + req.files.profileImage[0].filename;
            if (data.profileImage) {
                fs.unlink(data.profileImage, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted profileImage');
                });
            }
            
        }

        //  update element in mongodb put
        Customer.updateOne({_id:_id}, {$set: req.body})
        .then((item) => {
                res.sendStatus(200);
        }).catch((error) => {
            //error handle
            console.log(error);
            res.sendStatus(400);       
        });
    }
});

module.exports = router;