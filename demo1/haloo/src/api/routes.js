const express = require('express');
const router = express.Router();

router.get("/review" ,async function(req,res){
    console.log('Got query:', req.query);
    var jobNumber = req.query.jobNumber;
    var rating = req.query.rating;

    var findQuery = {jobNumber, rating};

    Object.keys(findQuery).forEach(key => {
        if (findQuery[key] === '' || findQuery[key] === NaN || findQuery[key] === undefined) { 
          delete findQuery[key];
        }
    });
    try {
        data = await req.review.find(findQuery);
        res.send({data:data});
    } catch (error) {
        res.sendStatus(400);
    }
});

router.post("/review" ,async function(req,res){
        console.log('Got query:', req.query);
        console.log('Got body:', req.body);
        var ratingBy = req.body.ratingBy;
        var ratingFor = req.body.ratingFor;
        var whoRated = req.body.whoRated;
        var jobNumber = req.body.jobNumber;
        var rating = parseFloat(req.body.rating);
        var comment = req.body.comment;

        if (rating == NaN  || rating > 5 || rating < 0) {
            res.send({error: "Invalid rating value"});
        }else if(!jobNumber){
            res.send({error: "Invalid jobNumber value"});
        }
        var item = new req.review({ ratingBy: ratingBy, ratingFor: ratingFor, whoRated: whoRated, jobNumber: jobNumber, rating: rating, comment: comment });
        
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

router.delete("/review" ,async function(req,res){
    // console.log('Got query:', req.query);
    // console.log('Got body:', req.body);
    var _id = req.query._id;
    if (!_id){
        res.send({error: "Please provide an id"});
    }else{
        //  remove eleemnt id id mongodb
        req.review.remove({_id:_id})
        .then(function(item){
                res.sendStatus(200);
        }).catch((error) => {
            //error handle
            console.log(error);
            res.sendStatus(400);       
        });
    }
});

router.put("/review" ,async function(req,res){
    // console.log('Got query:', req.query);
    console.log('Got body:', req.body);
    var _id = req.query._id;
    if (!_id){
        res.send({error: "Please provide an id"});
    }else{
        //  update eleemnt id id mongodb
        req.review.update({_id:_id}, {$set: req.body})
        .then(function(item){
                res.sendStatus(200);
        }).catch((error) => {
            //error handle
            console.log(error);
            res.sendStatus(400);       
        });
    }
});




router.get("/job" ,async function(req,res){
    console.log('Got query:', req.query);
    var findQuery = {quote:req.query.quote, city:req.query.city, customer:req.query.customer, propertyName:req.query.propertyName, category:req.query.category, subCategory:req.query.subCategory, status:req.query.status, jobCategory:req.query.jobCategory};

    Object.keys(findQuery).forEach(key => {
        if (findQuery[key] === '' || findQuery[key] === NaN || findQuery[key] === undefined) { 
          delete findQuery[key];
        }
    });
    try {
        data = await req.job.find(findQuery);
        res.send({data:data});
    }   catch (error) {
        res.sendStatus(400);
    }
});


router.post("/job" ,async function(req,res){
    console.log('Got query:', req.query);
    console.log('Got body:', req.body);
    var quote = req.body.quote;
    var jobTitle = req.body.jobTitle;
    var city = req.body.city;
    var customer = req.body.customer;
    var propertyName = req.body.propertyName;
    var category = req.body.category;
    var subCategory = req.body.subCategory;
    var status = req.body.status;
    var jobCategory = req.body.jobCategory;

    var item = new req.job({ quote, jobTitle, city, customer, propertyName, category, subCategory, status, jobCategory});
    
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

router.delete("/job" ,async function(req,res){
    // console.log('Got query:', req.query);
    // console.log('Got body:', req.body);
    var _id = req.query._id;
    if (!_id){
        res.send({error: "Please provide an id"});
    }else{
        //  remove eleemnt id id mongodb
        req.job.remove({_id:_id})
        .then(function(item){
                res.sendStatus(200);
        }).catch((error) => {
            //error handle
            console.log(error);
            res.sendStatus(400);       
        });
    }
});

router.put("/job" ,async function(req,res){
    console.log('Got query:', req.query);
    console.log('Got body:', req.body);
    var _id = req.query._id;
    if (!_id){
        res.send({error: "Please provide an id"});
    }else{
        //  update element in mongodb put
        req.job.update({_id:_id}, {$set: req.body})
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