var options = {
    tmpDir:  __dirname + '/app/server/uploaded/tmp',
    uploadDir: __dirname + '/app/server/uploaded/files',
    uploadUrl:  '/uploaded/files/',
    maxPostSize: 11000000000, // 11 GB
    minFileSize:  1,
    maxFileSize:  10000000000, // 10 GB
    acceptFileTypes:  /.+/i,
    // Files not matched by this regular expression force a download dialog,
    // to prevent executing any scripts in the context of the service domain:
    inlineFileTypes:  /\.(gif|jpe?g|png)/i,
    imageTypes:  /\.(gif|jpe?g|png)/i,
    copyImgAsThumb : true, // required
    imageVersions :{
        maxWidth : 200,
        maxHeight : 200
    },
    accessControl: {
        allowOrigin: '*',
        allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
        allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
    },
    storage : {
        type : 'aws',
        aws : {
            accessKeyId :  'XXXXXXXXXXXXXXXXXXXXXXXX',
            secretAccessKey : 'XXXXXXXXXXXXXXXXXXXXXXXX',
            region : 'us-west-2', //make sure you know the region, else leave this option out
            bucketName : 'XXXXXXXXXXXXXXXXXXXXXXXX'
        }
    }
};

var uploader = require('blueimp-file-upload-expressjs')(options);



    exports.uploadget = function(req, res) {
      uploader.get(req, res, function (obj) {
            res.send(JSON.stringify(obj)); 
      });
      
    }

    exports.uploadpost = function(req, res) {
      uploader.post(req, res, function (obj) {
            res.send(JSON.stringify(obj)); 
      });
      
    }