[![Build Status](https://travis-ci.org/AlessioCoser/promise-filesystem.svg?branch=master)](https://travis-ci.org/AlessioCoser/promise-filesystem)

# promise-filesystem

Provides promise based filesystem API for node.js. This is also an adapter for remote filesystems like Amazon Simple Storage Service (AWS S3).

## Filesystems supported

- Local filesystem
- AWS S3

## AWS S3

In order to work with AWS S3 you have to set 2 environment variables:
```
export AWS_ACCESS_KEY_ID = [your_aws_access_key]
export AWS_SECRET_ACCESS_KEY = [your_aws_secret_key]
```

## Features
- head
- read
- write
- delete
- readAsStream
- writeAsStream

### readAsStream
```js
const FileSystem = require('promise-filesystem')

var localFileSystem = new FileSystem.local()
var stream = localFileSystem.readAsStream(folder, fileName)

stream.on('data', function(chunk) {
  console.log(chunk)
})
```

### writeAsStream
```js
const FileSystem = require('promise-filesystem')

var localFileSystem = new FileSystem.local()
var myStream = getMySuperStream()

localFileSystem.writeAsStream(folder, fileName, myStream)
.then(function (data) {
  console.log('write successfully with this informations', data)
  // => { Location: 'folder/file.ext', Folder: 'folder', FileName: 'file.ext' }
})
.catch(function (err) {
  console.log('There was a readStream error: ', err)
})
```
