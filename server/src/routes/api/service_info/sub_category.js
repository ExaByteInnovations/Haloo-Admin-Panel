const express = require('express');
const router = express.Router();
const SubCategory = require('../../../models/service_info/sub_category');
const Category = require('../../../models/service_info/category');

router.get('/',async (req,res) =>{
    console.log('Got query:', req.query);
    var findQuery = {};
    if(req.query.length > 0){
        var findQuery = {category:req.query.category, parentCategoryId:req.query.parentCategoryId, sequenceNumber:req.query.sequenceNumber, status:req.query.status};

        Object.keys(findQuery).forEach(key => {
            if (findQuery[key] === '' || findQuery[key] === NaN || findQuery[key] === undefined) { 
            delete findQuery[key];
            }
        });
    }


    try {
        // movedb lookup to get reference data
        data = await SubCategory.aggregate([{
            $lookup: {
                from: 'categories',
                localField: 'parentCategoryId',
                foreignField: '_id',
                as: 'parentCategoryDetails'
            }
        }]);

        console.log(data);

        // data = await SubCategory.find(findQuery);
        res.send({data:data});
    }   catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})

router.post('/',async (req,res) =>{
    console.log('Got query:', req.query);
    console.log('Got body:', req.body);
    var category = req.body.category;
    var parentCategoryId = req.body.parentCategoryId;
    var sequenceNumber = req.body.sequenceNumber;
    var status = req.body.status;

    const categoryExists = await Category.exists({ _id: parentCategoryId });
    console.log(categoryExists);
    if (!categoryExists) {
        res.send({error: "Parent category does not exist"});
    } else {

        var item = new SubCategory({ category, parentCategoryId, sequenceNumber, status });

        item.save( item )
            .then(function(item){
                console.log(item);
                res.sendStatus(200);
            }).catch((error) => {
                //error handle
                console.log(error);
                res.sendStatus(400);       
            });
    }   
})

router.delete("/" ,async function(req,res){
    // console.log('Got query:', req.query);
    // console.log('Got body:', req.body);
    var _id = req.query._id;
    if (!_id){
        res.send({error: "Please provide an id"});
    }else{
        //  remove eleemnt id id mongodb
        SubCategory.remove({_id:_id})
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
        SubCategory.updateOne({_id:_id}, {$set: req.body})
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