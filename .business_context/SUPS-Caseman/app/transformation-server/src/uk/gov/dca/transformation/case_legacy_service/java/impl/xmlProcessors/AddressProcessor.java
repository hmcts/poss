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

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.transformation.case_legacy_service.java.IServiceType;

/**
 * @author Amjad Khan
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class AddressProcessor extends AbstractXMLProcessor {
    private static final Log log = LogFactory.getLog(AddressProcessor.class);
    private static final String START_TAG = "<params><param name=\"address\"><Addresses>";
    private static final String END_TAG = "</Addresses></param></params>";
    
    public AddressProcessor(IServiceType serviceType) {
        super(serviceType);
    }
    
    public void xmlProcessor(List params, Map keySeq, Document doc) throws SystemException {
        log.info("Start XML Processor of type" + this.getClass().getName());
        if(params.size() > 0) {     
	        StringBuffer strBuf = new StringBuffer();
	        String obligationStr;
	        addStartTag(strBuf);
	        for(Iterator i = params.iterator(); i.hasNext();) {
	            Object currentObj = (Object) i.next();
	            if(currentObj instanceof Element) {
	                strBuf.append(processAddressElements((Element)currentObj));
	                //strBuf.append(getXMLString((Element)currentObj));
	            }
	        }
	        addEndTag(strBuf);
	        callService( strBuf.toString());
        }
        log.info("End XML Processor of type" + this.getClass().getName());
    }
    
    private String processAddressElements(Element currentObj) {
        List eleList = currentObj.getChildren();
        StringBuffer addressBuf = new StringBuffer();
        for(Iterator i = eleList.iterator(); i.hasNext();) {
            Element elementAddressType = (Element) i.next();
            String name = elementAddressType.getName();
            if(name.equals("Employer") || name.equals("Others") || name.equals("Possession")) {
                addressBuf.append("<Address>");
                addressBuf.append(getXMLString(elementAddressType.getChildren()));
                addressBuf.append("</Address>");
            } 
        }
        return addressBuf.toString();      
    }
            
    private void addStartTag(StringBuffer strBuf) {
        strBuf.append(START_TAG);
    }
    
    private void addEndTag(StringBuffer strBuf) {
        strBuf.append(END_TAG);
    }
}
