/*
 * Created on 13-Aug-2004
 *
 */
package uk.gov.dca.db.ejb;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.component_input.ComponentInput;

/**
 * @author Grant Miller
 *
 */
public class SupsLocalServiceProxy2
{
    private final static Class[] LOCAL_SERVICE_PARAM_TYPES = { ComponentInput.class, ComponentInput.class };
   
	public void invoke(String jndiName, String methodName, IComponentContext context, 
			ComponentInput inputHolder, ComponentInput outputHolder)
		throws SystemException, BusinessException
	{		
		if ( jndiName == null || jndiName.length() == 0) {
			throw new SystemException("No JNDI name provided for local service call");
		}
		if ( methodName == null || methodName.length() == 0) {
			throw new SystemException("No method name provided for local service call");
		}
		if ( context == null ) {
			throw new SystemException("No component context provided for local service call");
		}
		if ( inputHolder == null ) {
			throw new SystemException("No input source provided for local service call");
		}
		if ( outputHolder == null ) {
			throw new SystemException("No output destination provided for local service call");
		}
		
		Object[] params = new Object[] { inputHolder, outputHolder };
		EJBServiceProxy.invokeLocal(jndiName, methodName, LOCAL_SERVICE_PARAM_TYPES, params);
	}

}
