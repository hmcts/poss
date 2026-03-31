/*
 * Created on 18-Jul-2005
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
import uk.gov.dca.transformation.case_legacy_service.java.impl.CaseTransferManager;

/**
 * @author Troy Baines
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class AEEventsProcessor extends AbstractXMLProcessor {
    private static final Log log = LogFactory.getLog(AEEventsProcessor.class);
    private static final String START_TAG = "<params><param name=\"AEEvent\">"; 
    private static final String END_TAG = "</param></params>";
    private Map nonLegacyEventMap;
    
    public AEEventsProcessor(IServiceType serviceType) {
        super(serviceType);
        nonLegacyEventMap = CaseTransferManager.getInstance().getNonLegacyEventMap();
    }
    
    public void xmlProcessor(List params, Map keySeq, Document doc) throws SystemException {
    	log.info("Start XML Processor of type" + this.getClass().getName());
    	if(params.size() > 0) {
	    	StringBuffer strBuf = new StringBuffer();
	    	String aEEventStr;
	        addStartTag(strBuf);
	        for(Iterator i = params.iterator(); i.hasNext();) {
	            Object currentObj = (Object) i.next();
	            if(currentObj instanceof Element) {
	            	checkNonLegacyEvent((Element)currentObj);
	            	strBuf.append(getXMLString((Element)currentObj));
	            }
	        }
	         
	        addEndTag(strBuf);         
	        aEEventStr = strBuf.toString();
	        
	        addSeqKeys(callService(aEEventStr), keySeq, IXMLProcessor.AEEVENT_KEY, "//AEEvents//AEEvent//EventSeq", "//AEEvents//AEEvent//AEEventSequence"); 
    	}
	        log.info("End XML Processor of type" + this.getClass().getName());
    }
    
    private void checkNonLegacyEvent(Element ele) throws SystemException {
        List paramsEvents;
        try {
            paramsEvents = XPath.selectNodes(ele, "//AEEvents//AEEvent//EventID");
            Iterator it = paramsEvents.iterator();
            while(it.hasNext()) {
                Element nonLegacyEventElement = (Element) it.next();
                if(nonLegacyEventMap.containsKey(nonLegacyEventElement.getText())) {
                    nonLegacyEventElement.setText((String)nonLegacyEventMap.get(nonLegacyEventElement.getText()));
                }
            }
        } catch (JDOMException e) {
            log.error("Jdom Exception Error in populateNonEventMap = " + e.getMessage(), e);  
            throw new SystemException("Jdom Exception Error in populateNonEventMap = " + e.getMessage(), e);
        }
    }
    
    private void addStartTag(StringBuffer strBuf) {
        strBuf.append(START_TAG);
    }
    
    private void addEndTag(StringBuffer strBuf) {
        strBuf.append(END_TAG);
    }
}
