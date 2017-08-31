const pkg = require('../package.json')
const sql = require('mssql')
const queries = require('./queries')

// MSSQL connection pool promise
function getSqlPool(client) {
  return new Promise((resolve, reject) => {
    const pool = sql.connect(client, function (err) {
      if (err) reject(err)
      else resolve(pool)
    })
  })
}
class AgentConfig {
  constructor (pool) {
    this.pool = pool
  }

  async list () {
    return await queries.listAgents(this.pool)
  }

  async changeAttribute (skillTargetId, attribute, value) {
    return await queries.changeAttribute(this.pool, {skillTargetId, attribute, value})
  }

  async updateScreenName (skillTargetId) {
    return await queries.updateScreenName(this.pool, {skillTargetId})
  }
}

class EgainConfig {
  constructor ({fqdn, username, password, db = 'eGActiveDB'}) {
    this.fqdn = fqdn
    this.db = db
    // mssql connection URL
    const url = `mssql://${username}:${password}@${fqdn}/${db}`
    this.url = url
    // mssql connection pool
    this.pool = null
    this.agent = null
  }

  // initial connection method for SQL pool
  async connect () {
    // make sure the pool has a connection for us
    this.pool = await getSqlPool('mssql://sa:C1sco12345@cceece.dcloud.cisco.com/eGActiveDB')
    this.agent = new AgentConfig(this.pool)
    return this
  }
}

module.exports = EgainConfig
