/*
 * Created on 02-Sep-2005
 *
 */
package uk.gov.dca.test_project.linked_service.classes;

import org.jdom.Document;
import org.jdom.Element;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IQueryContextReader;
import uk.gov.dca.db.pipeline.ISQLGenerator;

public class SQLGenerator implements ISQLGenerator {

    public void initialise(Element generateConfig) throws SystemException {
    }

    public String generate(Document inputXML, IQueryContextReader context)
            throws BusinessException, SystemException {
        
        Object caseNumber = context.getValue("C.CASE_NUMBER");
        String sql = "SELECT CPR.CASE_PARTY_NO AS \"CPR.CASE_PARTY_NO\", P.PARTY_ID AS \"P.PARTY_ID\", P.PERSON_REQUESTED_NAME AS \"P.PERSON_REQUESTED_NAME\", P.ORA_ROWSCN AS \"P_ORA_ROWSCN\", CPR.ORA_ROWSCN AS \"CPR_ORA_ROWSCN\" " +
                "FROM PARTIES P, CASE_PARTY_ROLES CPR " + 
                "WHERE (CPR.CASE_NUMBER = '" + caseNumber + "' " +
                "AND CPR.PARTY_ROLE_CODE = 'CLAIMANT' AND P.PARTY_ID = CPR.PARTY_ID)";
        return sql;
    }
    
    public Object clone() {
        return new SQLGenerator();
    }

}
