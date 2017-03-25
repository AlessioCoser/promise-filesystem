const {equal} = require('assert')
const fs = require('fs')
const LocalFileSystem = require('..').local

test('LocalFileSystem', function () {
  test.timeout('reads from Local Folder as stream', function (done) {
    var localFileSystem = new LocalFileSystem()
    var data = []

    localFileSystem.readAsStream('test/promise-filesystem', 'file.txt')
    .on('data', chunk => data.push(chunk))
    .on('end', () => {
      equal(String.prototype.concat(data), 'lorem ipsum dolor sit amet.\n')
      done()
    })
  }, 30000)
})
