/*
 * Created on 13-Aug-2004
 *
 */
package uk.gov.dca.db.ejb;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.exception.BusinessException;
import java.io.StringWriter;

/**
 * @author Grant Miller
 *
 */
public class SupsLocalServiceProxy extends AbstractSupsServiceProxy 
{
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.ejb.AbstractSupsServiceProxy#invoke(java.lang.String, java.lang.String, java.lang.String)
	 */
	protected final String invoke(String jndiName, String methodName, String xmlParams)
		throws SystemException, BusinessException
	{		
		StringWriter output = new StringWriter();
		Object[] params = new Object[] { xmlParams, output };
		EJBServiceProxy.invokeLocal(jndiName, methodName, LOCAL_SERVICE_PARAM_TYPES, params);
		
		return output.toString();
	}

}
