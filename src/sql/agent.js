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
  }
}
