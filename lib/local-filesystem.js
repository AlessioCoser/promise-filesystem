var fs = require('fs')

module.exports = function () {
  this.readAsStream = function (folder, fileName) {
    var stream = fs.createReadStream(`${folder}/${fileName}`)
    stream.setEncoding('utf8')

    return stream
  }
}
