/*******************************************************************************
 *      Module:         CREATE_CM_ENF_EVENTS_VIEW.sql                          *
 *                                                                             *
 *      Description:    Script to create the CM_ENF_EVENTS_VIEW view used in   *
 *			reports.					       *
 *                                                                             *
 *      (c) copyright EDS 2005                                                 *
 *                                                                             *
 *      Amendment History:                                                     *
 *      Version         Date            Changed By      Description            *
 *      1.0             10 May 2005     David Holder    Original Version       *
 *******************************************************************************
*/

CREATE OR REPLACE VIEW CM_ENF_EVENTS_VIEW AS
SELECT S.EVENT_ID,
DECODE (C.RELEASE_DATE,NULL,TO_DATE('01-JAN-1900','DD-MON-YYYY'),C.RELEASE_DATE) AE_RELEASE_DATE,
DECODE (C.FINAL_DATE,NULL,TO_DATE('31-DEC-2100','DD-MON-YYYY'),C.FINAL_DATE) AE_FINAL_DATE,
DECODE (C.EVENT_DESCRIPTION, NULL, S.DESCRIPTION, C.EVENT_DESCRIPTION) AE_DESCRIPTION
FROM   CHANGED_EVENTS C, STANDARD_EVENTS S
WHERE  C.STD_EVENT_ID (+) = S.EVENT_ID;
