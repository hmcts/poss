/*
 * Created on 05-Sep-2005
 *
 */
package uk.gov.dca.test_project.linked_service.classes;

import org.jdom.Document;
import org.jdom.Element;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IQueryContextReader;
import uk.gov.dca.db.pipeline.ISQLGenerator;

public class LinkedSQLGenerator implements ISQLGenerator {

    public void initialise(Element generateConfig) throws SystemException {
        // TODO Auto-generated method stub
        
    }

    public String generate(Document inputXML, IQueryContextReader context) throws BusinessException, SystemException {
        String sql = "SELECT C.ADMIN_CRT_CODE AS \"C.ADMIN_CRT_CODE\", " +
                "C.CASE_NUMBER AS \"C.CASE_NUMBER\", C.CASE_TYPE AS \"C.CASE_TYPE\", " +
                "C.STATUS AS \"C.STATUS\", CPR.CASE_PARTY_NO AS \"CPR.CASE_PARTY_NO\", " +
                "CPR.PARTY_ID AS \"CPR.PARTY_ID\", CTS.CODE AS \"CTS.CODE\", CTS.NAME AS \"CTS.NAME\", " +
            "P.PARTY_ID AS \"P.PARTY_ID\", P.PERSON_REQUESTED_NAME AS \"P.PERSON_REQUESTED_NAME\", " +
            "C.CASE_NUMBER || C.CASE_TYPE AS \"C.CASE_EXTRA\", "+ 
            "CPR.ORA_ROWSCN AS \"CPR_ORA_ROWSCN\", C.ORA_ROWSCN AS \"C_ORA_ROWSCN\", " +  
            "P.ORA_ROWSCN AS \"P_ORA_ROWSCN\", CTS.ORA_ROWSCN AS \"CTS_ORA_ROWSCN\" " + 
        " FROM CASE_PARTY_ROLES CPR, CASES C, PARTIES P, COURTS CTS " +
        " WHERE (CTS.CODE = C.ADMIN_CRT_CODE) AND " +
        "(CPR.CASE_NUMBER = C.CASE_NUMBER AND CPR.PARTY_ROLE_CODE = 'CLAIMANT' AND  " +
        "P.PARTY_ID = CPR.PARTY_ID) " +
        "ORDER BY C.CASE_NUMBER ASC";
        return sql;
    }

    public Object clone() {
        return new LinkedSQLGenerator();
    }

}
