/*
 * Created on 15-Aug-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.transformation.case_legacy_service.java.impl.xmlProcessors;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.transformation.case_legacy_service.java.IServiceType;
import uk.gov.dca.transformation.case_legacy_service.java.IXMLProcessor;

/**
 * @author Troy Baines
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class AEApplicationsProcessor extends AbstractXMLProcessor {
    private static final Log log = LogFactory.getLog(AEApplicationsProcessor.class);
    private static final String START_TAG = "<params><param name=\"AEApplication\">"; 
    private static final String END_TAG = "</param></params>";
    
    public AEApplicationsProcessor(IServiceType serviceType) {
        super(serviceType);
    }
    
    public void xmlProcessor(List params, Map keySeq, Document doc) throws SystemException {
        log.info("Start XML Processor of type" + this.getClass().getName());
        if(params.size() > 0) {
	    	generateDefendantID(doc);
	    	StringBuffer strBuf = new StringBuffer();
	    	String AEApplicationStr;
	    	addStartTag(strBuf);
	    	for(Iterator i = params.iterator(); i.hasNext();) {
	    		Object currentObj = (Object) i.next();
	    		if(currentObj instanceof Element) {
	    			strBuf.append(getXMLString((Element)currentObj));
	    		}
	    	}
	    	addEndTag(strBuf);
	    	
	    	AEApplicationStr = strBuf.toString();
	    	AEApplicationStr = replaceKeys(AEApplicationStr, keySeq, doc, IXMLProcessor.JUDGEMENT_KEY, "<AEAppJudgSeq>", "//params//ManageCase//AEApplications//AEApplication//AEAppJudgSeq");
	    	callService(AEApplicationStr);
	    	
        }	
	    	log.info("End XML Processor of type" + this.getClass().getName());
    }
    
    private void addStartTag(StringBuffer strBuf) {
        strBuf.append(START_TAG);
    }
    
    private void addEndTag(StringBuffer strBuf) {
        strBuf.append(END_TAG);
    }
    
    private void generateDefendantID(Document doc)
	throws SystemException
			
	{		
	//DefendantID - Use AgainstPartyNo IF AgainstPartyRoleCode = DEFENDANT
    //		ELSE set DefendantID = 0 (tells user that AEApp is for Claimant)
    
	List AEApplicationsList = null;
	Element AEApplication = null;
	String AgainstPartyRoleCode = null;
	String AgainstPartyNumber = null;
	Element DefendantIDElement = null;
	Element CaseForTransfer = null;
	
	CaseForTransfer = doc.getRootElement();
	try {
	
		AEApplicationsList = (XPath.selectNodes(
						CaseForTransfer,
						"//AEApplication"));

		for(Iterator i = AEApplicationsList.iterator(); i.hasNext();) {
		    			AEApplication = (Element) i.next();
		    		
		    			AgainstPartyRoleCode = ((Element)(XPath.selectSingleNode(
		    					AEApplication, 
			    				"AEAppPartyAgainstRoleCode"))).getText();
		
		    			if (AgainstPartyRoleCode.equals("DEFENDANT")) {
    	    					
		    				AgainstPartyNumber = ((Element)(XPath.selectSingleNode(
		    						AEApplication, 
    	    					"AEAppPartyAgainstCasePartyNo"))).getText();
    	        			
		    				DefendantIDElement = ((Element)(XPath.selectSingleNode(
		    						AEApplication,
									"AEAppDefendantID")));
		    				DefendantIDElement.setText(AgainstPartyNumber);

		    			} else{
		    				
		    				DefendantIDElement = ((Element)(XPath.selectSingleNode(
		    						AEApplication,
									"AEAppDefendantID")));
		    				DefendantIDElement.setText("0");
		    				
		    			}			
		}
		
	} catch (JDOMException e) {
		throw new SystemException("Wrapped JDOM Exception caught in method generateDefendantID", e);
		}
	}
}
