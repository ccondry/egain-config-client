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

  async addRole (skillTargetId, roleId) {
    const result = await queries.addRole(this.config, {skillTargetId, roleId})
    return result
  }

  async addLicense (skillTargetId, licenseKey) {
    const result = await queries.addLicense(this.config, {skillTargetId, licenseKey})
    return result
  }
}

class EgainConfig {
  constructor ({host, username, password, db = 'eGActiveDB'}) {
    this.host = host
    this.db = db
    this.username = username
    this.password = password
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
