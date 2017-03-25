const {equal, deepEqual} = require('assert')
const fs = require('fs')
const stringToStream = require('string-to-stream')
const LocalFileSystem = require('..').local

const folder = 'test/promise-filesystem'
const readFileName = 'file.txt'
const writeFileName = 'write-as-stream.txt'

test('LocalFileSystem', function () {
  test.timeout('reads from Local Folder as stream', function (done) {
    var localFileSystem = new LocalFileSystem()
    var data = []

    localFileSystem.readAsStream(folder, readFileName)
    .on('data', chunk => data.push(chunk))
    .on('end', () => {
      equal(String.prototype.concat(data), 'Lorem ipsum dolor sit amet.\n')
      done()
    })
  }, 30000)

  test.timeout('writes to Local Folder as stream', function (done) {
    var localFileSystem = new LocalFileSystem()
    var aStream = stringToStream('Lorem ipsum dolor sot amet.\n')

    localFileSystem.writeAsStream(folder, writeFileName, aStream)
    .then((data) => {
      setTimeout(() => {
        var fileContent = fs.readFileSync(`${folder}/${writeFileName}`, 'utf8')

        deepEqual(data.Location, `${folder}/${writeFileName}`)
        deepEqual(data.FileName, writeFileName)
        deepEqual(data.Folder, folder)
        equal(fileContent, 'Lorem ipsum dolor sot amet.\n')

        fs.unlinkSync(`${folder}/${writeFileName}`)
        done()
      }, 1000)
    })
    .catch(done)
  }, 30000)

  test.timeout('reads file from Local Folder', function (done) {
    var localFileSystem = new LocalFileSystem()

    return localFileSystem.read(folder, readFileName)
    .then(data => {
      let fileContent = (data.Body) ? data.Body.toString() : ''

      equal(fileContent, 'Lorem ipsum dolor sit amet.\n')
      done()
    })
    .catch(done)
  }, 30000)
})
