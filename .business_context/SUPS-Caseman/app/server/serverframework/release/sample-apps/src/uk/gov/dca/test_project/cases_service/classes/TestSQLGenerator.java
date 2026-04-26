/*
 * Created on 07-Dec-2004
 *
 */
package uk.gov.dca.test_project.cases_service.classes;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.xpath.XPath;
import org.jdom.JDOMException;

import uk.gov.dca.db.pipeline.IQueryContextReader;
import uk.gov.dca.db.pipeline.ISQLGenerator;
import uk.gov.dca.db.exception.*;

/**
 * @author GrantM
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class TestSQLGenerator implements ISQLGenerator {

	/**
	 * 
	 */
	public TestSQLGenerator() {
		super();
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.ISQLGenerator#initialise(org.jdom.Element)
	 */
	public void initialise(Element generateConfig) {
		// nothing to do here
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.ISQLGenerator#generate(org.jdom.Document, uk.gov.dca.db.pipeline.IQueryContextReader)
	 */
	public String generate(Document inputXML, IQueryContextReader context)
			throws SystemException
	{
		// first prove that the framework passes the expected documnet.
		// [ this is to test defect fix 178 ]
		// should be:
		//"<params>" +
		//"<param name='caseType'>CLAIM - SPEC ONLY</param>" +
		//"<param name='adminCourtCode'>211</param>" +
		//"</params>"
		Element root = inputXML.getRootElement();
		Element currentElement = null;
		boolean bValidInput = false;
		if ( "params".compareTo(root.getName()) == 0 ) {
			try {
				currentElement = (Element)XPath.selectSingleNode(inputXML, "/params/param[@name='caseType']");
				if ( currentElement != null ) {
					currentElement = (Element)XPath.selectSingleNode(inputXML, "/params/param[@name='adminCourtCode']");
					if ( currentElement != null ) {
						bValidInput = true;
					}
				}
			}
			catch(JDOMException e) {
				//swallow because bValidInput is used to throw final exception
			}
		}
		
		if (bValidInput == false) {
			throw new SystemException("Wrong document passed to ISQLGenerator");
		}
		
		// now check that context is passed correctly + use to form query.
		String dynamicConstraint = null;
		
		String caseNumber = null;
		String caseType = null;
		
		// get parameters specified in method file
		Object oCaseNumber = context.getValue("param.caseNumber");
		if ( oCaseNumber != null ) {
			caseNumber = oCaseNumber.toString();
		}
		
		Object oCaseType = context.getValue("param.caseType");
		if ( oCaseType != null ) {
			caseType = oCaseType.toString();
		}
		
		// now form the desired constraint
		if ( caseNumber != null ) {
			dynamicConstraint = "C.CASE_NUMBER = '" + caseNumber + "'";
		}
		
		if ( caseType != null ) {
			String typeConstraint = "C.CASE_TYPE = '" + caseType + "'";
			if ( dynamicConstraint != null )
				dynamicConstraint += " AND " + typeConstraint;
			else
				dynamicConstraint = typeConstraint;
		}
		
		return dynamicConstraint;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#clone()
	 */
	public Object clone() {
		// no config so nothing to clone
		return new TestSQLGenerator();
	}

}
