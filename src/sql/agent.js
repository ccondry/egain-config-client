module.exports = {
  updateAttribute: function (attribute) {
    return `UPDATE e
    SET e.${attribute} = @${attribute}
    FROM [dbo].[EGPL_USER] e
    JOIN [dbo].[EGICM_USER] icm
    ON e.USER_ID = icm.USER_ID
    WHERE icm.SKILL_TARGET_ID = @SKILL_TARGET_ID`
  },
  updateScreenName: function () {
    return `UPDATE e
    SET e.SCREEN_NAME = (
      SELECT FIRST_NAME + ' ' + LAST_NAME
      FROM [dbo].[EGPL_USER] e
      JOIN [dbo].[EGICM_USER] icm
      ON e.USER_ID = icm.USER_ID
      WHERE icm.SKILL_TARGET_ID = @SKILL_TARGET_ID
    )
    FROM [dbo].[EGPL_USER] e
    JOIN [dbo].[EGICM_USER] icm
    ON e.USER_ID = icm.USER_ID
    WHERE icm.SKILL_TARGET_ID = @SKILL_TARGET_ID`
  },
  addLicense: function () {
    // LICENSE_KEY = 1002
    // SKILL_TARGET_ID = 5316
    return `INSERT INTO [EGPL_LICENSE_USER_ASSIGNMENT] (e.USER_ID,LICENSE_KEY)
    SELECT e.USER_ID, @LICENSE_KEY AS LICENSE_KEY
    FROM EGPL_USER e
    JOIN EGICM_USER icm
    ON e.USER_ID = icm.USER_ID
    WHERE icm.SKILL_TARGET_ID = @SKILL_TARGET_ID`
  },
  addRole: function () {
    // ROLE_ID = 1004
    // SKILL_TARGET_ID = 5316
    return `INSERT INTO [EGPL_USER_PARTY_ROLE] ([PARTY_ID], [ROLE_ID])
    SELECT e.USER_ID, @ROLE_ID AS ROLE_ID
    FROM EGPL_USER e
    JOIN EGICM_USER icm
    ON e.USER_ID = icm.USER_ID
    WHERE icm.SKILL_TARGET_ID = @SKILL_TARGET_ID`
  },
  findWithLicense: function () {
    // LICENSE_KEY = 1026
    return `SELECT USER_NAME FROM EGPL_USER WHERE USER_ID IN (
      SELECT USER_ID FROM EGPL_LICENSE_USER_ASSIGNMENT WHERE LICENSE_KEY=@LICENSE_KEY
    )`
  },
  addPrefResource () {
    // resource_type_id = 1001
    // group_id = 3003
    // department_id = 999
    // resource_id = 1237
    return `INSERT INTO  egpl_pref_resource  (
      egpl_pref_resource.resource_type_id ,
      egpl_pref_resource.group_id ,
       egpl_pref_resource.department_id ,
       egpl_pref_resource.resource_id
     )
     VALUES ( @resource_type_id , @group_id , @department_id , @resource_id  )`
  },
  findDefaultUserGroup () {
    // department_id = 999
    return `SELECT  egpl_pref_group.group_id
    FROM  egpl_pref_group
    WHERE  egpl_pref_group.group_name = 'L10N_DEFAULTUSERGROUP'
    AND  egpl_pref_group.department_id = @department_id`
  },
  findUserResourceTypeId () {
    return `SELECT egpl_resource_type.view_flag view_flag,
    egpl_resource_type.resource_type_id resource_type_id,
    egpl_resource_type.base_resource_type base_resource_type,
    egpl_resource_type.resource_type_name resource_type_name,
    egpl_resource_type.search_flag search_flag,
    egpl_resource_type.description description,
    egpl_resource_type.display_name display_name,
    egpl_resource_type.application_id application_id,
    egpl_resource_type.modify_flag modify_flag,
    egpl_resource_type.is_group is_group
    FROM  egpl_resource_type
    WHERE  egpl_resource_type.resource_type_name  =  'user'`
  },
  setUserContentLanguage () {
    // user_id = 1237
    // department_id = 999
    return ` UPDATE egpl_user
    SET default_content_lang_id = setting_val, content_language = setting_val
    FROM egpl_pref_group_preferences
    WHERE user_id = @user_id
    AND setting_id IN (
      SELECT setting_id
      FROM egpl_pref_globalsettings
      WHERE setting_name = 'common.kb.primary_language'
    )
    AND group_id IN (
      SELECT group_id
      FROM egpl_pref_group
      WHERE group_name = 'L10N_DEPARTMENT'
      AND department_id = @department_id
    )`
  },
  findAgentRole () {
    return `SELECT role_id
    FROM EGPL_USER_ROLE
    WHERE DEPARTMENT_ID = @department_id
    AND ROLE_NAME = 'Agent'`
  },
  findRoleId () {
    return `SELECT role_id
    FROM EGPL_USER_ROLE
    WHERE DEPARTMENT_ID = @department_id
    AND ROLE_NAME = @role_name`
  },
  insertRoleId () {
    return `INSERT INTO egpl_user_party_role (
      party_id,
      role_id
    )
    VALUES (@party_id, @role_id)`
  },
  insertIcmUser () {
    return `INSERT INTO egicm_user(user_id, skill_target_id)
    VALUES (@user_id, @skill_target_id)`
  },
  getQueues () {
    return `SELECT *
    FROM EGPL_ROUTING_QUEUE
    WHERE DEPARTMENT_ID = @department_id`
  },
  getUserQueues () {
    // Retrieve the queues in the same department as the user that are enabled and
    // have an MRD (so that we only get queues relevant to our interest)
    // user_name = 41377
    // user_name = ccondry@dcloud.cisco.com
    return `SELECT q.QUEUE_ID, q.QUEUE_NAME, q.QUEUE_DESCRIPTION, q.WHEN_CREATED,
    q.WHEN_MODIFIED, q.QUEUE_STATE, q.CHAT_DEFAULT_TRANSFER_QUEUE, q.DEFAULT_SOCIAL_QUEUE,
    q.SOCIAL_ROUTING_TYPE, i.MRD_ID, i.SCRIPT_SELECTOR_ID, u.USER_NAME, u.USER_ID,
    CASE WHEN c.CONCURRENT_TASK_LIMIT IS NULL
      THEN 1
      ELSE c.CONCURRENT_TASK_LIMIT
    END AS CONCURRENT_TASK_LIMIT
    FROM [EGPL_USER] u
    JOIN [EGPL_ROUTING_QUEUE] q ON q.DEPARTMENT_ID = u.DEPARTMENT_ID
    JOIN [EGPL_USER] u2 ON q.WHO_CREATED = u2.USER_ID
    JOIN [EGICM_QUEUE] i ON q.queue_id = i.QUEUE_ID
    FULL JOIN [EGICM_CONCURRENT_TASK] c ON c.queue_id = i.QUEUE_ID AND c.USER_ID = u.USER_ID
    WHERE u.user_name = @user_name
    AND q.QUEUE_STATE = 1`
  },
  setConcurrentTaskLimit () {
    // set the concurrent task limit for a specified queue and user
    // user_id = 1237
    // queue_id = 12
    // concurrent_task_limit = 4
    return `INSERT INTO EGICM_CONCURRENT_TASK
    (USER_ID, QUEUE_ID, CONCURRENT_TASK_LIMIT)
    VALUES (@user_id, @queue_id, @concurrent_task_limit)`
  }
}
