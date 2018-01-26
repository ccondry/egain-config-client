const sql = require('mssql')
const queries = require('./queries')

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
  constructor ({host, username, password, db = 'eGActiveDB'}) {
    this.host = host
    this.db = db
    this.username = username
    this.password = password
    // mssql connection URL
    // const url = `mssql://${username}:${password}@${host}/${db}`
    // this.url = url
    // mssql connection pool
    this.pool = null
    this.agent = null
  }

  // initial connection method for SQL pool
  async connect () {
    console.log('connecting egain-config mssql pool')
    console.log('host = ', this.host)
    // MSSQL connection pool promise
    function getSqlPool(client) {
      return new Promise((resolve, reject) => {
        const pool = sql.connect(client, function (err) {
          if (err) reject(err)
          else resolve(pool)
        })
      })
    }
    // make sure the pool has a connection for us
    this.pool = await getSqlPool(`mssql://${this.username}:${this.password}@${this.host}/${this.db}`)
    this.agent = new AgentConfig(this.pool)
    return this
  }
}

module.exports = EgainConfig
