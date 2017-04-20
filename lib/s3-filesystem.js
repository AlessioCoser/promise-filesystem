var aws = require('aws-sdk')

module.exports = function () {
  var s3 = new aws.S3({signatureVersion: 'v4'})

  this.readAsStream = function (folder, fileName) {
    var stream = s3.getObject({
      Bucket: folder,
      Key: fileName
    }).createReadStream()
    stream.setEncoding('utf8')

    return stream
  }

  this.writeAsStream = function (folder, fileName, stream) {
    return new Promise((resolve, reject) => {
      s3.upload({
        Bucket: folder,
        Key: fileName,
        Body: stream,
        ACL: 'private'
      }, callback(resolve, reject))
    })
  }

  this.read = function (folder, fileName, HTTPRangeHeader) {
    return new Promise((resolve, reject) => {
      s3.getObject({
        Bucket: folder,
        Key: fileName,
        Range: HTTPRangeHeader
      }, callback(resolve, reject))
    })
  }

  this.write = function (folder, fileName, body) {
    return new Promise((resolve, reject) => {
      s3.putObject({
        Bucket: folder,
        Key: fileName,
        Body: body
      }, (err, data) => err ? reject(err) : resolve(data))
    })
  }

  this.head = function (folder, fileName) {
    return new Promise((resolve, reject) => {
      s3.headObject({
        Bucket: folder,
        Key: fileName
      }, callback(resolve, reject))
    })
  }

  this.delete = function (folder, fileName) {
    return new Promise((resolve, reject) => {
      s3.deleteObject({
        Bucket: folder,
        Key: fileName
      }, callback(resolve, reject))
    })
  }

  function callback (resolve, reject) {
    return function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    }
  }
}
