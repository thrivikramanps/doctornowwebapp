
var CT = require('./modules/state-list');
var RT = require('./modules/role-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');

var util = require("util"); 
var fs = require("fs");

var formidable = require('formidable');
var path = require('path');     //used for file path




module.exports = function(app) {

// main login page //

	app.get('/', function(req, res){
		if (req.cookies.user == undefined || req.cookies.pass == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account' });
		}	else{
			AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
				if (o != null){
				    req.session.user = o;
					res.redirect('/home');
				}	else{
					res.render('login', { title: 'Hello - Please Login To Your Account' });
				}
			});
		}
	});
	
	app.post('/', function(req, res){
		AM.manualLogin(req.param('user'), req.param('pass'), function(e, o){
			if (!o){
				res.send(e, 400);
			}	else{
			    req.session.user = o;
			    var modified_req_session = req.session.user;
		    	var logintimestamp = new Date();
		    	var logintime = logintimestamp.getHours() +":"+logintimestamp.getMinutes() +":"+ logintimestamp.getSeconds();
		    	modified_req_session.logintime = logintime;
		    	req.session.user = modified_req_session;
				if (req.param('remember-me') == 'true'){
					res.cookie('user', o.user, { maxAge: 900000 });
					res.cookie('pass', o.pass, { maxAge: 900000 });
				}
				res.send(o, 200);
			}
		});
	});
	
