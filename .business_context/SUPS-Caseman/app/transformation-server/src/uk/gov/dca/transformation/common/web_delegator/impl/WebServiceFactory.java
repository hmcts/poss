/*
 * Created on 06-Jul-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.transformation.common.web_delegator.impl;

import uk.gov.dca.transformation.common.web_delegator.IWebServiceDelegator;

/**
 * @author Amjad Khan
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class WebServiceFactory {
    
    public static IWebServiceDelegator createWebServiceDelagator(String applicationServerName, String applicationMethodName) {
        return (IWebServiceDelegator) new WebServiceDelegator(applicationServerName, applicationMethodName);
    }
}
