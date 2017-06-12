module.exports = {
  canHandle: function () {
    return true
  },
  FileSystem: function () {
    var fs = require('fs')

    return {
      readAsStream: function (folder, fileName) {
        let stream = fs.createReadStream(pathFrom(folder, fileName))
        stream.setEncoding('utf8')

        return stream
      },

      writeAsStream: function (folder, fileName, stream) {
        let path = pathFrom(folder, fileName)

        return new Promise((resolve, reject) => {
          let writeStream = fs.createWriteStream(path, {flags: 'w'})

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
      },

      read: function (folder, fileName, HTTPRangeHeader) {
        let path = pathFrom(folder, fileName)

        if (HTTPRangeHeader) {
          let range = parseRange(HTTPRangeHeader)
          return readWithRange(path, range)
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
      },

      write: function (folder, fileName, body) {
        let path = pathFrom(folder, fileName)

        return new Promise((resolve, reject) => {
          fs.writeFile(path, body, function (err) {
            if (err) {
              reject(err)
            } else {
              resolve()
            }
          })
        })
      },

      head: function (folder, fileName) {
        let path = pathFrom(folder, fileName)

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
      },

      delete: function (folder, fileName) {
        return new Promise((resolve, reject) => {
          fs.unlink(pathFrom(folder, fileName), resolve)
        })
      }
    }

    function readWithRange (path, range) {
      return new Promise((resolve, reject) => {
        fs.open(path, 'r', (error, file) => {
          if (error) {
            reject(error)
            return
          }
          let buffer = new Buffer(range.size)
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

    function parseRange (HTTPRangeHeader) {
      let rangeString = HTTPRangeHeader.split('=')[1]
      let range = rangeString.split('-')

      return {
        start: parseInt(range[0]),
        size: parseInt(range[1]) + 1
      }
    }

    function pathFrom (folder, fileName) {
      return `${folder}/${fileName}`
    }
  }
}
