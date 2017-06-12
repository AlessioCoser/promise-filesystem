module.exports = {
  canHandle: function (SdkS3) {
    if (!!SdkS3 && SdkS3.serviceIdentifier && SdkS3.serviceIdentifier === 's3') {
      return true
    }
    return false
  },
  FileSystem: function (SdkS3) {
    const s3 = new SdkS3({signatureVersion: 'v4'})

    return {
      readAsStream: function (folder, fileName) {
        let stream = s3.getObject({
          Bucket: folder,
          Key: fileName
        }).createReadStream()
        stream.setEncoding('utf8')

        return stream
      },

      writeAsStream: function (folder, fileName, stream) {
        return new Promise((resolve, reject) => {
          s3.upload({
            Bucket: folder,
            Key: fileName,
            Body: stream,
            ACL: 'private'
          }, callback(resolve, reject))
        })
      },

      read: function (folder, fileName, HTTPRangeHeader) {
        return new Promise((resolve, reject) => {
          s3.getObject({
            Bucket: folder,
            Key: fileName,
            Range: HTTPRangeHeader
          }, callback(resolve, reject))
        })
      },

      write: function (folder, fileName, body) {
        return new Promise((resolve, reject) => {
          s3.putObject({
            Bucket: folder,
            Key: fileName,
            Body: body
          }, (err, data) => err ? reject(err) : resolve(data))
        })
      },

      head: function (folder, fileName) {
        return new Promise((resolve, reject) => {
          s3.headObject({
            Bucket: folder,
            Key: fileName
          }, callback(resolve, reject))
        })
      },

      delete: function (folder, fileName) {
        return new Promise((resolve, reject) => {
          s3.deleteObject({
            Bucket: folder,
            Key: fileName
          }, callback(resolve, reject))
        })
      }
    }
  }
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
