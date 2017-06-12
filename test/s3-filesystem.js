const {equal, deepEqual} = require('assert')
const stringToStream = require('string-to-stream')
const testUtils = require('./test_utils')
const aws = require('aws-sdk')
const s3FileSystem = require('..')(aws.S3)
const folder = 'promise-filesystem'
const inputFileName = 'file.txt'
const inputContent = 'Lorem ipsum dolor sit amet.'

test('S3FileSystem', function () {
  test.timeout('reads from S3 Bucket as stream', function (done) {
    testUtils.deleteS3Object(folder, inputFileName)
    .then(() => testUtils.putS3Object(folder, inputFileName, inputContent))
    .then(() => {
      let data = []

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
    let aStream = stringToStream(inputContent)

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
    return s3FileSystem.read(folder, inputFileName)
    .then(data => {
      let fileContent = (data.Body) ? data.Body.toString() : ''

      equal(fileContent, inputContent)
      done()
    })
    .catch(done)
  }, 30000)

  test.timeout('reads a range of file from S3 Bucket', function (done) {
    let HTTPRangeHeader = 'bytes=0-3'

    return s3FileSystem.read(folder, inputFileName, HTTPRangeHeader)
    .then(data => {
      let fileContent = (data.Body) ? data.Body.toString() : ''

      equal(fileContent, 'Lore')
      done()
    })
    .catch(done)
  }, 30000)

  test.timeout('get file head from S3 Bucket', function (done) {
    return s3FileSystem.head(folder, inputFileName)
    .then(data => {
      equal(data.ContentLength, '27')
      done()
    })
    .catch(done)
  }, 30000)

  test.timeout('writes file to S3 Bucket', function (done) {
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

  test.timeout('deletes a file from S3 Bucket', function (done) {
    return s3FileSystem.write(folder, 'delete-me.txt', inputContent)
    .then(() => testUtils.waitUntilS3ObjectExists(folder, 'delete-me.txt'))
    .then(() => s3FileSystem.delete(folder, 'delete-me.txt'))
    .then((data) => {
      deepEqual(data, {})
      done()
    })
    .catch(done)
  }, 30000)
})
