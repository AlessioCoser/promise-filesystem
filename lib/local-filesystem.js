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
}
