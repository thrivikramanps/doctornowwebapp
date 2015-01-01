
var CT = require('./modules/state-list');
var RT = require('./modules/role-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');
//var UM = require('./modules/upload-manager');
//var AVM = require('./modules/availability-manager');



module.exports = function(app) {

// main login page //

	app.get('/', function(req, res){
		console.log("reached here 1");
	// check if the user's credentials are saved in a cookie //
		if (req.cookies.user == undefined || req.cookies.pass == undefined){
			res.render('login2', { title: 'Hello - Please Login To Your Account' });
		}	else{
	// attempt automatic login //
			AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
				if (o != null){
				    req.session.user = o;
					res.redirect('/home');
				}	else{
					res.render('login2', { title: 'Hello - Please Login To Your Account' });
				}
			});
		}
	});
	
	app.post('/', function(req, res){
		console.log("reached here 2");
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
	


	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

};