// logged-in user homepage //
	
	app.get('/home', function(req, res) {
	    if (req.session.user == null){
	        res.redirect('/');
	    }   else{
	    	
	    	var session_variable = req.session.user;


	    	AM.getAccountByUserName(session_variable.user, function(o){

	    		var session_var = req.session.user;

	    		if (o.role === 'Admin') {
					res.render('home-admin', {
						udata : req.session.user
					});
				}
				else if (o.role === 'Doctor') {
					res.render('home-DOC', {
						udata : req.session.user
					});
				}
				else {
					res.render('home-NH', {
						udata : req.session.user
					});
				}
			});
	    }
	});
	
	app.post('/home', function(req, res){
		if (req.param('user') != undefined) {
			AM.updateAccount({
				user 		: req.param('user'),
				name 		: req.param('name'),
				email 		: req.param('email'),
				state 		: req.param('state'),
				pass		: req.param('pass')
			}, function(e, o){
				if (e){
					res.send('error-updating-account', 400);
				}	else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user != undefined && req.cookies.pass != undefined){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });	
					}
					res.send('ok', 200);
				}
			});
		}	else if (req.param('logout') == 'true'){
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function(e){ res.send('ok', 200); });
		}
	});

	app.get('/booking', function(req,res) {
		if (req.session.user == null) {
			res.redirect('/');
		}	else{
					res.render('bookevisit', {
						udata : req.session.user
					});

		}

	});



	app.post('/upload', function (req, res) {
		var form = new formidable.IncomingForm();

	    form.uploadDir = "./uploads";       //set upload directory
    	form.keepExtensions = true;     //keep file extension

    	var parseResult = false;

    	form
		    .on('error', function(err) {
		    	console.log("error with form upload");
		    	parseResult = false;
		    })
		    .on('file', function(field, file) {
		        //On file received
		        fs.rename(file.path, form.uploadDir + "/" + file.name);
		    })
		    .on('progress', function(bytesReceived, bytesExpected) {
		        //self.emit('progess', bytesReceived, bytesExpected)
		        var percent = (bytesReceived / bytesExpected * 100) | 0;
		        console.log('Uploading: %' + percent + '\r');
		    })
		    .on('end', function() {
		    	console.log("form parsing ended");
		    	parseResult = true;
		    });

	    form.parse(req);

	    if (parseResult)
	    	res.send('ok', 200);
	    else
	    	res.send('bad result', 400);
	});

	/*app.post('/upload', function(req, res, next) {
		if (req.files) { 
			console.log(util.inspect(req.files));
			if (req.files.patientfile.size === 0) {
			            return next(new Error("Hey, first would you select a file?"));
			}

			var is_exist = false;

			fs.readFile(req.files.patientfile.path, function (err, data) {

				fs.exists(req.files.patientfile.path, function(exists) { 
					if(exists) { 
						is_exist = true;
						console.log("exists returned true");
					} else { 
						console.log("exists did not return true");
						res.send({
		                    	error: 'Something bad happened'
						});
						return;
					} 
				}); 
			});

			if (is_exist){
				var serverPath = '/patientpdf/' + req.files.patientfile.name;
				console.log("server path is " + serverPath);

				fs.rename(req.files.patientfile.path, __dirname + serverPath,
					function(error) {
		            	if(error) {
							res.send({
		                    	error: 'Something bad happened'
							});
		                	return;
		            	}

            			console.log("sending success from server");
 
			            res.send({
							path: serverPath
			            });
				});
			} else
				res.send({error: 'Something bad happened - new'});
		}
	});*/

	/// Post files
	/*app.post('/upload', function(req, res) {

		fs.readFile(req.files.patientfile.path, function (err, data) {
			var imageName = req.files.patientfile.name
			/// If there's an error
			if(!imageName){

				console.log("There was an error")
				res.redirect("/");
				res.end();

			} else {

			  var newPath = __dirname + "/uploads/" + imageName;
			  /// write file to uploads/fullsize folder
			  fs.writeFile(newPath, data, function (err) {

			  	/// let's see it
			  //	res.redirect("/uploads/" + imageName);

			  });
			}
		});
	});

	app.get('/uploads/:file', function (req, res){
		file = req.params.file;
		var img = fs.readFileSync(__dirname + "/uploads/" + file);
		res.writeHead(200, {'Content-Type': 'application/pdf' });
		res.end(img, 'binary');
	});*/

	/*app.post('/upload', function(req,res){
		console.log(JSON.stringify(req.files));

		var serverPath = '/patientpdf/' + req.files.patientfile.name;
		console.log("server path is " + serverPath);

		require('fs').rename(req.files.patientfile.path, __dirname + serverPath,
			function(error) {
            	if(error) {
					res.send({
                    	error: 'Something bad happened'
					});
                	return;
            	}

            	console.log("sending success from server");
 
	            res.send({
					path: serverPath
	            });
			}
    	);

	});*/
	

	app.post('/booking', function(req,res) {
		if (req.session.user == null) {
			res.redirect('/');
		} else if (req.param('rangestartdate') != null && req.param('rangeenddate') != null){
			var session_variable = req.session.user;
		//	console.log(req.param('rangestartdate'));
			AM.validateAndAddNewEVisit({
				user 	: session_variable.user,
				patient1name : req.param('patient1name'),
				patient1dob : req.param('patient1dob'),
				patient2name : req.param('patient2name'),
				patient2dob : req.param('patient2dob'),
				patient3name : req.param('patient3name'),
				patient3dob : req.param('patient3dob'),
				patient4name : req.param('patient4name'),
				patient4dob : req.param('patient4dob'),
				rangestartdate : req.param('rangestartdate'),
				rangeenddate	: req.param('rangeenddate'),
				nursename	: req.param('nursename')
			}, function(e, o) {


				if (o!=null) {
					
					var session_variable = req.session.user;
					session_variable.doctoruser = o.user;
					console.log(o.user);
					session_variable.patient1name = req.param('patient1name');
					console.log(req.param('patient1name'));
					session_variable.patient2name = req.param('patient2name');
					console.log(req.param('patient2name'));
					session_variable.patient3name = req.param('patient3name');
					console.log(req.param('patient3name'));
					session_variable.patient4name = req.param('patient4name');
					console.log(req.param('patient4name'));
					session_variable.appointmentdate = o.freedate;
					console.log(session_variable.appointmentdate);
					session_variable.appointmentstart = o.starttime;
					console.log(session_variable.appointmentstart);
					session_variable.appointmentend = o.endtime;
					console.log(session_variable.appointmentend);
					/*session_variable.doctorname = o.doctorname;
					session_variable.doctorphoto = o.doctorphoto;*/
					session_variable.availabilitydeletionid = o._id;
					console.log(session_variable.availabilitydeletionid);
					req.session.user = session_variable;
					res.send('ok', 200);

				} else {
						/*if ("03012015" >= toString(req.param('rangestartdate')))
							console.log("test is gte");
						else
							console.log("test is lt" + req.param('rangestartdate'));*/
						res.send('no-such-account', 400);	
				}
			});

		}
	});

	app.get('/booking-failure', function(req, res){
		if (req.session.user == null){
			res.redirect('/');
		}
		else{
			res.render('booking-failure', {
				udata:req.session.user
			});
		}
	});

	app.get('/booking-success', function(req, res){
		if (req.session.user == null)
			res.redirect('/');
		else{
			var session_variable = req.session.user;
			console.log( " before rendering success booking" + session_variable.availabilitydeletionid);
			console.log( " before rendering success booking" + session_variable.doctoruser);
			AM.deleteAvailability(session_variable.availabilitydeletionid, function(){
					//res.send("gen-success", 200);
			});

			res.render('booking-success', {
				udata:req.session.user
			})
		}

	});

	app.get('/availability', function(req, res) {
	    if (req.session.user == null){
	        res.redirect('/');
	    }   else{
					res.render('availability', {
						udata : req.session.user
					});
				}
	});
	
	app.post('/availability', function(req,res) {
		if (req.session.user == null){
			res.redirect('/');
		}	else if (req.param('action') === 'enter to db') {
			//submitted a new task
			var session_variable = req.session.user;
			AM.addNewAvailability({
				user      : session_variable.user,
				freedate  : req.param('freedate'),
				starttime : req.param('starttime'),
				endtime	  : req.param('endtime')
			}, function(e) {
				if (e) {
					res.send(e, 400);
				} else{
					res.send('ok', 200);
				}
			});
		} else if (req.param('action') === 'display current availability') {
			var session_variable2 = req.session.user;
			console.log(" user is " + session_variable2.user);
			AM.getAllUserRecords(session_variable2.user, function(e,o){
				if (o){
					console.log("returning success");
					res.send(o, 200);
				}
				else{
					res.send(e,400);
				} 

			});
		} else if (req.param('action') === 'delete from db') {
			AM.deleteAvailability(req.param('identity'), function(){
					res.send("gen-success", 200);
			});
		}
	});
	
	app.get('/evisitsession', function(req, res) {
		if (req.session.user == null){
			res.redirect('/');
		} else {
			res.render('evisitsession', {
					udata : req.session.user
			});
		}
	});

	app.get('/evisitreview', function(req,res) {
		if (req.session.user == null) {
			res.redirect('/');
		} else {
			var session_variable = req.session.user;

			if (session_variable.role === 'Nursing Home')
			{
				AM.getAlleVisitsByUserName(session_variable.user, 'NH', function (e,o) {
					if (e)
						res.send(e, 400);
					else {
						console.log (" nurse list length is " + o.length);
						res.render('evisitlist-NH', {
							listevisits: o || [],
							udata: req.session.user
						});
						//res.send("ok", 200);
					}
				});
			} else if (session_variable.role === 'Doctor')
			{
				AM.getAlleVisitsByUserName(session_variable.user, 'DOC', function (e,o) {
					if (e)
						res.send(e, 400);
					else {
						console.log ("doctor list length is " + o.length);
						res.render('evisitlist-DOC', {
							listevisits: o || [],
							udata: req.session.user
						});
						//res.send("ok", 200);
					}
				});
			} else if (session_variable.role === 'Admin')
			{
				AM.getAlleVisitsByUserName(null, 'ADMIN', function (e,o) {
					if (e)
						res.send(e, 400);
					else {
						console.log("admin list length is " + o.length);
						res.render('evisitlist-admin', {
							listevisits: o || [],
							udata: req.session.user
						});
					}
				});
			}

		}
	});

	app.post('/evisitreview', function(req,res) {
		if (req.session.user == null) {
			res.redirect('/');
		} else {
			if (req.param('action') === 'delete'){
				AM.deleteeVisit(req.param('identity'), function(){
					res.send("gen-success", 200);
				});
			} else if (req.param('action') === 'fetch') {
				var session_variable = req.session.user;
				AM.fetcheVisitPatients(req.param('identity'), function(e,o){
					if (e)
						res.send(e, 400);
					else {
						o.role = session_variable.role;
						res.send(o, 200);
					}
				});
			} else if (req.param('action') === 'fetchpdf'){
				var type = req.param('type');
				var identity = req.param('identity');

				console.log(" we are looking for " + type + " " + identity);

				var desired_filename = './uploads/' + type + "_" + identity.toString() + '.pdf';

				console.log("desired file is at path " + desired_filename);

				res.send("ouch", 400);
			}
		}

	});
	
	app.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Signup', states : CT, roles: RT});
	});
	
	app.post('/signup', function(req, res){
		AM.addNewAccount({
			name 	: req.param('name'),
			email 	: req.param('email'),
			user 	: req.param('user'),
			pass	: req.param('pass'),
			state 	: req.param('state'),
			phone	: req.param('phone'),
			address	: req.param('address'),
			role    : req.param('role')

		}, function(e){
			if (e){
				res.send(e, 400);
			}	else{
				res.send('ok', 200);
			}
		});
	});

