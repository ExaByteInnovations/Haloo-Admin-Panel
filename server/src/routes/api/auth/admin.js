const express = require('express');
const router = express.Router();
const Admin = require('../../../models/user_management/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const upload = require('../../../controller/multer');
const config = process.env;

router.post(
  '/register',
  upload.fields([{ name: 'profileImage', maxCount: 1 }]),
  async (req, res) => {
    console.log('Got query:', req.query);
    console.log('Got body:', req.body);

    let { name, userRole, email, password, status } = req.body;

    var profileImage;
    if (req.files.profileImage) {
      profileImage = 'uploads/images/' + req.files.profileImage[0].filename;
    }

    encryptedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      userRole,
      profileImage,
      status,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = await jwt.sign({ admin_id: admin._id, email }, 'config.TOKEN_KEY', {
      expiresIn: '265d',
    });
    // save user token
    admin.token = token;

    admin
      .save()
      .then((item) => {
        console.log(item);
        res.status(201).json(admin);
      })
      .catch((error) => {
        //error handle
        console.log(error);
        res.sendStatus(400);
      });
  }
);

router.post('/login', async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send('All input is required');
    }
    // Validate if user exist in our database
    const admin = await Admin.findOne({ email });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      // Create token
      const token = jwt.sign(
        { admin_id: admin._id, logintype: 'admin' },
        'config.TOKEN_KEY',
        {
          expiresIn: '365d',
        }
      );

      // save user token
      admin.token = token;

      

      // user
      await admin.save();
      return res.status(200).json(admin);
    }
    return res.status(400).send('Invalid Credentials');
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

router.post('/logout', async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    console.log(req.user);
    const { email } = req.body;

    // Validate user input
    if (!email) {
      return res.status(400).send('Email is required');
    }
    // Validate if user exist in our database
    const admin = await Admin.findOne({ email });

    if (admin) {
      // logout
      admin.token = null;
      await admin.save();
      return res.status(200).send('Successfully logged out');
    }
    res.status(400).send('No admin with email exist');
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

router.post('/resetpassword', async (req, res) => {
  console.log('Got query:', req.query);
  console.log('Got body:', req.body);

  let { email, password } = req.body;

  encryptedPassword = await bcrypt.hash(password, 10);

  const admin = await Admin.findOne({ email });

  if (admin && password) {
    admin.password = encryptedPassword;
    admin
      .save()
      .then((item) => {
        console.log(item);
        res.status(201).json(admin);
      })
      .catch((error) => {
        //error handle
        console.log(error);
        res.sendStatus(400);
      });
  } else {
    res.status(400).send('No admin with email exist');
  }
});

module.exports = router;
