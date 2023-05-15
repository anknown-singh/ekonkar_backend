const AWS = require("aws-sdk");
const formidable = require("formidable");
const uuid = require("uuid");
const fs = require("fs");
const config = require("../../config/keys");

let s3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
});

function uploadToS3(file, destFileName, callback) {
  let uploadParams = {
    Bucket: config.aws.bucket,
    Key: destFileName,
    Body: "",
  };

  uploadParams.Body = file;
  s3.upload(uploadParams, callback);
}

function deleteFile(filePath) {
  fs.unlink(filePath, function (err) {
    if (err) {
      console.error(err);
    }
  });
}

const uploadtoaws = (request, response) => {
  var form = new formidable.IncomingForm();
  form.parse(request, function (error, fields, files) {
    let fileId = uuid.v4();
    let filename = `user-photos/${fileId}.jpg`;
    let file = files.image;

    var rawData = fs.readFileSync(file.path);

    if (!/^image\/(jpe?g|png)$/i.test(file.type)) {
      deleteFile(file.path);
      response.write(
        '{"status": 403, "message": "Expects Image File. Please try again."}'
      );
      return response.end();
    }

    uploadToS3(rawData, filename, function (error, data) {
      if (error) {
        console.log(error);
        response.write(
          '{"status": 442, "message": "Yikes! Error uploading your photo. Please try again."}'
        );
        return response.end();
      } else if (data) {
        response.write(
          JSON.stringify({
            type: "ImageUploadToAWS : Success",
            status: "success",
            message: "Image Uploaded successfully",
            uri: data.Location,
          })
        );
        return response.end();
      } else {
        response.write(
          '{"status": 442, "message": "Yikes! Error saving your photo. Please try again."}'
        );
        return response.end();
      }
    });
  });
};

module.exports = uploadtoaws;
