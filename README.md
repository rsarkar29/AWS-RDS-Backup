# AWS RDS Backup to S3 Bucket using Lamda & API Gateway

![alt text](https://d2908q01vomqb2.cloudfront.net/1b6453892473a467d07372d45eb05abc2031647a/2018/09/26/services.png)

## How to Configure
1. Create a Lamda function with nodejs as a codebase.
2. Use API Gateway to trigger lamda from external
3. create a S3 bucket to store database backup from RDS

## Module required

```
const AWS = require('aws-sdk');
const childProcess = require('child_process');
var moment = require("moment");
```

## AWS Account API key and Secret key

Go to aws console, and click on IAM user and create a API key for your account.

```
AWS.config.accessKeyId = "xxxxx";
AWS.config.secretAccessKey = "xxxxx";
```

## RDS Credentials

```
var rds_host = "xxxxx";
var username = "xxxxx";
var password = "xxxxx";
var databaseName = "xxxxx";
```

## S3 Bucket Name
Create a bucket on S3 First

```
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

```

If you dont want to use LAMDA then simple, Change this below code.

```
exports.DatabaseDump = ((event, context, callback) => {
    var dumpCommand = `mysqldump -h${rds_host} -u${username} -p${password} ${databaseName}`;
    childProcess.exec(dumpCommand, (error, stdout, stderr)=> {
        var bufferData = Buffer.from(stdout, 'utf8');
        uploadToS3(createKey(), bufferData);
        callback(null, bufferData);
    });

});

```
To

```
    DatabaseDump = ((event, context, callback) => {
    var dumpCommand = `mysqldump -h${rds_host} -u${username} -p${password} ${databaseName}`;
    childProcess.exec(dumpCommand, (error, stdout, stderr)=> {
        var bufferData = Buffer.from(stdout, 'utf8');
        uploadToS3(createKey(), bufferData);
        callback(null, bufferData);
    });

});

DatabaseDump();

```



