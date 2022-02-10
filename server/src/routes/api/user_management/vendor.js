const express = require('express');
const router = express.Router();
const Vendor = require('../../../models/user_management/vendor');

const fs = require('fs');
const upload = require('../../../controller/multer');

router.get('/',async (req,res) =>{
    console.log('Got query:', req.query);
    var findQuery = {};
    if(req.query.length > 0){
        
       var findQuery = {_id:req.query._id, companyName:req.query.companyName, firstName:req.query.firstName, lastName:req.query.lastName, emailAddress:req.query.emailAddress, phoneNumber:req.query.phoneNumber, city:req.query.city, state:req.query.state, averageRating:req.query.averageRating, lastAccessOn:req.query.lastAccessOn, status:req.query.status};

        Object.keys(findQuery).forEach(key => {
            if (findQuery[key] === '' || findQuery[key] === NaN || findQuery[key] === undefined) { 
            delete findQuery[key];
            }
        });
    }
    try {
        // data = await Vendor.find(findQuery);
        data = await Vendor.aggregate([
            {
                $match : findQuery
            },
            {
                $lookup: {
                    from: 'jobs',
                    localField: '_id',
                    foreignField: 'vendorId',
                    as: 'jobDetails'
                }
            },
            {
                $addFields: {noOfJobs: {$size: "$jobDetails"}}
            },
            {
                $project : { jobDetails : 0}
            }
        ]);

        res.send({data:data});
    }   catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})

router.post('/', upload.fields([{name: 'logo', maxCount: 1}]) ,(req,res) =>{
    console.log('Got query:', req.query);
    console.log('Got body:', req.body);

    var companyName = req.body.companyName;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var emailAddress = req.body.emailAddress;
    var phoneNumber = req.body.phoneNumber;
    var city = req.body.city;
    var state = req.body.state;
    var noOfJobs = req.body.noOfJobs;
    var averageRating = req.body.averageRating;
    var lastAccessOn = req.body.lastAccessOn;
    var status = req.body.status;

    var logo;
    if (req.files.logo) {
        logo = 'uploads/images/' + req.files.logo[0].filename;
    }

    var newVendor = new Vendor({companyName, logo, firstName, lastName, emailAddress, phoneNumber, city, state, noOfJobs, averageRating, lastAccessOn, status});

    newVendor.save()
        .then((item) => {
            console.log(item);
            res.sendStatus(200);
        }).catch((error) => {
            //error handle
            console.log(error);
            res.sendStatus(400);       
        });   
})

router.delete("/" ,async function(req,res){
    // console.log('Got query:', req.query);
    // console.log('Got body:', req.body);
    var _id = req.query._id;
    if (!_id){
        res.send({error: "Please provide an id"});
    }else{
        //  remove eleemnt id id mongodb
        Vendor.findOneAndDelete({_id:_id})
        .then((item) => {
            if (item.logo) {
                fs.unlink(item.logo, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted logo');
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

router.put("/" , upload.fields([{name: 'logo', maxCount: 1}]), async function(req,res){
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
        res.send({error: "No collection with this id"});
    }else{
        if (req.files.logo) {
            req.body.logo = 'uploads/images/' + req.files.logo[0].filename;
            if (data.logo) {
                fs.unlink(data.logo, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted logo');
                });
            }
            
        }

        //  update element in mongodb put
        Vendor.updateOne({_id:_id}, {$set: req.body})
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