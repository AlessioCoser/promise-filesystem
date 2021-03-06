const {equal, deepEqual} = require('assert')
const fs = require('fs')
const stringToStream = require('string-to-stream')
const localFileSystem = require('..')()

const folder = 'test/promise-filesystem'
const readFileName = 'file.txt'
const writeFileName = 'write-as-stream.txt'
const inputContent = 'Lorem ipsum dolor sit amet.\n'

test('LocalFileSystem', function () {
  test.timeout('reads from Local Folder as stream', function (done) {
    let data = []

    localFileSystem.readAsStream(folder, readFileName)
    .on('data', chunk => data.push(chunk))
    .on('end', () => {
      equal(String.prototype.concat(data), inputContent)
      done()
    })
  }, 30000)

  test.timeout('writes to Local Folder as stream', function (done) {
    let aStream = stringToStream(inputContent)

    localFileSystem.writeAsStream(folder, writeFileName, aStream)
    .then((data) => {
      setTimeout(() => {
        let fileContent = fs.readFileSync(`${folder}/${writeFileName}`, 'utf8')

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
    return localFileSystem.read(folder, readFileName)
    .then(data => {
      let fileContent = (data.Body) ? data.Body.toString() : ''

      equal(fileContent, inputContent)
      done()
    })
    .catch(done)
  }, 30000)

  test.timeout('reads a range of file from local folder', function (done) {
    let HTTPRangeHeader = 'bytes=0-3'

    return localFileSystem.read(folder, readFileName, HTTPRangeHeader)
    .then(data => {
      let fileContent = (data.Body) ? data.Body.toString() : ''

      equal(fileContent, 'Lore')
      done()
    })
    .catch(done)
  }, 30000)

  test.timeout('get file head from local folder', function (done) {
    return localFileSystem.head(folder, readFileName)
    .then(data => {
      equal(data.ContentLength, '28')
      done()
    })
    .catch(done)
  }, 30000)

  test.timeout('writes to Local Folder', function (done) {
    localFileSystem.write(folder, writeFileName, inputContent)
    .then(() => {
      setTimeout(() => {
        let fileContent = fs.readFileSync(`${folder}/${writeFileName}`, 'utf8')

        equal(fileContent, inputContent)
        fs.unlinkSync(`${folder}/${writeFileName}`)
        done()
      }, 1000)
    })
    .catch(done)
  }, 30000)

  test.timeout('deletes file from Local Folder', function (done) {
    let fileToDelete = 'file-to-delete.txt'

    return localFileSystem.write(folder, fileToDelete, inputContent)
    .then(() => localFileSystem.delete(folder, fileToDelete))
    .then((data) => {
      equal(fs.existsSync(`${folder}/${fileToDelete}`), false)
      done()
    })
    .catch(done)
  }, 30000)
})
