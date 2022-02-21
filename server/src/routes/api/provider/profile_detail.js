const express = require('express');
const router = express.Router();
const Customer = require('../../../models/user_management/customer');
const fs = require('fs');
const upload = require('../../../controller/multer');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

router.get('/',async (req,res) =>{
    console.log('user details', req.user);
    console.log('Got query:', req.query);
    console.log('Got body:', req.user.loginType);
    if(req.user.loginType == 'user'){
        if(!req.user._id){
            return res.status(400).send('Unable to get id from token please relogin');
        }

        if (req.user._id) {
            req.user._id = ObjectId(req.user._id) 
        }
        try {
            // data = await Customer.find(findQuery);
            data = await Customer.aggregate([
                {
                    $match : {...req.query, _id:req.user._id}
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
                                    $expr: { $eq: ["$"+req.query.type+"Id", {"$toObjectId": "$$cId"}] },
                                    "reviewFor": req.query.type
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
                    $project : { jobDetails : 0, reviewDetails : 0, token : 0 }
                }
            ]);



            res.send({data:data});
        }   catch (error) {
            console.log(error);
            res.sendStatus(400);
        }
    }else{
        res.status(400).send('Invalid login type');
    }
})

// router.post('/', upload.single('profileImage'), async (req,res) =>{
//     console.log('Got query:', req.query);
//     console.log('Got body:', req.body);

//     try{
//         var {
//             companyName,
//             customerName, 
//             emailAddress, 
//             firstName,
//             lastName,
//             type,
//             phone, 
//             ageBracket, 
//             noOfJobs, 
//             address, 
//             city, 
//             state, 
//             pincode, 
//             averageRating, 
//             lastAccessOn, 
//             codStatus, 
//             status } = req.body;

//         var profileImage;
//         if (req.files.profileImage) {
//             profileImage = 'uploads/images/' + req.files.profileImage[0].filename;
//         }

//         var newCustomer = new Customer({
//             companyName,
//             customerName, 
//             emailAddress, 
//             firstName,
//             lastName,
//             type,
//             phone, 
//             ageBracket, 
//             noOfJobs, 
//             address, 
//             city, 
//             state, 
//             pincode, 
//             averageRating, 
//             lastAccessOn, 
//             codStatus, 
//             status });
        
//         await newCustomer.save();

//         return res.status(200).send('ok');
//     } catch (error) {
//         console.log(error);
//         return res.status(400).send(error); 
//     }
// })

router.delete("/" ,async function(req,res){
    // console.log('Got query:', req.query);
    // console.log('Got body:', req.body);
    var _id = req.user._id;

    
    if (req.user.loginType != 'user'){
       return res.status(400).send('Invalid login type');
    }
    if(!_id){
        return res.status(400).send('Unable to get id from token please relogin');
    
    }else{
        //  remove element by id
        Customer.findOneAndDelete({_id:_id})
        .then((item) => {
                if (item.profileImage) {
                    fs.unlink(item.profileImage, (err) => {
                        if (err) console.log(err);;
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
    console.log('Got files:', req.files);
    console.log('req.files.profileImage', req.files.profileImage);
    var _id = req.user._id;

    
    if (req.user.loginType != 'user'){
       return res.status(400).send('Invalid login type');
    }
    if(!_id){
        return res.status(400).send('Unable to get id from token please relogin');
    }
    data = await Customer.findOne({
        _id: _id
    })
    console.log(data);
    if (!data){
        return res.send({error: "No customer found"});
    }else{

        if (req.files.profileImage) {
            req.body.profileImage = 'uploads/images/' + req.files.profileImage[0].filename;
            if (data.profileImage) {
                    fs.unlink(data.profileImage, (err) => {
                        if (err) {
                            console.log(err);
                        };
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