const express = require('express');
const router = express.Router();
const City = require('../../../models/service_info/city');

router.get('/',async (req,res) =>{
    console.log('Got query:', req.query);

    if (req.query._id) {
        req.query._id = ObjectId(req.query._id) 
    }
    try {
        // data = await City.find(findQuery);
        data = await City.aggregate([
            {
                $match : req.query
            },
            {
                $lookup: {
                    from: 'states',
                    localField: 'stateId',
                    foreignField: '_id',
                    as: 'stateDetails'
                }
            },
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
    var cityName = req.body.cityName;
    var stateId = req.body.stateId;
    var status = req.body.status;

    var item = new City({ cityName, stateId, status });

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
        City.remove({_id:_id})
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
        City.updateOne({_id:_id}, {$set: req.body})
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