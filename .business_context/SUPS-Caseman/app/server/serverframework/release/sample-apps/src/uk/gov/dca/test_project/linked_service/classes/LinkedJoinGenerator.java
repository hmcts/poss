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

public class LinkedJoinGenerator implements ISQLGenerator {

    /**
     * @see uk.gov.dca.db.pipeline.ISQLGenerator#generate(org.jdom.Document, uk.gov.dca.db.pipeline.IQueryContextReader)
     */
    public String generate(Document inputXML, IQueryContextReader context) throws BusinessException, SystemException {
        return "CPR.CASE_NUMBER = C.CASE_NUMBER AND " +
                "CPR.PARTY_ROLE_CODE = 'CLAIMANT' AND " +
                "P.PARTY_ID = CPR.PARTY_ID";
    }

    /**
     * @see uk.gov.dca.db.pipeline.ISQLGenerator#initialise(org.jdom.Element)
     */
    public void initialise(Element generateConfig) throws SystemException {
    }

    /* (non-Javadoc)
     * @see java.lang.Object#clone()
     */
    public Object clone() {
        return new LinkedJoinGenerator();
    }

    
    
}
