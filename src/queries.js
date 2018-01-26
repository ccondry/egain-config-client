const mssql = require('mssql')
const agent = require('./sql/agent')

module.exports = {
  listAgents: async function (config) {
    try {
      const pool = await new mssql.ConnectionPool(config).connect()
      const results = await pool.request().query('SELECT * FROM dbo.EGPL_USER')
      console.log(results)
      mssql.close()
      return results
    } catch (e) {
      mssql.close()
      throw e
    }
  },
  changeAttribute: async function (config, {skillTargetId, attribute, value}) {
    const query = agent.updateAttribute(attribute)
    try {
      const pool = await new mssql.ConnectionPool(config).connect()
      const results = await pool.request()
      .input(attribute, mssql.VarChar, value)
      .input('SKILL_TARGET_ID', mssql.Int, skillTargetId)
      .query(query)
      console.log(results)
      mssql.close()
      return results
    } catch (e) {
      mssql.close()
      throw e
    }
  },
  updateScreenName: async function (config, {skillTargetId}) {
    const query = agent.updateScreenName()
    try {
      const pool = await new mssql.ConnectionPool(config).connect()
      const results = await pool.request()
      .input('SKILL_TARGET_ID', mssql.Int, skillTargetId)
      .query(query)
      console.log(results)
      mssql.close()
      return results
    } catch (e) {
      mssql.close()
      throw e
    }
  }
}
