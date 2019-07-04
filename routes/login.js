var express = require('express');
var router = express.Router();
var steem = require('steem');
var jwt = require('jsonwebtoken');
var config = require('../config');

router.post('/login', function(req, res) {
    const username = req.body.loginParam.username;
    const password = req.body.loginParam.password;

    steem.api.getAccounts([username], function(err, user){

        // store postinq wif in variable

        const pubWif = user[0].posting.key_auths[0][0];

        // check for the validity of the posting key

        if(steem.auth.isWif(password)){
            // check if the public key tallies with the private key provided

            const Valid = steem.auth.wifIsValid(password, pubWif);

            if(Valid){
               // create token and store in token variable

                var token = jwt.sign({ id: user._id }, config.secret, {
                    expiresIn: 86400
                });

                // if user authentication is successful send auth confirmation, token and user data as response

                res.json({
                    auth: true,
                    token: token,
                    user: user
                });
            } else {
                console.log("false");
            }
        }
    });
})

// log user out

router.get('/logout', function(req, res){
    // send response to falsify authentication and nullify token
  
    res.json({ 
      auth: false,
      token: null
    })
  })

module.exports = router;