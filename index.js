const AWS = require('aws-sdk');
const childProcess = require('child_process');
var moment = require("moment");

var rds_host = "xxxxx";
var username = "xxxxx";
var password = "xxxxx";
var databaseName = "xxxxx";

var createKey = (()=> {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth()+1;
    var key  =  databaseName + '-' + moment().format('YYYY-MM-DD-HH-mm-ss') + '.sql';
    return key;
});

var uploadToS3 = ((key, buffer)=> {
    AWS.config = new AWS.Config();
    AWS.config.accessKeyId = "xxxxx";
    AWS.config.secretAccessKey = "xxxxx";
    var s3 = new AWS.S3();
    s3.putObject({
        Bucket: "xxxxxx",
        Key: key,
        Body: buffer
    }, function (err, resp) {
        if (err) {
            console.log(err)
            return
        }
        console.log("Database Upload Done");
    });
});

exports.DatabaseDump = ((event, context, callback) => {
    var dumpCommand = `mysqldump -h${rds_host} -u${username} -p${password} ${databaseName}`;
    childProcess.exec(dumpCommand, (error, stdout, stderr)=> {
        var bufferData = Buffer.from(stdout, 'utf8');
        uploadToS3(createKey(), bufferData);
        callback(null, bufferData);
    });

});
