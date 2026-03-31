/*
 * Created on 06-Jul-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.transformation.common.web_delegator;

import uk.gov.dca.db.exception.SystemException;

/**
 * @author Amjad Khan
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public interface IWebServiceDelegator {
    
    public String invokeWebService(String params) throws SystemException;
    
    public static final String APPLICATION_SERVER_NAME___ = "TRANSFER???";
    public static final String APPLICATION_METHOD_NAME___ = "TRANSFER???";
    
    //Test Setups
    public static final String APPLICATION_SERVER_NAME_TEST = "Obligation";
    public static final String APPLICATION_METHOD_NAME_TEST = "ObligationType";
    
    public static final String WARRANT_SERVER_NAME = "Warrant";
    public static final String WARRANT_METHOD_NAME = "addWarrant";
    
    public static final String CASE_EVENT_SERVER_NAME = "CaseEvent";
    public static final String CASE_EVENT_METHOD_NAME = "addCaseEvent";
    
    public static final String CASE_SERVER_NAME = "LegacyInbound";
    public static final String CASE_METHOD_NAME = "caseTransfer";
    
}
