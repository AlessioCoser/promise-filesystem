const aws = require('aws-sdk')

module.exports = {
  deleteS3Object,
  putS3Object,
  readS3Object,
  waitUntilS3ObjectExists,
  jsonItem,
  invalidItem,
  jsonPayload
}

function deleteS3Object (bucket, key) {
  const s3 = new aws.S3({signatureVersion: 'v4'})

  return new Promise((resolve, reject) => {
    s3.deleteObject({
      Bucket: bucket,
      Key: key
    }, (err, data) => err ? reject(err) : resolve(data))
  })
}

function putS3Object (bucket, key, body) {
  const s3 = new aws.S3({signatureVersion: 'v4'})
  return new Promise((resolve, reject) => {
    s3.putObject({
      Bucket: bucket,
      Key: key,
      Body: body
    }, (err, data) => err ? reject(err) : resolve(data))
  })
}

function readS3Object (bucket, key) {
  const s3 = new aws.S3({signatureVersion: 'v4'})

  return new Promise((resolve, reject) => {
    s3.getObject({
      Bucket: bucket,
      Key: key
    }, (err, data) => err ? reject(err) : resolve(data))
  })
}

function waitUntilS3ObjectExists (bucket, key) {
  return new Promise((resolve, reject) => {
    let retries = 0
    let intervalId = setInterval(() => {
      readS3Object(bucket, key)
      .then((body) => {
        clearInterval(intervalId)
        resolve(body)
      })
      .catch(() => {
        if (retries > 10) {
          clearInterval(intervalId)
          reject(new Error(`file (${key}) not found in bucket (${bucket})`))
        }
      })
      retries++
    }, 1000)
  })
}

function jsonItem (name) {
  return {
    'itunes:keywords': [`Channel`],
    'itunes:subtitle': [`${name} Title`],
    'itunes:summary': [`<p>Html Description</p>`],
    link: [`http://${name}.link`],
    url: [`http://${name}.url`],
    pubDate: 'Fri, 09 Dec 2016 14:10:15 +0000',
    enclosure: [{'$': {url: `http://${name}.enc`, type: 'audio/mpeg', length: 5000}}]
  }
}

function invalidItem () {
  return {
    'itunes:keywords': [`Channel`]
  }
}

function jsonPayload (items) {
  if (items === null) {
    return null
  }

  if (!Array.isArray(items)) {
    return {}
  }

  return {
    rss: {
      channel: [{item: items}]
    }
  }
}
