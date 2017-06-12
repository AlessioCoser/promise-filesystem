[![Build Status](https://travis-ci.org/AlessioCoser/promise-filesystem.svg?branch=master)](https://travis-ci.org/AlessioCoser/promise-filesystem)

# promise-filesystem

Provides promise based filesystem API for node.js. This is also an adapter for remote filesystems like Amazon Simple Storage Service (AWS S3).

## Filesystems supported

- Local filesystem
- AWS S3

## Use AWS S3

In order to work with AWS S3 you have to install PEER DEPENDENCY `aws-sdk`
```
npm install --save aws-sdk
```

and set 2 environment variables:
```
export AWS_ACCESS_KEY_ID = [your_aws_access_key]
export AWS_SECRET_ACCESS_KEY = [your_aws_secret_key]
```

## Initialize Filesystem:
```js
// initialize local file system
const localFileSystem = require('promise-filesystem')()

// initialize s3 file system
const aws = require('aws-sdk')
const s3FileSystem = require('promise-filesystem')(aws.S3)
```

## Features
- head
- read
- read (with range)
- write
- delete
- readAsStream
- writeAsStream

### head
```js
const localFileSystem = require('promise-filesystem')()

return localFileSystem.head(folder, fileName)
.then(function (data) {
  console.log(data)
  /* { AcceptRanges: 'bytes',
       LastModified: 2017-05-08T12:32:16.000Z,
       ContentLength: 28,
       ETag: null,
       ContentType: null,
       Metadata: {} } */
})
```

### read
```js
const localFileSystem = require('promise-filesystem')()

return localFileSystem.read(folder, fileName)
.then(function (data) {
  console.log(data)
  // { Body: 'Lorem ipsum dolor sit amet.\n' }
})
```

### read (with range)
```js
const localFileSystem = require('promise-filesystem')()

return localFileSystem.read(folder, fileName, 'bytes=0-3')
.then(function (data) {
  console.log(data)
  // { Body: 'Lore' }
})
```

### write
```js
const localFileSystem = require('promise-filesystem')()
let content = 'Lorem ipsum dolor sit amet.\n'

return localFileSystem.write(folder, fileName, content)
.then(function () {
  // do whatever you want
})
.catch(function (err) {
  console.log(err)
  /* { Error: EACCES: permission denied, open 'folder/file.ext'
       errno: -13,
       code: 'EACCES',
       syscall: 'open',
       path: 'folder/file.ext' } */
})
```

### delete
```js
const localFileSystem = require('promise-filesystem')()

return localFileSystem.delete(folder, fileName)
.then(function () {
  // do whatever you want
})
.catch(function (err) {
  console.log(err)
  /* { Error: EACCES: permission denied, open 'folder/file.ext'
       errno: -13,
       code: 'EACCES',
       syscall: 'open',
       path: 'folder/file.ext' } */
})
```

### readAsStream
```js
const localFileSystem = require('promise-filesystem')()
let stream = localFileSystem.readAsStream(folder, fileName)

stream.on('data', function(chunk) {
  console.log(chunk)
})
```

### writeAsStream
```js
const localFileSystem = require('promise-filesystem')()
let myStream = getMySuperStream()

localFileSystem.writeAsStream(folder, fileName, myStream)
.then(function (data) {
  console.log('write successfully with this informations', data)
  // => { Location: 'folder/file.ext', Folder: 'folder', FileName: 'file.ext' }
})
.catch(function (err) {
  console.log('There was a readStream error: ', err)
})
```
