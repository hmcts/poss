/*
 * Created on 15-Jul-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.transformation.case_legacy_service.java;

import uk.gov.dca.db.exception.SystemException;

/**
 * @author Amjad Khan
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public interface IServiceType {

    public String getBeanServiceName();
    public String getMethodName();
    public String getXpath();
    public String getCustomProcessorName() ;
    public String getOrderNo();
    public IXMLProcessor getProcessor() throws SystemException;
    
}
