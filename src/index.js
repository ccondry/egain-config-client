const sql = require('mssql')
const queries = require('./queries')

class AgentConfig {
  constructor (config) {
    this.config = config
  }

  async list () {
    const result = await queries.listAgents(this.config)
    return result
  }

  async changeAttribute (skillTargetId, attribute, value) {
    const result = await queries.changeAttribute(this.config, {skillTargetId, attribute, value})
    return result
  }

  async updateScreenName (skillTargetId) {
    const result = await queries.updateScreenName(this.config, {skillTargetId})
    return result
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
    // this.pool = null
    // this.agent = null
    // config for your database
    this.config = {
      user: this.username,
      password: this.password,
      server: this.host,
      database: this.db
    }
    this.agent = new AgentConfig(this.config)
  }
}

module.exports = EgainConfig
