
/*configure db - start */

var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');

var dbPort 		= 27017;
var dbHost 		= 'localhost';
var dbName 		= 'node-login';

/* establish the database connection */

var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
	db.open(function(e, d){
	if (e) {
		console.log(e);
	}	else{
		console.log('connected to database :: ' + dbName);
	}
});

/*configure db - end */


var accounts = db.collection('accounts');

var availability = db.collection('availability');

var evisits = db.collection('evisits');

var doctordetails = db.collection('doctordetails');
/* login validation methods */

exports.autoLogin = function(user, pass, callback)
{
	accounts.findOne({user:user}, function(e, o) {
		if (o){
			o.pass == pass ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
}

exports.manualLogin = function(user, pass, callback)
{
	accounts.findOne({user:user}, function(e, o) {
		if (o == null){
			callback('user-not-found');
		}	else{
			validatePassword(pass, o.pass, function(err, res) {
				if (res){
					callback(null, o);
				}	else{
					callback('invalid-password');
				}
			});
		}
	});
}

/* record insertion, update & deletion methods */

exports.addNewAccount = function(newData, callback)
{
	accounts.findOne({user:newData.user}, function(e, o) {
		if (o){
			callback('username-taken');
		}	else{
			saltAndHash(newData.pass, function(hash){
						newData.pass = hash;
					// append date stamp when record was created //
						newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
						accounts.insert(newData, {safe: true}, callback);
			});
		}
	});
}

exports.addNewAvailability = function(newData, callback)
{
	availability.findOne({$and : [{freedate:newData.freedate},{starttime:newData.starttime},{endtime:newData.endtime}] }, function(e, o) {
		if (o){
			callback('slot-taken');
		}	else{
					// append date stamp when record was created //
						newData.timestamp = moment().format('MMMM Do YYYY, h:mm:ss a');
						console.log("inserting new availability date" + newData.user + " " + newData.freedate + " " + newData.starttime +" " +newData.endtime + " "+ newData._id+ " "+ newData.timestamp);
						availability.insert(newData, {safe: true}, callback);
		}
	});
}

exports.getAllUserRecords = function(user, callback)
{
	console.log(" search parameter is " + user);

	availability.find( {user:user} ).toArray(
		function(e, results) {
		if (e) {
			console.log("error finding anything");
			callback(e);
		}
		else {
			console.log("results are " + results + results.length);
			callback(null, results)
		}
	});

}


exports.validateAndAddNewEVisit = function(newData, callback)
{

	availability.findOne({$and : [{freedate:{$gte: newData.rangestartdate}},{freedate:{$lte: newData.rangeenddate}}] }, function(e,o){
		
		//other variables we will automatically take from the 'o' variable are o.freedate, o.starttime, o.endtime

		if (e || (o == null)){
			console.log("no free doctor hours block found");
			callback(e, null);
		} else {
			o.doctoruser = o.user;
			o.patient1name = newData.patient1name,
			o.patient1dob = newData.patient1dob,
			o.patient2name = newData.patient2name,
			o.patient2dob = newData.patient2dob,
			o.patient3name = newData.patient3name,
			o.patient3dob = newData.patient3dob,
			o.patient4name = newData.patient4name,
			o.patient4dob = newData.patient4dob,
			o.nursename = newData.nursename,
			o.nursinguser = newData.user
			console.log("doctor found for that time range");
			evisits.insert(o, {safe: true}, callback (null, o));
		}

	})


}


exports.updateAccount = function(newData, callback)
{
	accounts.findOne({user:newData.user}, function(e, o){
		o.name 		= newData.name;
		o.email 	= newData.email;
		o.state 	= newData.state;
		o.address   = newData.address;
		o.phone		= newData.phone;
		o.role		= newData.role;

		if (newData.pass == ''){
			accounts.save(o, {safe: true}, function(err) {
				if (err) callback(err);
				else callback(null, o);
			});
		}	else{
			saltAndHash(newData.pass, function(hash){
				o.pass = hash;
				accounts.save(o, {safe: true}, function(err) {
					if (err) callback(err);
					else callback(null, o);
				});
			});
		}
	});
}

exports.updatePassword = function(email, newPass, callback)
{
	accounts.findOne({email:email}, function(e, o){
		if (e){
			callback(e, null);
		}	else{
			saltAndHash(newPass, function(hash){
		        o.pass = hash;
		        accounts.save(o, {safe: true}, callback);
			});
		}
	});
}

/* account lookup methods */

exports.deleteAccount = function(id, callback)
{
	accounts.remove({_id: getObjectId(id)}, callback);
}

exports.deleteAvailability = function(id, callback)
{
	console.log("actual id is " + getAvailabilityObjectId(id));
	availability.remove({_id: getAvailabilityObjectId(id)}, callback);
}

exports.getAccountByEmail = function(email, callback)
{
	accounts.findOne({email:email}, function(e, o){ callback(o); });
}

exports.getAccountByUserName = function(user, callback){
	accounts.findOne({user:user},  function(e, o){ callback(o); });
}

exports.validateResetLink = function(email, passHash, callback)
{
	accounts.find({ $and: [{email:email, pass:passHash}] }, function(e, o){
		callback(o ? 'ok' : null);
	});
}

exports.getAllRecords = function(callback)
{
	accounts.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

exports.delAllRecords = function(callback)
{
	accounts.remove({}, callback); // reset accounts collection for testing //
}

/* private encryption & validation methods */

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
}

/* auxiliary methods */

var getObjectId = function(id)
{
	return accounts.db.bson_serializer.ObjectID.createFromHexString(id)
}

var getAvailabilityObjectId = function(id)
{
	return availability.db.bson_serializer.ObjectID.createFromHexString(id)
}

var findById = function(id, callback)
{
	accounts.findOne({_id: getObjectId(id)},
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};


var findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //

	console.log(" search parameter is " + a);

	accounts.find( {user:'doctor1'} ).toArray(
		function(e, results) {
		if (e) {
			callback(e);
		}
		else {
			callback(null, results)
		}
	});
}
