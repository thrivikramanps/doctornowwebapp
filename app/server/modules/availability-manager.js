
/*configure db - start */

var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');

var dbPort 		= 27017;
var dbHost 		= 'localhost';
var dbName 		= 'availability-db';

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


var availability = db.collection('availability');
/* login validation methods */

/* record insertion, update & deletion methods */

exports.addNewAvailability = function(newData, callback)
{
	availability.findOne({$and : [{date:newData.date},{starttime:newData.starttime},{endtime:newData.endtime}] }, function(e, o) {
		if (o){
			callback('slot-taken');
		}	else{
					// append date stamp when record was created //
						newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
						availability.insert(newData, {safe: true}, callback);
		}
	});
}


/* account lookup methods */

exports.deleteTask = function(id, callback)
{
	availability.remove({_id: getObjectId(id)}, callback);
}

exports.getAccountByEmail = function(email, callback)
{
	availability.findOne({email:email}, function(e, o){ callback(o); });
}

exports.getAvailabilityByUserName = function(user, callback){
	availability.findOne({user:user},  function(e, o){ callback(o); });
}

exports.getAllAvailability = function(callback)
{
	availability.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

exports.delAllAvailability = function(callback)
{
	availability.remove({}, callback); // reset availability collection for testing //
}

/* private encryption & validation methods */


var getObjectId = function(id)
{
	return availability.db.bson_serializer.ObjectID.createFromHexString(id)
}

var findById = function(id, callback)
{
	availability.findOne({_id: getObjectId(id)},
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};


var findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
	availability.find( { $or : a } ).toArray(
		function(e, results) {
		if (e) callback(e)
		else callback(null, results)
	});
}
