const express = require('express');
const router = express.Router();
const Job = require('../../models/job');

router.get("/" ,async function(req,res){
    console.log('Got query:', req.query);
    var findQuery = {_id:req.query._id, quote:req.query.quote, city:req.query.city, customerId:req.query.customer, propertyName:req.query.propertyName, category:req.query.category, subCategory:req.query.subCategory, status:req.query.status, jobCategory:req.query.jobCategory, vendorId:req.query.vendor, jobTotal:req.query.jobTotal};

    Object.keys(findQuery).forEach(key => {
        if (findQuery[key] === '' || findQuery[key] === NaN || findQuery[key] === undefined) { 
          delete findQuery[key];
        }
    });
    try {
        // data = await Job.find(findQuery);

        data = await Job.aggregate([
            {
                $match : findQuery
            },
            {
                $lookup: {
                    from: 'customers',
                    localField: 'customerId',
                    foreignField: '_id',
                    as: 'customerDetails'
                },
            },
            {
                $lookup: {
                    from: 'vendors',
                    localField: 'vendorId',
                    foreignField: '_id',
                    as: 'vendorDetails'
                }
            }
        ]);

        res.send({data:data});
    }   catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});


router.post("/" ,async function(req,res){
    console.log('Got query:', req.query);
    console.log('Got body:', req.body);
    var quote = req.body.quote;
    var jobTitle = req.body.jobTitle;
    var city = req.body.city;
    // var customer = req.body.customer;
    var customerId = req.body.customerId;
    var propertyName = req.body.propertyName;
    var category = req.body.category;
    var subCategory = req.body.subCategory;
    var status = req.body.status;
    var jobCategory = req.body.jobCategory;
    var vendorId = req.body.vendorId;
    var jobTotal = req.body.jobTotal;

    var item = new Job({ quote, jobTitle, city, customerId, propertyName, category, subCategory, status, jobCategory, vendorId, jobTotal });
    
    item.save( item )
        .then(function(item){
            console.log(item);
            res.sendStatus(200);
        }).catch((error) => {
            //error handle
            console.log(error);
            res.sendStatus(400);       
        });   

});

router.delete("/" ,async function(req,res){
    // console.log('Got query:', req.query);
    // console.log('Got body:', req.body);
    var _id = req.query._id;
    if (!_id){
        res.send({error: "Please provide an id"});
    }else{
        //  remove eleemnt id id mongodb
        Job.remove({_id:_id})
        .then(function(item){
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
        Job.update({_id:_id}, {$set: req.body})
        .then(function(item){
                res.sendStatus(200);
        }).catch((error) => {
            //error handle
            console.log(error);
            res.sendStatus(400);       
        });
    }
});

module.exports = router;