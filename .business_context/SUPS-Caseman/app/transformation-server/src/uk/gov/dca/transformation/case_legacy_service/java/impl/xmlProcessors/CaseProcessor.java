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
public class CaseProcessor extends AbstractXMLProcessor {
    private static final Log log = LogFactory.getLog(CaseProcessor.class);
    private static final String START_TAG = "<params><param name=\"caseNumber\">"; //<Obligations>";
    private static final String END_TAG = "</param></params>";
    
    public CaseProcessor(IServiceType serviceType) {
        super(serviceType);
    }
     
    public void xmlProcessor(List params, Map keySeq, Document doc) throws SystemException {
        log.info("Start XML Processor of type " + this.getClass().getName());
        StringBuffer strBuf = new StringBuffer();
        addStartTag(strBuf);
        for(Iterator i = params.iterator(); i.hasNext();) {
            Object currentObj = (Object) i.next();
            if(currentObj instanceof Element) {
            	addMissingTags((Element)currentObj);
            	removeLocalCodedParties((Element)currentObj, "//Case//RepAddress//Address//RepCode");
            	removeLocalCodedParties((Element)currentObj, "//Case//PlantiffAddress//Address//RepCode");
            	strBuf.append(getXMLString((Element)currentObj));
            }
        }
        addEndTag(strBuf);
        callService(strBuf.toString());
        log.info("End XML Processor of type " + this.getClass().getName());
    }
    
    private void addMissingTags(Element ele) throws SystemException {
        
    	try {
    		List paramsEvents = XPath.newInstance("//Case//RepAddress").selectNodes(ele);   
                 
    		for(int i = 0; i < paramsEvents.size(); i++) {
    			Object currentObj = (Object) paramsEvents.get(i);
    			if(currentObj instanceof Element) {	               
    				Element paramsRepAddress = (Element) XPath.selectSingleNode(currentObj, "//Case//RepAddress//Address");
    				                                   
    				if(paramsRepAddress == null) {
    					((Element)currentObj).addContent(new Element("Address"));
    					Element paramsAddress = (Element) XPath.selectSingleNode(currentObj, "//Case//RepAddress//Address");
    					if(paramsAddress != null) {
    						paramsAddress.addContent(new Element("RepCode"));
    						paramsAddress.addContent(new Element("RepName"));
    						paramsAddress.addContent(new Element("Line1"));
    						paramsAddress.addContent(new Element("Line2"));
    						paramsAddress.addContent(new Element("Line3"));
    						paramsAddress.addContent(new Element("Line4"));
    						paramsAddress.addContent(new Element("PostCode"));
    						paramsAddress.addContent(new Element("Reference"));
    						paramsAddress.addContent(new Element("DX"));
    						paramsAddress.addContent(new Element("TelephoneNumber"));
    					}
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
