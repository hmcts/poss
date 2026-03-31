/*
 * Created on 30-Jul-2004
 *
 */
package uk.gov.dca.db.xslt;

import org.apache.xalan.extensions.ExpressionContext;
import org.w3c.dom.Node;

import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.ejb.SupsRemoteServiceProxy;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.exception.BusinessException;

/**
 * @author Michael Barker
 * 
 * Java Xalan extension class to allow for dynamic invocation of EJB classes from
 * XSLT.
 * 
 * TODO: No security has been integrated here, currently supplies emtpy
 * user name and mac values.  This may not be a problem as it will mostly
 * run locally and user may already be authorised.
 * 
 * TODO: Is build elements from returned strings the best approach.
 * Would could modify the DB Service implementation to return a org.w3c.dom.Element
 * instead of a string.  This may be more effiecient.
 *
 */
public class EJBExtension
{
    private final static Class[] SERVICE_PARAM_TYPES = { String.class, String.class, String.class };  
    
    /**
     * Invokes a local EJB service from an XSLT.  This method only works with the
     * DB Service style ejbs that take 3 arguments for their busines methods.
     * 
     * @param ctx XSLT Expression context.
     * @param jndiName The jndi name of the bean.
     * @param methodName The business method of the bean.
     * @param xmlParams The XML parameter structure.
     * @return
     */
    public static Node invokeLocal(ExpressionContext ctx, String jndiName, String methodName, String xmlParams)
    	throws SystemException, BusinessException
    {      	
        SupsLocalServiceProxy proxy = new SupsLocalServiceProxy();
        return proxy.getNode(jndiName,methodName,xmlParams);
    }

    
    /**
     * Invokes a remote EJB service from an XSLT.  This method only works with the
     * DB Service style ejbs that take 3 arguments for their busines methods.
     * 
     * @param ctx XSLT Expression context.
     * @param jndiName The jndi name of the bean.
     * @param methodName The business method of the bean.
     * @param xmlParams The XML parameter structure.
     * @return
     */
    public static Node invoke(ExpressionContext ctx, String jndiName, String methodName, String xmlParams)
		throws SystemException, BusinessException
	{
        SupsRemoteServiceProxy proxy = new SupsRemoteServiceProxy();
        return proxy.getNode(jndiName,methodName,xmlParams);
    }
}
