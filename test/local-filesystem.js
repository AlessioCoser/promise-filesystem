const {equal, deepEqual} = require('assert')
const fs = require('fs')
const stringToStream = require('string-to-stream')
const LocalFileSystem = require('..').local

const folder = 'test/promise-filesystem'
const file = 'file.txt'
const writeFile = 'write-as-stream.txt'

test('LocalFileSystem', function () {
  test.timeout('reads from Local Folder as stream', function (done) {
    var localFileSystem = new LocalFileSystem()
    var data = []

    localFileSystem.readAsStream(folder, file)
    .on('data', chunk => data.push(chunk))
    .on('end', () => {
      equal(String.prototype.concat(data), 'lorem ipsum dolor sit amet.\n')
      done()
    })
  }, 30000)

  test.timeout('write to Local Folder as stream', function (done) {
    var localFileSystem = new LocalFileSystem()
    var aStream = stringToStream('Lorem ipsum dolor sot amet.\n')

    localFileSystem.writeAsStream(folder, writeFile, aStream)
    .then((data) => {
      setTimeout(() => {
        var writeFileContent = fs.readFileSync(`${folder}/${writeFile}`, 'utf8')

        deepEqual(data.Location, `${folder}/${writeFile}`)
        deepEqual(data.FileName, writeFile)
        deepEqual(data.Folder, folder)
        equal(writeFileContent, 'Lorem ipsum dolor sot amet.\n')

        fs.unlinkSync(`${folder}/${writeFile}`)
        done()
      }, 1000)
    })
    .catch(done)
  }, 30000)
})
