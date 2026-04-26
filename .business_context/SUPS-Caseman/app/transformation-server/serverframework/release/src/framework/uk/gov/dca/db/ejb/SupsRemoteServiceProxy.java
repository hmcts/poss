/*
 * Created on 13-Aug-2004
 *
 */
package uk.gov.dca.db.ejb;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * @author Grant Miller
 *
 */
public class SupsRemoteServiceProxy extends AbstractSupsServiceProxy {

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.ejb.AbstractSupsServiceProxy#invoke(java.lang.String, java.lang.String, java.lang.String)
	 */
	protected final String invoke(String jndiName, String methodName, String xmlParams)
		throws SystemException, BusinessException
	{		
		// TODO - update to propagate user and mac in first 2 params. May mean not being able to use
		// AbstractSupsServiceProxy.
		Object[] params = new Object[] { "", "", xmlParams };
		String s = (String) EJBServiceProxy.invoke(jndiName, methodName, REMOTE_SERVICE_PARAM_TYPES, params);
		
		return s;
	}

}
