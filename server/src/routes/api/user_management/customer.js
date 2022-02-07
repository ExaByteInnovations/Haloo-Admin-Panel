const express = require('express');
const router = express.Router();
const Customer = require('../../../models/user_management/customer');

router.get('/',async (req,res) =>{
    console.log('Got query:', req.query);
    var findQuery = {};
    if(req.query.length > 0){
        
       var findQuery = {_id:req.query._id, customerName:req.query.customerName, emailAddress:req.query.emailAddress, phone:req.query.phone, ageBracket:req.query.ageBracket, averageRating:req.query.averageRating, lastAccessOn:req.query.lastAccessOn,codStatus:req.query.codStatus, status:req.query.status};

        Object.keys(findQuery).forEach(key => {
            if (findQuery[key] === '' || findQuery[key] === NaN || findQuery[key] === undefined) { 
            delete findQuery[key];
            }
        });
    }
    try {
        // data = await Customer.find(findQuery);
        data = await Customer.aggregate([
            {
                $match : findQuery
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

router.post('/',(req,res) =>{
    console.log('Got query:', req.query);
    console.log('Got body:', req.body);

    var customerName = req.body.customerName;
    var emailAddress = req.body.emailAddress;
    var phone = req.body.phone;
    var ageBracket = req.body.ageBracket;
    var noOfJobs = req.body.noOfJobs;
    var averageRating = req.body.averageRating;
    var lastAccessOn = req.body.lastAccessOn;
    var codStatus = req.body.codStatus;
    var status = req.body.status;
    var newCustomer = new Customer({customerName, emailAddress, phone, ageBracket, noOfJobs, averageRating, lastAccessOn, codStatus, status});
    
    newCustomer.save()
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
        Customer.remove({_id:_id})
        .then((item) => {
                res.sendStatus(200);
        }).catch((error) => {
            //error handle
            console.log(error);
            res.sendStatus(400);       
        });
    }
});

router.put("/" ,async function(req,res){
    console.log('Got query:', req.query);
    console.log('Got body:', req.body);
    var _id = req.query._id;
    if (!_id){
        res.send({error: "Please provide an id"});
    }else{
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