const fileSystems = [
  require('./lib/s3-filesystem'),
  require('./lib/local-filesystem')
]

module.exports = function (sdkFileSystem) {
  var fsObject = fileSystems.filter((fs) => fs.canHandle(sdkFileSystem))[0]

  return fsObject.FileSystem(sdkFileSystem)
}
