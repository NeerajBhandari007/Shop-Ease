const { User } = require('../model/User');
const crypto = require('crypto');
const { sanitizeUser } = require('../services/common');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  try {
    // random salt for encrypting the password
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      'sha256',
      async function (err, hashedPassword) {
        // saving hashed password and salt for identification
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();
        // agar req.login nahi lagate to session nahi banta
        req.login(sanitizeUser(doc), (err) => {
          // this  calls serializer and adds to session
          if (err) {
            res.status(400).json(err);
          } else {
            //  har session ke sath ek cookie generate hota hain
            // json web token library se hum jwt token bana sakte hain
            // ye HMAC sha256 ka hai syntax or bhi alag alag hote hain
            // jaise RSA sha256
            const token = jwt.sign(sanitizeUser(doc), process.env.JWT_SECRET_KEY);
            // cookie set kar diye jwt session me agli baar jab req wapas aaega
            // to uske sath apne aap req me aaegi
            res
              .cookie('jwt', token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              })
              .status(201)
              .json({id:doc.id, role:doc.role});
          }
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  // req.user passport banata hai jab user authenticate hojaega tab
  const user = req.user
  res
    .cookie('jwt', user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json({id:user.id, role:user.role});
};

exports.logout = async (req, res) => {
  res
    .cookie('jwt', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .sendStatus(200)
};

exports.checkAuth = async (req, res) => {
  if(req.user){
    res.json(req.user);
  } else{
    res.sendStatus(401);
  }
};