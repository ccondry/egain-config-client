const mssql = require('mssql')
const agent = require('./sql/agent')
const moment = require('moment')

module.exports = {
  listAgents: async function (config) {
    try {
      const pool = await new mssql.ConnectionPool(config).connect()
      const results = await pool.request().query('SELECT * FROM dbo.EGPL_USER')
      // console.log(results)
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
      // console.log(results)
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
      // console.log(results)
      mssql.close()
      return results
    } catch (e) {
      mssql.close()
      throw e
    }
  },
  addRole: async function (config, {skillTargetId, roleId}) {
    const query = agent.addRole()
    try {
      const pool = await new mssql.ConnectionPool(config).connect()
      const results = await pool.request()
      .input('SKILL_TARGET_ID', mssql.Int, skillTargetId)
      .input('ROLE_ID', mssql.Int, roleId)
      .query(query)
      // console.log(results)
      mssql.close()
      return results
    } catch (e) {
      mssql.close()
      throw e
    }
  },
  findRoleId: async function (config, {roleName, departmentId}) {
    const query = agent.findRoleId()
    try {
      const pool = await new mssql.ConnectionPool(config).connect()
      const results = await pool.request()
      .input('role_name', mssql.VarChar, roleName)
      .input('department_id', mssql.Int, departmentId)
      .query(query)
      const roleId = results.recordset[0].role_id
      mssql.close()
      return roleId
    } catch (e) {
      mssql.close()
      throw e
    }
  },
  addLicense: async function (config, {skillTargetId, licenseKey}) {
    const query = agent.addLicense()
    try {
      const pool = await new mssql.ConnectionPool(config).connect()
      const results = await pool.request()
      .input('SKILL_TARGET_ID', mssql.Int, skillTargetId)
      .input('LICENSE_KEY', mssql.Int, licenseKey)
      .query(query)
      console.log(results)
      mssql.close()
      return results
    } catch (e) {
      mssql.close()
      throw e
    }
  },
  findWithLicense: async function (config, {licenseKey}) {
    const query = agent.findWithLicense()
    try {
      const pool = await new mssql.ConnectionPool(config).connect()
      const results = await pool.request()
      .input('LICENSE_KEY', mssql.Int, licenseKey)
      .query(query)
      console.log(results)
      mssql.close()
      return results
    } catch (e) {
      mssql.close()
      throw e
    }
  },
  findDefaultUserGroup: async function (config, {departmentId}) {
    const query = agent.findDefaultUserGroup()
    try {
      const pool = await new mssql.ConnectionPool(config).connect()
      const results = await pool.request()
      .input('department_id', departmentId)
      .query(query)
      // console.log(results)
      mssql.close()
      return results
    } catch (e) {
      mssql.close()
      throw e
    }
  },
  getUserQueues: async function (config, {username}) {
    const query = agent.getUserQueues()
    try {
      const pool = await new mssql.ConnectionPool(config).connect()
      const results = await pool.request()
      .input('user_name', mssql.VarChar, username)
      .query(query)
      mssql.close()
      return results.recordset
    } catch (e) {
      mssql.close()
      throw e
    }
  },
  setConcurrentTaskLimit: async function (config, {userId, queueId, concurrentTaskLimit}) {
    const query = agent.setConcurrentTaskLimit()
    try {
      const pool = await new mssql.ConnectionPool(config).connect()
      const results = await pool.request()
      .input('user_id', mssql.Int, userId)
      .input('queue_id', mssql.Int, queueId)
      .input('concurrent_task_limit', mssql.Int, concurrentTaskLimit)
      .query(query)
      mssql.close()
      return results.rowsAffected
    } catch (e) {
      mssql.close()
      throw e
    }
  },
  addIcmUser: async function (config, {username, firstName, lastName, skillTargetId, departmentId, licenseIds}) {
    try {
      // create modified values string
      // the admin user who creates this new agent
      let whoCreated = 1
      // now
      // let whenCreated = '2018-01-26 02:04:24'
      let whenCreated = moment().subtract(6, 'hours').format('YYYY-MM-DD hh:mm:ss')
      let password = '3946333242393341314236343038424234434133463143344638394334303946383139313633304431364531333730443836314338334236414530393937343943424638353242344336454533393642384241414539394434424344454544363746334339343934364535303843373739323546434643423046343533354543233538363333383334343137333246363937353331333033323435373733443344'
      let modifiedValues = `'${password}','${firstName} ${lastName}','${password}','${username}',${whoCreated},'${whenCreated}','${firstName}','${lastName}'`
      let modifiedColumns = 'password,screen_name,case_insensitive_password,user_name,who_created,when_created,first_name,last_name'

      // get connection pool
      const pool = await new mssql.ConnectionPool(config).connect()
      // make request object and attach inputs

      const request1 = new mssql.Request(pool)
      .input('v_calleruser_id', whoCreated)
      .input('v_resourcedepartment_id', departmentId)
      .input('v_modified_user_column_names', modifiedColumns)
      .input('v_modified_user_column_values', modifiedValues)
      .input('v_modified_user2_column_names', null)
      .input('v_modified_user2_column_values', null)
      .output('v_parentfolder_id', mssql.Int)
      .output('v_new_party_id', mssql.Int)
      .output('v_sql_code', mssql.Int)
      .output('v_sql_message', mssql.VarChar)
      // run sp
      const results1 = await request1.execute('egpl_user_f_create_user')
      const newPartyId = results1.output.v_new_party_id
      console.log('newPartyId', newPartyId)
      console.log('successfully created eGain user')

      // get default user group Id
      const request2 = new mssql.Request(pool)
      .input('department_id', departmentId)
      const results2 = await request2.query(agent.findDefaultUserGroup())
      // console.log('results2', results2)
      const groupId = results2.recordset[0].group_id
      console.log('successfully retrieved default group ID', groupId)

      // get default user group Id
      const request3 = new mssql.Request(pool)
      const results3 = await request3.query(agent.findUserResourceTypeId())
      // console.log('results3', results3)
      const resourceTypeId = results3.recordset[0].resource_type_id
      console.log('successfully retrieved user resource type ID', resourceTypeId)

      // insert egain user pref resource for new agent
      const request4 = new mssql.Request(pool)
      .input('resource_type_id', mssql.Int, resourceTypeId)
      .input('group_id', mssql.Int, groupId)
      .input('department_id', mssql.Int, departmentId)
      .input('resource_id', mssql.Int, newPartyId)
      const results4 = await request4.query(agent.addPrefResource())
      // console.log('results4', results4)
      console.log('successfully added eGain user pref resource')

      // set new agent's default language preference
      const request5 = new mssql.Request(pool)
      .input('user_id', mssql.Int, newPartyId)
      .input('department_id', mssql.Int, departmentId)
      const results5 = await request5.query(agent.setUserContentLanguage())
      // console.log('results5', results5)
      console.log('successfully set eGain user default language')

      // find role ID for 'Agent' role in our department
      const request6 = new mssql.Request(pool)
      .input('department_id', mssql.Int, departmentId)
      const results6 = await request6.query(agent.findAgentRole())
      // console.log('results6', results6)
      const roleId = results6.recordset[0].role_id
      console.log('successfully found Agent role in our department', roleId)

      // insertRoleId
      const request7 = new mssql.Request(pool)
      .input('party_id', mssql.Int, newPartyId)
      .input('role_id', mssql.Int, roleId)
      const results7 = await request7.query(agent.insertRoleId())
      // console.log('results7', results7)
      console.log('successfully added Agent role to new agent')

      // assign licenses to new agent
      const request8 = new mssql.Request(pool)
      .input('ip_intUserId', mssql.Int, newPartyId)
      .input('ip_licenseIds', mssql.VarChar, licenseIds)
      .output('op_sql_code', mssql.Int)
      .output('op_sql_msg', mssql.VarChar)
      const results8 = await request8.execute('egpl_lic_assign_user')
      // console.log('results8', results8)
      console.log('successfully assigned licenses to new agent')

      // add icmuser entry
      const request9 = new mssql.Request(pool)
      .input('user_id', mssql.Int, newPartyId)
      .input('skill_target_id', mssql.Int, skillTargetId)
      const results9 = await request9.query(agent.insertIcmUser())
      // console.log('results9', results9)
      console.log('successfully added user to icmusers')

      // done!

      mssql.close()
      return {newPartyId}
    } catch (e) {
      mssql.close()
      throw e
    }
  }
}
