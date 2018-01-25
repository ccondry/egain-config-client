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
}
