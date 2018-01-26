-- exec sp_prepexec @p1 output,N'@P0 decimal(38,4) OUTPUT,@P1 nvarchar(4000),@P2 bigint,@P3 nvarchar(4000),@P4 nvarchar(4000),@P5 varchar(8000),@P6 varchar(8000),@P7 decimal(38,4) OUTPUT,@P8 decimal(38,4) OUTPUT,@P9 decimal(38,4) OUTPUT,@P10 nvarchar(4000) OUTPUT',N'EXEC @P0 =

EXEC @P0 = egpl_user_f_create_user
N'1',
999,
N'password,screen_name,case_insensitive_password,user_name,who_created,when_created,first_name,last_name',
N'N''3946333242393341314236343038424234434133463143344638394334303946383139313633304431364531333730443836314338334236414530393937343943424638353242344336454533393642384241414539394434424344454544363746334339343934364535303843373739323546434643423046343533354543233538363333383334343137333246363937353331333033323435373733443344'',N''Zane Bear'',N''3944344532354546363730393135453436354236443333314634423334394339333241334542464244414535463831443241423431443841324334434242414338364642373435363030374337444130444139313243303942423242383342463833343632343241334331344345323041303443323145354231423246413737233334333837363437373233333738373136433532373736353443343133443344'',N''43377'',1,''2018-01-26 02:04:24'',N''Zane'',N''Bear''',
NULL,
NULL,
@p11 output,@p12 output,@p13 output,@p14 output
-- example output:  NULL	1237	0


SELECT  egpl_pref_group.group_id
FROM  egpl_pref_group
WHERE  egpl_pref_group.group_name  =  'L10N_DEFAULTUSERGROUP'
AND  egpl_pref_group.department_id  =  '999'
-- output.group_id = 3003

SELECT egpl_resource_type.view_flag view_flag,
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
WHERE  egpl_resource_type.resource_type_name  =  'user'
-- output.resource_type_id = 1001

-- get resource_type_id and group_id from above queries
-- resource_id is the id of the new user
INSERT INTO  egpl_pref_resource  (
  egpl_pref_resource.resource_type_id ,
  egpl_pref_resource.group_id ,
   egpl_pref_resource.department_id ,
   egpl_pref_resource.resource_id
 )
 VALUES ( 1001 , 3003 , 999 , 1237  )


 UPDATE  egpl_user
 SET  default_content_lang_id  =  setting_val  ,
    content_language  =  setting_val
 FROM  egpl_pref_group_preferences
 WHERE  user_id  =  1237
 AND  setting_id IN (
   SELECT  setting_id
   FROM  egpl_pref_globalsettings
   WHERE  setting_name  = 'common.kb.primary_language'
 )
 AND  group_id  IN (
   SELECT  group_id
   FROM  egpl_pref_group
   WHERE  group_name  = 'L10N_DEPARTMENT'
   AND  department_id  =  999
 )

-- 995 is the Agent rold in department 999
 INSERT INTO  egpl_user_party_role  (
   party_id,
   role_id
 )
 VALUES (1237, 995)

-- assign licenses to user. reference license_id
 EXEC @P0 = egpl_lic_assign_user  1235  ,  '6,7,4,3'  ,  @P3 OUT  ,  @P4 OUT


 Select DISTINCT  egicm_queue.queue_id
 from  egicm_queue  ,  egpl_routing_queue
 WHERE  egicm_queue.mrd_id  IN (
   SELECT  egicm_user_group.mrd_id
   FROM  egicm_user_group ,  egpl_user_group_item
   WHERE  egpl_user_group_item.item_id  =  1237
   AND  egpl_user_group_item.group_id  =  egicm_user_group.user_group_id
 )
 AND  egpl_routing_queue.department_id  =  999
 AND  egpl_routing_queue.queue_id  =  egicm_queue.queue_id
-- returns empty results?

-- get skill_target_id from ICM/CCEAdmin
 INSERT INTO  egicm_user(user_id, skill_target_id)
 VALUES (1237, 5319)


-- list users
 SELECT  egpl_user.user_name,
 egpl_user.department_id,
 ISNULL( egicm_user.skill_target_id , 0) as integrated_agent
 FROM  egpl_user
 LEFT JOIN  egicm_user ON  egpl_user.user_id  =  egicm_user.user_id
