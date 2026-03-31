/*
 * Created on 09-Mar-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.transformation.case_legacy_service.java.impl;


import java.io.Writer;
import java.util.Iterator;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Document;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;
import uk.gov.dca.transformation.case_legacy_service.java.ICaseTransferCentralCustomProcessor;
import uk.gov.dca.transformation.case_legacy_service.java.IServiceType;
import uk.gov.dca.transformation.case_legacy_service.java.IXMLProcessor;

/**
 * @author Amjad Khan
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class CaseTransferCentralCustomProcessor implements ICustomProcessor,  ICaseTransferCentralCustomProcessor {
	private static final Log log = LogFactory.getLog(CaseTransferCentralCustomProcessor.class);
	
    public CaseTransferCentralCustomProcessor() {
    }
    
    public Document process(Document params) throws SystemException {
        callServices(params);
        return new Document(); 
    }
    
    public void process(Document params, Writer writer, Log log) throws SystemException {
        callServices(params);       
    }
    
    /* (non-Javadoc)
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#setContext(uk.gov.dca.db.pipeline.IComponentContext)
     */
    public void setContext(IComponentContext context) {
    }  
    
    private void callServices(Document params) throws SystemException {
        List serviceList = CaseTransferManager.getInstance().getServiceObject();
        Iterator itServList = serviceList.iterator();
        Map seqKeyMaps = createSeqKeyMap();
             
        while(itServList.hasNext()) {
            IServiceType serviceT =(IServiceType) itServList.next(); 

            try {                                    
                serviceT.getProcessor().xmlProcessor(((List)XPath.newInstance(serviceT.getXpath()).selectNodes(params)), seqKeyMaps, params);                 
            } catch (SystemException se) {
                log.error("Service Exception caught in Call Services method of CaseTransferCentralCustomProcessor for ServiceType \n " + serviceT.toString() + "\n");
                throw se;
            } catch (JDOMException e) {
                log.error("JDOM Exception caught in Call Service method of CaseTransferCentralCustomProcessor for ServiceType \n " + serviceT.toString() + "\n");
                throw new SystemException("Wrapping JDOM Exception caught in Call Services method of CaseTransferCentralCustomProcessor /n" + e.getMessage(), e);
            } 
        }
    } 
    
    private HashMap createSeqKeyMap() {
        HashMap seqKeyMaps = new HashMap();
        seqKeyMaps.put(IXMLProcessor.JUDGEMENT_KEY, new HashMap());
        seqKeyMaps.put(IXMLProcessor.CASEEVENT_KEY, new HashMap());
        seqKeyMaps.put(IXMLProcessor.VARIATION_KEY, new HashMap());
        seqKeyMaps.put(IXMLProcessor.AEEVENT_KEY, new HashMap());
        return seqKeyMaps;
    }
}
