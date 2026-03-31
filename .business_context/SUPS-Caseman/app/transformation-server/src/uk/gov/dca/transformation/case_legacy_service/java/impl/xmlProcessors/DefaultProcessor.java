/*
 * Created on 19-Jul-2005
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
 * This Class is being used a default processor as it returns the XML as is if there is 
 * no change, this is to ensure we use the same pattern for processing
 */
public class DefaultProcessor extends AbstractXMLProcessor {
    private static final Log log = LogFactory.getLog(DefaultProcessor.class);
    
    public DefaultProcessor(IServiceType serviceType) {
        super(serviceType);
    }
        
    public void xmlProcessor(List params, Map keySeq, Document doc) throws SystemException {
        log.info("Start XML Processor of type " + this.getClass().getName());
        StringBuffer strBuf = new StringBuffer();
        for(Iterator i = params.iterator(); i.hasNext();) {
            Object currentObj = (Object) i.next();
            if(currentObj instanceof Element) {
                strBuf.append(getXMLString((Element)currentObj));
            }
        }
        callService(strBuf.toString());
        log.info("End XML Processor of type " + this.getClass().getName());
    }
}
