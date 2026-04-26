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

/**
 * @author Amjad Khan
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class DefendantProcessor extends AbstractXMLProcessor {
    private static final Log log = LogFactory.getLog(DefendantProcessor.class);
    private static final String START_TAG = "<params><param name=\"defendant\">";
    private static final String END_TAG = "</param></params>";
    
    public DefendantProcessor(IServiceType serviceType) {
        super(serviceType);
    }
    
    public void xmlProcessor(List params, Map keySeq, Document doc) throws SystemException {
        log.info("Start XML Processor of type " + this.getClass().getName());
        if(params.size() > 0) {
	        StringBuffer strBuf = new StringBuffer();
	        addStartTag(strBuf);
	        for(Iterator i = params.iterator(); i.hasNext();) {
	            Object currentObj = (Object) i.next();
	            if(currentObj instanceof Element) {
	                removeLocalCodedParties((Element)currentObj, "//Defendants//Defendant//Solicitor//SolCode");
	                addMissingTags((Element)currentObj);
	                strBuf.append(getXMLString((Element)currentObj));
	            }
	        }
	        	        
	        addEndTag(strBuf);
        	callService(strBuf.toString());
        }
        log.info("End XML Processor of type " + this.getClass().getName());
    }
    
    private void addMissingTags(Element ele) throws SystemException {
        
        try {
            List paramsDefendants = XPath.selectNodes(ele, "//Defendants//Defendant");
       
            for(Iterator i = paramsDefendants.iterator(); i.hasNext();) {
                Element currentObj = (Element) i.next();
           
                if(currentObj instanceof Element) {
                    List defendantsElement = currentObj.getChildren();             
                    Element paramsSolicitor = (Element) XPath.selectSingleNode(currentObj, "./Solicitor");                                                 
                          
                    if(paramsSolicitor == null) {
                        Element solElement = new Element("Solicitor");
                        solElement.addContent(new Element("SolCode"));
                        solElement.addContent(new Element("SolicitorName"));
	                    solElement.addContent(new Element("SolicitorAddrLine1"));
	                    solElement.addContent(new Element("SolicitorAddrLine2"));
	                    solElement.addContent(new Element("SolicitorAddrLine3"));
	                    solElement.addContent(new Element("SolicitorAddrLine4"));
	                    solElement.addContent(new Element("SolicitorAddrLine5"));
	                    solElement.addContent(new Element("SolicitorPostcode"));
	                    solElement.addContent(new Element("SolicitorTelNo"));
	                    solElement.addContent(new Element("SolicitorDX"));                  
	                    currentObj.addContent(solElement);  
                    }                   
                }
            }                     
   		} catch (JDOMException e) {
   		    throw new SystemException("JDom Excepetion Caught in XML Processor " + this.getClass().getName() + " In method addMissingTags", e);
   		}
    }
 
    private void addStartTag(StringBuffer strBuf) {
        strBuf.append(START_TAG);
    }
    
    private void addEndTag(StringBuffer strBuf) {
        strBuf.append(END_TAG);
    }
}
