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
import uk.gov.dca.transformation.case_legacy_service.java.IXMLProcessor;

/**
 * @author Troy Baines
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class WindowForTrialProcessor extends AbstractXMLProcessor {
    private static final Log log = LogFactory.getLog(WindowForTrialProcessor.class);
    private static final String START_TAG = "<params><param name=\"WindowForTrial\">"; 
    private static final String END_TAG = "</param></params>";
    
    public WindowForTrialProcessor(IServiceType serviceType) {
        super(serviceType);
    }
    
    public void xmlProcessor(List params, Map keySeq, Document doc) throws SystemException {
        log.info("Start XML Processor of type" + this.getClass().getName());
        if(params.size() > 0) {
	        StringBuffer strBuf = new StringBuffer();
	        String WindowForTrialStr;
	        addStartTag(strBuf);
	        for(Iterator i = params.iterator(); i.hasNext();) {
	            Object currentObj = (Object) i.next();
	            if(currentObj instanceof Element) {
	                strBuf.append(getXMLString((Element)currentObj));
	            }
	        }
	        addEndTag(strBuf);
	        WindowForTrialStr = strBuf.toString();
	        callService(WindowForTrialStr);
        }
        log.info("End XML Processor of type" + this.getClass().getName());
    }
    
    private void addStartTag(StringBuffer strBuf) {
        strBuf.append(START_TAG);
    }
    
    private void addEndTag(StringBuffer strBuf) {
        strBuf.append(END_TAG);
    }
}