// password reset //

	app.post('/lost-password', function(req, res){
	// look up the user's account via their email //
		AM.getAccountByEmail(req.param('email'), function(o){
			if (o){
				res.send('ok', 200);
				EM.dispatchResetPasswordLink(o, function(e, m){
				// this callback takes a moment to return //
				// should add an ajax loader to give user feedback //
					if (!e) {
					//	res.send('ok', 200);
					}	else{
						res.send('email-server-error', 400);
						for (k in e) console.log('error : ', k, e[k]);
					}
				});
			}	else{
				res.send('email-not-found', 400);
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		var email = req.query["e"];
		var passH = req.query["p"];
		AM.validateResetLink(email, passH, function(e){
			if (e != 'ok'){
				res.redirect('/');
			} else{
				req.session.reset = { email:email, passHash:passH };
				res.render('reset', { title : 'Reset Password' });
			}
		});
	});
	
	app.post('/reset-password', function(req, res) 
	{
		var nPass = req.param('pass');
	
		var email = req.session.reset.email;
		req.session.destroy();
		AM.updatePassword(email, nPass, function(e, o){
			if (o){
				res.send('ok', 200);
			}	else{
				res.send('unable to update password', 400);
			}
		});
	});
	
// view & delete accounts //
	
	app.get('/print', function(req, res) {
		AM.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts });
		})
	});
	
	app.post('/delete', function(req, res){
		AM.deleteAccount(req.body.id, function(e, obj){
			if (!e){
				res.clearCookie('user');
				res.clearCookie('pass');
	            req.session.destroy(function(e){ res.send('ok', 200); });
			}	else{
				res.send('record not found', 400);
			}
	    });
	});
	
	app.get('/reset', function(req, res) {
		AM.delAllRecords(function(){
			res.redirect('/print');	
		});
	});

	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

};