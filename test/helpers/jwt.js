module.exports.encodeBearer = function (a) {
  return JSON.parse(Buffer.from(a.split('.')[1], 'base64').toString('binary'))
}
