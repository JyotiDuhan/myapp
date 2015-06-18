var express = require('express');
var router = express.Router();

router.get('/',function(req, res){

    //var client = require('twilio')('ACCOUNT_SID', 'AUTH_TOKEN');
    var accountSid = '<twilio ACCOUNT_SID>'; 
    var authToken = '<twilio AUTH_TOKEN>'; 
     
    //require the Twilio module and create a REST client 
    var client = require('twilio')(accountSid, authToken); 
    var mob = '<mobile number to whom u want to sent message>';
    //Send an SMS text message
    client.sendMessage({

        to:mob, // Any number Twilio can deliver to
        from: '<twilio mobile number>', // A number you bought from Twilio and can use for outbound communication
        body: 'Your verification code is 3456' // body of the SMS message

    }, function(err, responseData) { //this function is executed when a response is received from Twilio

        if (!err) { // "err" is an error received during the request, if any

            // "responseData" is a JavaScript object containing data received from Twilio.
            // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
            // http://www.twilio.com/docs/api/rest/sending-sms#example-1

            console.log(responseData.from); // outputs "+14506667788"
            console.log(responseData.body); // outputs "word to your mother."
            res.send('Hiii');
        }
    });

});

module.exports = router;
