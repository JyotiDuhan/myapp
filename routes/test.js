var express = require('express');
var RSVP = require('rsvp');

var app = express();
var router = express.Router();
//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;
var url = require('./db_conf');
// var Mailgun = require('mailgun-js');
// //Your api key, from Mailgun’s Control Panel
// var api_key = 'pubkey-06159c98af38d01de4858b2407c4d2c0';

// //Your domain, from the Mailgun Control Panel
// var domain = 'sandbox2702c13b87c945cdb8e263ee7e47a2d0.mailgun.org';

var collectionOne = [];
var b_ids = [];
var bank_ids = [];
var collectionTwo = [];
var collectionThree = [];
/* GET home page. */
router.get('/', function(req, res, next) {

	// Connection URL. This is where your mongodb server is running.

	MongoClient.connect(url, function (err, db) {
		if (err) {
		console.log('Unable to connect to the mongoDB server. Error:', err);
		}
	    // Get the documents collection
	    var collection = db.collection('users');

	    //Create some users
	    var user1 = {name: 'modulus admin', age: 5, roles: ['admin', 'moderator', 'user']};
	    var user2 = {name: 'modulus user', age: 5, roles: ['user']};
	    var user3 = {name: 'modulus super admin', age: 5, roles: ['super-admin', 'admin', 'moderator', 'user']};

	    // Insert some users
	    collection.insert([user1, user2, user3], function (err, result) {
	      if (err) {
	        console.log(err);
	      } else {
	        console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
	      }
	      //Close connection
	      db.close();
	    });
	});	  
});

router.get('/fetch',function(req, res, next){
	MongoClient.connect('mongodb://localhost:27017/local', function(err, db){
		var collection = db.collection('borrower');

		db.collection("borrower", function(err, collection) {
        	collection.find().toArray(function(err, result) {
	            if (err) {
	                throw err;
	            } else {
	                for (i=0; i<result.length; i++) {
	                    collectionOne[i] = result[i];
	                    b_ids[i] = result[i]._id;
	                    bank_ids[i] = result[i].loan_details.bank_id;
	                }

	                db.collection("company_details", function(err, collection){
	                	console.log(b_ids);
		                collection.find({borrower_id : {$in :b_ids}}).toArray(function(err, result){
		                    if (err) {
		                        throw err;
		                    } else {
		                        for (i=0; i<result.length; i++) {
		                            collectionTwo[i] = result[i];
		                        }
		                        //res.render('index',{data : collectionOne , data1 : collectionTwo});
		                    }
		                });
	            	});
	            	db.collection("available_banks", function(err, collection){
	            		collection.find({_id: {$in : bank_ids}}).toArray(function(err, result){
	            			if(err){
	            				throw err;
	            			}else {
	            				for(i=0; i<result.length; i++){
	            					collectionThree[i] = result[i];
	            				}
	            				res.render('index',{data : collectionOne , data1 : collectionTwo , data2 : collectionThree});

	            			}
	            		});
	            	});
        		}
        	});	
    	});
    });
});

router.get('/update',function(req, res, next){
	MongoClient.connect('mongodb://localhost:27017/local',function(err, db){
		db.collection("company_details",function(err, collection){
			collection.update({_id:2} , {$set : {com_name : "Coke"}},function(err, result){
				if(err){
					console.log(err);
				}else {
					console.log(result);
				}
			})
		});
	});
});

// router.get('/send', function(req, res, next){
// 	var mandrill = require('node-mandrill')('GtTILKClNOQKdfJV9OdLLw');
// 		mandrill('/messages/send', {
// 			    message: {
// 			        to: [{email: 'duhanjyoti@gmail.com', name: 'Jyoti'}],
// 			        from_email: 'jyoti.duhan@dhanax.co.in',
// 			        subject: "Profile Verification",
// 			        text: "Hello, I sent this message using mandrill.http://myapp.com ",
// 			        html: '<html><body><p>hello</p></body></html>'
// 			    }
// 			}, function(error, response)
// 			{
// 			    //uh oh, there was an error
// 			    if (error) console.log( JSON.stringify(error) );

// 			    //everything's good, lets see what mandrill said
// 			    else console.log(response);
// 		});
// });

router.get('/send',function(req, res, next){
    //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});

    var data = {
    //Specify email data
      from: 'duhanjyoti@gmail.com',
    //The email to contact
      to: 'jyoti.duhan@dhanax.co.in',
    //Subject and text data  
      subject: 'Profile Verification',
      html: 'Hello, This is not a plain-text email, I wanted to test some spicy Mailgun sauce in NodeJS! <a href="http://0.0.0.0:3030/validate?' + req.params.mail + '">Click here to add your email address to a mailing list</a>'
    }

    //Invokes the method to send emails given the above data with the helper library
    mailgun.messages().send(data, function (err, body) {
        //If there is an error, render the error page
        if (err) {
            //res.render('error', { error : err});
            console.log("got an error: ", err);
        }
        //Else we can greet    and leave
        else {
            //Here "submitted.jade" is the view file for this landing page 
            //We pass the variable "email" from the url parameter in an object rendered by Jade
            //res.render('submitted', { email : req.params.mail });
            console.log(body);
        }
    });

});

var name = "Jyoti";
router.get('/promise',function(req, res, next){
	var promise = new RSVP.Promise(function(resolve, reject){
		if(name){

		resolve(console.log(nam));
		// console.log(name);
		}
		reject(error);
	});

	promise.then(function(value){
		console.log('hiii');
	}, function(value){
		console.log('chek');
	});
});

module.exports = router;
