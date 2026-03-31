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
public class TestGetSQLGenerator implements ISQLGenerator {

	/**
	 * 
	 */
	public TestGetSQLGenerator() {
		super();
		// TODO Auto-generated constructor stub
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.ISQLGenerator#initialise(org.jdom.Element)
	 */
	public void initialise(Element generateConfig) {
		// TODO Auto-generated method stub

	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.ISQLGenerator#generate(org.jdom.Document, uk.gov.dca.db.pipeline.IQueryContextReader)
	 */
	public String generate(Document inputXML, IQueryContextReader context)
			throws BusinessException {
		StringBuffer buffer = new StringBuffer();
		buffer.append("SELECT C.ADMIN_CRT_CODE AS \"C.ADMIN_CRT_CODE\",");
		buffer.append("C.CASE_NUMBER AS \"C.CASE_NUMBER\",");
		buffer.append("C.CASE_TYPE AS \"C.CASE_TYPE\",");
		buffer.append("C.STATUS AS \"C.STATUS\",");
		buffer.append("C.ORA_ROWSCN AS C_ORA_ROWSCN ");
		buffer.append("FROM CASES C "); 
		buffer.append("WHERE (c.case_number = ${param.caseNumber})");
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
