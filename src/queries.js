const mssql = require('mssql')
const agent = require('./sql/agent')

module.exports = {
  listAgents: async function (db) {
    // const query =
    const results = await db.request().query('SELECT * FROM dbo.EGPL_USER')
    console.log(results)
    return results
  },
  changeAttribute: async function (db, {skillTargetId, attribute, value}) {
    const query = agent.updateAttribute(attribute)
    // const query = `UPDATE e
    // SET e.LAST_NAME = @LAST_NAME
    // FROM [dbo].[EGPL_USER] e
    // JOIN [dbo].[EGICM_USER] icm
    // ON e.USER_ID = icm.USER_ID
    // WHERE icm.SKILL_TARGET_ID = @SKILL_TARGET_ID`
    console.log(query)
    try {
      // run query
      const results = await db.request()
      .input(attribute, mssql.VarChar, value)
      .input('SKILL_TARGET_ID', mssql.Int, skillTargetId)
      .query(query)
      return results
    } catch (e) {
      throw e
    }
  },
  updateScreenName: async function (db, {skillTargetId}) {
    const query = agent.updateScreenName()
    console.log(query)
    try {
      // run query
      const results = await db.request()
      .input('SKILL_TARGET_ID', mssql.Int, skillTargetId)
      .query(query)
      return results
    } catch (e) {
      throw e
    }
  }
}
