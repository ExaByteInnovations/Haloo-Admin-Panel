const express = require('express');
const router = express.Router();
const Customer = require('../../../models/user_management/customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const upload = require('../../../controller/multer');
const config = process.env;
const generate_otp = require('../../../utils/generate_otp');

router.post('/generate_otp', async (req,res) =>{
    console.log('Got query:', req.query);
    console.log('Got body:', req.body);

    let { phone } = req.body;

    // check if phone number is already registered
    let customer = await Customer.findOne({phone});

    if (customer) {
        otp = generate_otp(4);
        customer.otp = otp;
        // customer.otp_expiry = Date.now() + (60 * 1000);
        await customer.save();
        console.log(otp);
        return res.send({data:{_id:customer._id }});
        // return res.status(400).send({error: "Phone number already registered"});
    }else{
        otp = generate_otp(4);
        let customer = new Customer({
            phone,
            otp
        });
        await customer.save();
        console.log(otp);
        return res.send({data:{_id:customer._id, otp}});
    }
})



router.post("/verify_otp", async (req, res) => {

    let { _id, otp } = req.body;

    let customer = await Customer.findOne({_id:_id});
    console.log(customer);

    if (customer) {
        if (customer.otp == otp) {
            // customer.otp_expiry = Date.now() + (60 * 1000);
            customer.otp = null;
            // save jws token
            let token = jwt.sign({ _id: customer._id, logintype:'customer',  }, 'config.TOKEN_KEY', { expiresIn: '30d' });
            customer.token = token;
            await customer.save();
            return res.send({data:{customer:customer}});
        }else{
            return res.status(400).send({error: "Invalid OTP"});
        }
    }else{
        return res.status(400).send({error: "Invalid Customer Id"});
    }
  });

router.post("/logout", async (req, res) => {

    let { _id } = req.body;

    let customer = await Customer.findOne({_id:_id});
    console.log(customer);

    if (customer) {

        customer.token = null;
        await customer.save();
        return res.status(200).send({data: "Successfully logged out"});
        
    }else{
        return res.status(400).send({error: "Invalid Customer Id"});
    }
  });

module.exports = router;