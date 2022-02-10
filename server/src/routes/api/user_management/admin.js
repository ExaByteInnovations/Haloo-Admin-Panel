const express = require('express');
const router = express.Router();
const Admin = require('../../../models/user_management/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        data = await Admin.find(findQuery);
        // data = await Admin.aggregate([
        //     {
        //         $match : findQuery
        //     },
        //     {
        //         $lookup: {
        //             from: 'jobs',
        //             localField: '_id',
        //             foreignField: 'customerId',
        //             as: 'jobDetails'
        //         }
        //     },
        //     { 
        //         $addFields: {noOfJobs: {$size: "$jobDetails"}}
        //     },
        //     {
        //         $project : { jobDetails : 0}
        //     }
        // ]);



        res.send({data:data});
    }   catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
})

router.post('/', async (req,res) =>{
    console.log('Got query:', req.query);
    console.log('Got body:', req.body);

    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password;

    encryptedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
        first_name,
        last_name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      });

    // Create token
    const token = jwt.sign(
        { admin_id: admin._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "265d",
        }
      );
      // save user token
    admin.token = token;

    admin.save()
        .then((item) => {
            console.log(item);
            res.status(201).json(admin);
        }).catch((error) => {
            //error handle
            console.log(error);
            res.sendStatus(400);       
        });   
})



router.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const admin = await Admin.findOne({ email });
  
      if (admin && (await bcrypt.compare(password, admin.password))) {
        // Create token
        const token = jwt.sign(
          { admin_id: admin._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "365d",
          }
        );
  
        // save user token
        admin.token = token;
  
        // user
        res.status(200).json(admin);
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });
  








// router.delete("/" ,async function(req,res){
//     // console.log('Got query:', req.query);
//     // console.log('Got body:', req.body);
//     var _id = req.query._id;
//     if (!_id){
//         res.send({error: "Please provide an id"});
//     }else{
//         //  remove eleemnt id id mongodb
//         Customer.findOneAndDelete({_id:_id})
//         .then((item) => {
//                 if (item.profileImage) {
//                     fs.unlink(item.profileImage, (err) => {
//                         if (err) throw err;
//                         console.log('successfully deleted profileImage');
//                     });
//                 }
//                 res.sendStatus(200);
//         }).catch((error) => {
//             //error handle
//             console.log(error);
//             res.sendStatus(400);       
//         });
//     }
// });

// router.put("/", upload.fields([{name: 'profileImage', maxCount: 1}]) ,async function(req,res){
//     console.log('Got query:', req.query);
//     console.log('Got body:', req.body);
//     var _id = req.query._id;


//     data = await Customer.findOne({
//         _id: _id
//     })
//     console.log(data);
//     if (!_id){
//         res.send({error: "Please provide an id"});
//     }else if (!_id){
//         res.send({error: "Please provide an id"});
//     }else{

//         if (req.files.profileImage) {
//             req.body.profileImage = 'uploads/images/' + req.files.profileImage[0].filename;
//             if (data.profileImage) {
//                 fs.unlink(data.profileImage, (err) => {
//                     if (err) throw err;
//                     console.log('successfully deleted profileImage');
//                 });
//             }
            
//         }

//         //  update element in mongodb put
//         Customer.updateOne({_id:_id}, {$set: req.body})
//         .then((item) => {
//                 res.sendStatus(200);
//         }).catch((error) => {
//             //error handle
//             console.log(error);
//             res.sendStatus(400);       
//         });
//     }
// });

module.exports = router;