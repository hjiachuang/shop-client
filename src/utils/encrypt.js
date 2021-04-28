import crypto from 'crypto'
const md5Salt = 'md5_salt'
const aesKey = Buffer.from('aes_key')
const aesIv = Buffer.from('0102030405060708')
const PublicKey = `rsa加密公钥`

const md5Encrypt = (str) => {
  return crypto.createHash('md5').update(String(str + md5Salt)).digest('hex')
}

const aesEncrypt = (text) => {
  const buffer = Buffer.from(text)
  const cipher = crypto.createCipheriv('aes-128-cbc', aesKey, aesIv)
  return Buffer.concat([cipher.update(buffer), cipher.final()]).toString('hex').toUpperCase()
}

const rsaEncrypt = (str) => {
  return crypto.publicEncrypt(PublicKey, Buffer.from(str)).toString('base64')
}

const passwordEncrypt = (str) => {
  return rsaEncrypt(md5Encrypt(md5Encrypt(str)))
}

export default {
  md5Encrypt,
  aesEncrypt,
  rsaEncrypt,
  passwordEncrypt
}
