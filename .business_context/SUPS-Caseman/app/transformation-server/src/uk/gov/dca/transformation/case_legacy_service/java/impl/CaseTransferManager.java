/*
 * Created on 06-Jul-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.transformation.case_legacy_service.java.impl;

import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import uk.gov.dca.transformation.common.web_delegator.IWebServiceObject;
import uk.gov.dca.db.exception.SystemException;

/**
 * @author Amjad Khan
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class CaseTransferManager {
    private static final Log log = LogFactory.getLog(CaseTransferManager.class);
    private static final CaseTransferManager instance = new CaseTransferManager();
    protected List serviceConfig;
    protected Map nonEventLegacyMap;
    
    private CaseTransferManager(){      
        load();
    }
    
    public static CaseTransferManager getInstance() {     
        return instance;
    }
    
    public IWebServiceObject getServiceObject(int listNumber) {
            return (IWebServiceObject) serviceConfig.get(listNumber);
    }
    
    public List getServiceObject() {
        return serviceConfig;
    }
    
    public Map getNonLegacyEventMap() {
        return nonEventLegacyMap;
    }
    
    private void load(){
        try {
            log.debug("In Load");
            CaseTransferXmlProcessor cTXP = new CaseTransferXmlProcessor();
            serviceConfig = cTXP.getConfigObjects();
            nonEventLegacyMap = cTXP.getNonLegacyEventMap(); 
        } catch(SystemException se) {
            log.error("Unable to Load Data", se);
        }
    }
    
}
