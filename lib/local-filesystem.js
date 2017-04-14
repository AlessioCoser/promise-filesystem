var fs = require('fs')

module.exports = function () {
  this.readAsStream = function (folder, fileName) {
    var stream = fs.createReadStream(this._path(folder, fileName))
    stream.setEncoding('utf8')

    return stream
  }

  this.writeAsStream = function (folder, fileName, stream) {
    var path = this._path(folder, fileName)

    return new Promise((resolve, reject) => {
      var writeStream = fs.createWriteStream(path, {flags: 'w'})

      stream.setEncoding('utf8')

      stream.on('data', function (chunk) {
        writeStream.write(chunk)
      })
      .on('end', function (data) {
        resolve({
          Location: path,
          FileName: fileName,
          Folder: folder
        })
      })
      .on('error', function (err) {
        reject(err)
      })
    })
  }

  this.read = function (folder, fileName, HTTPRangeHeader) {
    var path = this._path(folder, fileName)

    if (HTTPRangeHeader) {
      let range = this._parseRange(HTTPRangeHeader)
      return this._readWithRange(path, range)
    }

    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', function (err, data) {
        if (err) {
          reject(err)
        } else {
          resolve({Body: data})
        }
      })
    })
  }

  this.write = function (folder, fileName, body) {
    var path = this._path(folder, fileName)

    return new Promise((resolve, reject) => {
      fs.writeFile(path, body, function(err) {
        if(err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  this.head = function (folder, fileName) {
    var path = this._path(folder, fileName)

    return new Promise((resolve, reject) => {
      fs.stat(path, function (err, stats) {
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

  this._readWithRange = function (path, range) {
    return new Promise((resolve, reject) => {
      fs.open(path, 'r', (error, file) => {
        if (error) {
          reject(error)
          return
        }
        var buffer = new Buffer(range.size)
        fs.read(file, buffer, 0, range.size, range.start, (err, bytesRead, buffer) => {
          if (err) {
            reject(err)
          } else {
            resolve({Body: buffer})
          }
        })
      })
    })
  }

  this._parseRange = function (HTTPRangeHeader) {
    var rangeString = HTTPRangeHeader.split('=')[1]
    var range = rangeString.split('-')

    return {
      start: parseInt(range[0]),
      size: parseInt(range[1]) + 1
    }
  }

  this._path = function (folder, fileName) {
    return `${folder}/${fileName}`
  }
}
