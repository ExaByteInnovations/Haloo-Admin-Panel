const express = require('express');
const router = express.Router();
const State = require('../../../models/service_info/state');

router.get('/',async (req,res) =>{
    console.log('Got query:', req.query);
    var findQuery = {};
    if(req.query.length > 0){
       var findQuery = {stateName:req.query.stateName, countryName:req.query.countryName, status:req.query.status};

        Object.keys(findQuery).forEach(key => {
            if (findQuery[key] === '' || findQuery[key] === NaN || findQuery[key] === undefined) { 
            delete findQuery[key];
            }
        });
    }
    try {
        data = await State.find(findQuery);
        res.send({data:data});
    }   catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})

router.post('/',(req,res) =>{
    console.log('Got query:', req.query);
    console.log('Got body:', req.body);
    var stateName = req.body.stateName;
    var countryName = req.body.countryName;
    var status = req.body.status;

    var item = new State({ categoryName, sequenceNumber, status });

    item.save( item )
        .then(function(item){
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
        State.remove({_id:_id})
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
        State.updateOne({_id:_id}, {$set: req.body})
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