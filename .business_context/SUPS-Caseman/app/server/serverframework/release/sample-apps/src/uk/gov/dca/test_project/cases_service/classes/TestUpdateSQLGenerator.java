/*
 * Created on 13-Dec-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.test_project.cases_service.classes;

import org.jdom.Document;
import org.jdom.Element;

import uk.gov.dca.db.pipeline.IQueryContextReader;
import uk.gov.dca.db.pipeline.ISQLGenerator;
import uk.gov.dca.db.exception.BusinessException;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class TestUpdateSQLGenerator implements ISQLGenerator {

	/**
	 * 
	 */
	public TestUpdateSQLGenerator() {
		super();
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.ISQLGenerator#initialise(org.jdom.Element)
	 */
	public void initialise(Element generateConfig) {
		// empty
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.ISQLGenerator#generate(org.jdom.Document, uk.gov.dca.db.pipeline.IQueryContextReader)
	 */
	public String generate(Document inputXML, IQueryContextReader context) throws BusinessException {
		StringBuffer buffer = new StringBuffer();
		buffer.append("UPDATE CASES C SET C.ADMIN_CRT_CODE = ");
		buffer.append("${c.admin_crt_code} ");
		buffer.append("WHERE C.CASE_NUMBER = ");
		buffer.append("${C.CASE_NUMBER}");
		return buffer.toString();
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#clone()
	 */
	public Object clone() {
		// TODO Auto-generated method stub
		return this;
	}

}
