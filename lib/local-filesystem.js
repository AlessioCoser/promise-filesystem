var fs = require('fs')

module.exports = function () {
  this.readAsStream = function (folder, fileName) {
    var stream = fs.createReadStream(`${folder}/${fileName}`)
    stream.setEncoding('utf8')

    return stream
  }

  this.writeAsStream = function (folder, fileName, stream) {
    return new Promise((resolve, reject) => {
      var writeStream = fs.createWriteStream(`${folder}/${fileName}`, { flags : 'w' })

      stream.setEncoding('utf8')

      stream.on('data', function(chunk) {
          writeStream.write(chunk)
      })
      .on('end', function (data) {
        resolve({
          Location: `${folder}/${fileName}`,
          FileName: fileName,
          Folder: folder
        })
      })
      .on('error', function (err) {
        reject(err)
      })
    })
  }

  this.read = function(folder, fileName) {
    return new Promise((resolve, reject) => {
      fs.readFile(`${folder}/${fileName}`, 'utf8', function(err, data) {
         if (err) {
           reject(err)
         } else {
           resolve({Body: data})
         }
       })
    })
  }

  this.head = function(folder, fileName) {
    return new Promise((resolve, reject) => {
      fs.stat(`${folder}/${fileName}`, function(err, stats) {
        if (err) {
          reject(err)
        } else {
          resolve({
            AcceptRanges: 'bytes',
            LastModified: stats.mtime,
            ContentLength: stats.size,
            ETag: null,
            ContentType: null,
            Metadata: {}
          })
        }
      })
    })
  }
}
