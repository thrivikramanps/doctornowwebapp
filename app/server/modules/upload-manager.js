var querystring = require("querystring");
var formidable = require("formidable");
var path = require('path');
var fs = require ("fs");


exports.upload = function(formData, callback)
{
	console.log("entered the upload function");

	var form = new formidable.IncomingForm();
	form.uploadDir = __dirname + '/app/server/uploads/patientdata';
	form.keepExtensions = true;

	form.parse(req, function(err, fields, files)){
		res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        console.log("form.bytesReceived");
        //TESTING
        console.log("file size: "+JSON.stringify(files.fileUploaded.size));
        console.log("file path: "+JSON.stringify(files.fileUploaded.path));
        console.log("file name: "+JSON.stringify(files.fileUploaded.name));
        console.log("file type: "+JSON.stringify(files.fileUploaded.type));
        console.log("astModifiedDate: "+JSON.stringify(files.fileUploaded.lastModifiedDate));

	}
}

