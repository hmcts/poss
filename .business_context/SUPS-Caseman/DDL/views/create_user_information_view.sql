/*******************************************************************************
 *      Module:         CREATE_WARRANT_FEES_VIEW.sql                           *
 *                                                                             *
 *      Description:    Script to create the user_information view used in     *
 *                      the Oracle Reports                                     * 
 *                                                                             *
 *      (c) copyright EDS 2005                                                 *
 *                                                                             *
 *      Amendment History:                                                     *
 *      Version         Date         Changed By      Description               *
 *      1.0             06/12/05     Simon Wenham    Original Version          * 
 *      1.1             12/01/06     Mike Brock      Change of name of section *
 *                                                   column
 *******************************************************************************/
CREATE OR REPLACE VIEW user_information AS
  SELECT du.user_id user_id,
	 du.user_short_name name,
         du.SECTION_FOR_PRINTOUTS SECTION,
	 du.extension extension
  FROM DCA_USER du;

