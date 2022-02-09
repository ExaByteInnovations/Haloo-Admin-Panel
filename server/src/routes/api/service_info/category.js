const express = require('express');
const router = express.Router();
const Category = require('../../../models/service_info/category');
const fs = require('fs')

const upload = require('../../../controller/multer')



router.get('/',async (req,res) =>{
    console.log('Got query:', req.query);
    // var findQuery = {};
    // if(req.query.length > 0){
    
    //    var findQuery = {_id:req.query._id, categoryName:req.query.categoryName, sequenceNumber:req.query.sequenceNumber, status:req.query.status};

    //     Object.keys(findQuery).forEach(key => {
    //         if (findQuery[key] === '' || findQuery[key] === NaN || findQuery[key] === undefined) { 
    //         delete findQuery[key];
    //         }
    //     });
    // }
    try {
        // console.log('findQuery:', findQuery);
        data = await Category.find(req.query);
        res.send({data:data});
    }   catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})

router.post('/', upload.fields([{name: 'image', maxCount: 1}, {name: 'hoverImage', maxCount: 1}]),(req,res) =>{
    console.log('Got query:', req.query);
    console.log('Got body:', req.body);
    console.log('Got files:', req.files);
    // res.sendStatus(200);
    // res.json({ fileUrl: 'http://192.168.0.7:3000/images/' + req.image.filename });
    var categoryName = req.body.categoryName;
    var sequenceNumber = req.body.sequenceNumber;
    var image;
    var hoverImage;
    if (req.files.image) {
        image = 'uploads/images/' + req.files.image[0].filename;
    }
    if (req.files.hoverImage) {
        hoverImage = 'uploads/images/' + req.files.hoverImage[0].filename;
    }
    var status = req.body.status;
    // res.sendStatus(200);
    // var status = req.body.status;

    var item = new Category({ categoryName, sequenceNumber, image, hoverImage, status});

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
        Category.findOneAndDelete({
            _id: _id
        })
        .then(function(item){
            console.log(item);

            //  delete image if item image exist
            if (item.image) {
                fs.unlink(item.image, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted image');
                });
            }
            if (item.hoverImage) {
                fs.unlink(item.hoverImage, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted image');
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

router.put("/" , upload.fields([{name: 'image', maxCount: 1}, {name: 'hoverImage', maxCount: 1}]),async function(req,res){
    console.log('Got query:', req.query);
    console.log('Got body:', req.body);
    var _id = req.query._id;
    data = await Category.findOne({
        _id: _id
    })
    console.log(data);
    if (!_id){
        res.send({error: "Please provide an id"});
    }else if(!data){
        res.send({error: "No collection with this id"});
    }else{
        //  update element in mongodb put
        if (req.files.image) {
            req.body.image = 'uploads/images/' + req.files.image[0].filename;
            if (data.image) {
                fs.unlink(data.image, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted image');
                });
            }
            
        }
        if (req.files.hoverImage) {
            req.body.hoverImage = 'uploads/images/' + req.files.hoverImage[0].filename;
            if (data.hoverImage) {
                fs.unlink(data.hoverImage, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted image');
                });
            }
        }
        Category.updateOne({_id:_id}, {$set: req.body})
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