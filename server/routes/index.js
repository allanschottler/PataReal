const express = require('express')
const actions = require('../methods/actions')
const auth = require('./auth')
const router = express.Router()
const passport = require('passport')
const mongoose = require('mongoose')
const User = mongoose.model('User')

/* GET home page. */
router.get('/', auth.optional, function(req, res, next) {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.end('Hello World!!\n')
});

router.post('/addpet', auth.required, actions.create)
router.post('/findpet', auth.optional, actions.read)

//POST new user route (optional, everyone has access)
router.post('/register', auth.optional, (req, res, next) => {
  const user = req.body
  if(!user.email || !user.password) {
    return res.status(422).json({      
      msg: 'Email and password are required'
    });
  }
  User.findOne({ email: user.email })
    .then((userq) => {
      if(userq) {
        return res.status(422).json({      
          msg: 'Email already registered'
        });
      } else {
        const finalUser = new User({
          email: user.email
        });  
        finalUser.setPassword(user.password);
        return finalUser.save().then(() => res.json({ 
          user: finalUser.toAuthJSON(),
          msg: 'Registered successfully!' 
        }));
      }
    });  
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
  const user = req.body
  console.log(user)
  if(!user.email || !user.password) {
    return res.status(422).json({      
      msg: 'Email and password are required'
    });
  }
  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if(err) {
      return next(err);
    }    
    if(passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();
      return res.json({ msg: 'Login successful!', user: user.toAuthJSON() });
    } else {      
      console.log(info.message)
      return res.status(400).json({
        msg: 'Authentication failed'
      });
    }    
  })(req, res, next);
})

module.exports = router
