const {equal, deepEqual} = require('assert')
const fs = require('fs')
const stringToStream = require('string-to-stream')
const LocalFileSystem = require('..').local

const folder = 'test/promise-filesystem'
const readFileName = 'file.txt'
const writeFileName = 'write-as-stream.txt'
const inputContent = 'Lorem ipsum dolor sit amet.\n'

test('LocalFileSystem', function () {
  test.timeout('reads from Local Folder as stream', function (done) {
    const localFileSystem = new LocalFileSystem()
    const data = []

    localFileSystem.readAsStream(folder, readFileName)
    .on('data', chunk => data.push(chunk))
    .on('end', () => {
      equal(String.prototype.concat(data), inputContent)
      done()
    })
  }, 30000)

  test.timeout('writes to Local Folder as stream', function (done) {
    const localFileSystem = new LocalFileSystem()
    const aStream = stringToStream(inputContent)

    localFileSystem.writeAsStream(folder, writeFileName, aStream)
    .then((data) => {
      setTimeout(() => {
        const fileContent = fs.readFileSync(`${folder}/${writeFileName}`, 'utf8')

        deepEqual(data.Location, `${folder}/${writeFileName}`)
        deepEqual(data.FileName, writeFileName)
        deepEqual(data.Folder, folder)
        equal(fileContent, inputContent)

        fs.unlinkSync(`${folder}/${writeFileName}`)
        done()
      }, 1000)
    })
    .catch(done)
  }, 30000)

  test.timeout('reads file from Local Folder', function (done) {
    const localFileSystem = new LocalFileSystem()

    return localFileSystem.read(folder, readFileName)
    .then(data => {
      let fileContent = (data.Body) ? data.Body.toString() : ''

      equal(fileContent, inputContent)
      done()
    })
    .catch(done)
  }, 30000)

  test.timeout('get file head from local folder', function (done) {
    const localFileSystem = new LocalFileSystem()

    return localFileSystem.head(folder, readFileName)
    .then(data => {
      equal(data.ContentLength, '28')
      done()
    })
    .catch(done)
  }, 30000)

  test.timeout('writes to Local Folder', function (done) {
    const localFileSystem = new LocalFileSystem()

    localFileSystem.write(folder, writeFileName, inputContent)
    .then(() => {
      setTimeout(() => {
        const fileContent = fs.readFileSync(`${folder}/${writeFileName}`, 'utf8')

        equal(fileContent, inputContent)
        fs.unlinkSync(`${folder}/${writeFileName}`)
        done()
      }, 1000)
    })
    .catch(done)
  }, 30000)
})
