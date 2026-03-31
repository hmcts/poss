/*
 * Created on 26-Oct-2004
 *
 */
package uk.gov.dca.test_project.cases_service.classes;


import java.io.StringReader;
import java.io.Writer;
import java.io.IOException;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.pipeline.AbstractCustomProcessor;
import uk.gov.dca.db.exception.*;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;

/**
 * @author GrantM
 *
 */
public class AggregatedTransactionProcessor extends AbstractCustomProcessor {
	
	public AggregatedTransactionProcessor() {
		super();
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer, org.apache.commons.logging.Log)
	 */
	public void process(Document inputParameters, Writer output, Log log)
		throws BusinessException, SystemException
	{
		XMLOutputter outputter = new XMLOutputter();
		SupsLocalServiceProxy proxy = new SupsLocalServiceProxy();
		
		String result1 = proxy.getString("ejb/CasesServiceLocal", "updateCasesLocal", 
				outputter.outputString(inputParameters), true);
		log.info("UPDATED 1:"+result1);
		
		SAXBuilder builder = new SAXBuilder();
    	Document resultDoc = null;
		
		try {
			builder.build(new StringReader(result1));
		}
    	catch(IOException e) {
    		throw new SystemException(e);
    	}
    	catch(JDOMException e) {
    		throw new BusinessException(e);
    	}
    	
		// now update again but having changed some data
		Element caseTypeElement = null;
		
		try {
			caseTypeElement = (Element)XPath.selectSingleNode(resultDoc,"/params/param[@name='Cases']/Cases/Case/CaseType");
		}
		catch(JDOMException e) {
			throw new BusinessException(e.getMessage(),e);
		}
		caseTypeElement.setText("ROLLBACK2");
		
		String result2 = proxy.getString("ejb/CasesServiceLocal", "updateCasesLocal", 
				outputter.outputString(resultDoc), true);
		log.info("UPDATED 2:" + result2);
		
		proxy.getString("ejb/CasesServiceLocal", "throwBusinessExceptionLocal", "", true);
	}

}
