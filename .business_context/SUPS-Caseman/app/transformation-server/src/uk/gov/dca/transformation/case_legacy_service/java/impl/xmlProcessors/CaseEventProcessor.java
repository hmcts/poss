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
 * @author Amjad Khan
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class CaseEventProcessor extends AbstractXMLProcessor {
    private static final Log log = LogFactory.getLog(CaseEventProcessor.class);
    private static final String START_TAG = "<params><param name=\"caseEvent\">";
    private static final String END_TAG = "</param></params>";
    private Map nonLegacyEventMap;
    
    public CaseEventProcessor(IServiceType serviceType) {
        super(serviceType);
        nonLegacyEventMap = CaseTransferManager.getInstance().getNonLegacyEventMap();
    }
    
    public void xmlProcessor(List params, Map keySeq, Document doc) throws SystemException {
        log.info("Start XML Processor of type " + this.getClass().getName());
        if(params.size() > 0) {
	        
            StringBuffer strBuf = new StringBuffer();
	        String caseEventStr;
	        addStartTag(strBuf);
	        for(Iterator i = params.iterator(); i.hasNext();) {
	            Object currentObj = (Object) i.next();
	            if(currentObj instanceof Element) {
	                addMissingTags((Element)currentObj);
	                checkNonLegacyEvent((Element)currentObj);
	                strBuf.append(getXMLString((Element)currentObj));
	            }
	        }
	        	        
	        addEndTag(strBuf);
	        caseEventStr = strBuf.toString();
	        caseEventStr = replaceKeys(caseEventStr, keySeq, doc, IXMLProcessor.JUDGEMENT_KEY, "<JudgSequence>", "//params//ManageCase//CaseEvents//CaseEvent//JudgSequence");
	        caseEventStr = replaceKeys(caseEventStr, keySeq, doc, IXMLProcessor.VARIATION_KEY, "<VarySequence>", "//params//ManageCase//CaseEvents//CaseEvent//VarySequence");
	        addSeqKeys(callService(caseEventStr), keySeq, IXMLProcessor.CASEEVENT_KEY, "//CaseEvents//CaseEvent//EventSeq", "//CaseEvents//CaseEvent//CaseEventSequence"); 
        }
        log.info("End XML Processor of type " + this.getClass().getName());
    }
    
    private void checkNonLegacyEvent(Element ele) throws SystemException {
        List paramsEvents;
        try {
            paramsEvents = XPath.selectNodes(ele, "//CaseEvents//CaseEvent//EventID");
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
    
    private void addMissingTags(Element ele) throws SystemException {
             
        try {
            List paramsEvents = XPath.selectNodes(ele, "//CaseEvents//CaseEvent");
            
            for(Iterator i = paramsEvents.iterator(); i.hasNext();) {
                Element currentObj = (Element) i.next();
                
                if(currentObj instanceof Element) {
                    List caseEventElement = currentObj.getChildren();

                    //Element paramsDeftCaseNumber = (Element) XPath.selectSingleNode(paramsEvents, "(//CaseEvent//DeftCaseNumber)["+ pos +"]");
                    Element paramsDeftCaseNumber = (Element) XPath.selectSingleNode(currentObj, "./DeftCaseNumber");                                                 
                    Element paramsDeftID = (Element) XPath.selectSingleNode(currentObj, "./DeftID");
                    Element paramsWarrantNumber = (Element) XPath.selectSingleNode(currentObj, "./WarrantNumber");
                     
                    if(paramsDeftID == null) {
                        ((Element)currentObj).addContent(new Element("DeftID"));  
                    }                   
                    if(paramsDeftCaseNumber == null) {
                        ((Element)currentObj).addContent(new Element("DeftCaseNumber"));
                    }
                    if(paramsWarrantNumber == null) {
                        ((Element)currentObj).addContent(new Element("WarrantNumber"));                      
                    } 
                }
            }                     
        } catch (JDOMException e) {
            throw new SystemException("JDom Excepetion Caught in XML Processor " + this.getClass().getName() + " In method addMissingTags", e);
        }
    }
    
    private void addEndTag(StringBuffer strBuf) {
        strBuf.append(END_TAG);
    }
}
