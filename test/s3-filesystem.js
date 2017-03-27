const {equal} = require('assert')
const stringToStream = require('string-to-stream')
const testUtils = require('./test_utils')
const S3FileSystem = require('..').s3
const folder = 'promise-filesystem'
const inputFileName = 'file.txt'
const inputContent = 'Lorem ipsum dolor sit amet.'

test('S3FileSystem', function () {
  test.timeout('reads from S3 Bucket as stream', function (done) {
    testUtils.deleteS3Object(folder, inputFileName)
    .then(() => testUtils.putS3Object(folder, inputFileName, inputContent))
    .then(() => {
      var s3FileSystem = new S3FileSystem()
      var data = []

      s3FileSystem.readAsStream(folder, inputFileName)
      .on('data', chunk => data.push(chunk))
      .on('end', () => {
        equal(String.prototype.concat(data), inputContent)
        done()
      })
    })
    .catch(done)
  }, 30000)

  test.timeout('writes to S3 Bucket as stream', function (done) {
    var s3FileSystem = new S3FileSystem()
    var aStream = stringToStream(inputContent)

    return testUtils.deleteS3Object(folder, inputFileName)
    .then(() => s3FileSystem.writeAsStream(folder, inputFileName, aStream))
    .then(() => testUtils.waitUntilS3ObjectExists(folder, inputFileName))
    .then(data => {
      let fileContent = (data.Body) ? data.Body.toString() : ''

      equal(fileContent, inputContent)
      done()
    })
    .catch(done)
  }, 30000)

  test.timeout('reads file from S3 Bucket', function (done) {
    var s3FileSystem = new S3FileSystem()

    return s3FileSystem.read(folder, inputFileName)
    .then(data => {
      let fileContent = (data.Body) ? data.Body.toString() : ''

      equal(fileContent, inputContent)
      done()
    })
    .catch(done)
  }, 30000)

  test.timeout('get file head from S3 Bucket', function (done) {
    var s3FileSystem = new S3FileSystem()

    return s3FileSystem.head(folder, inputFileName)
    .then(data => {
      equal(data.ContentLength, '27')
      done()
    })
    .catch(done)
  }, 30000)

  test.timeout('writes file to S3 Bucket', function (done) {
    var s3FileSystem = new S3FileSystem()

    return testUtils.deleteS3Object(folder, inputFileName)
    .then(() => s3FileSystem.write(folder, inputFileName, inputContent))
    .then(() => testUtils.waitUntilS3ObjectExists(folder, inputFileName))
    .then(data => {
      let fileContent = (data.Body) ? data.Body.toString() : ''

      equal(fileContent, inputContent)
      done()
    })
    .catch(done)
  }, 30000)
})
