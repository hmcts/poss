/*
 * Created on 09-Jun-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.security.authorization;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * @author Imran Patel
 *
 */
public class StubbedFullyAuthorisedAuthorizationPlugin implements IAuthorizationPlugin {

    Log log = SUPSLogFactory.getLogger(StubbedFullyAuthorisedAuthorizationPlugin.class);
    
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.security.authorization.IAuthorizationPlugin#authorize(uk.gov.dca.db.pipeline.IComponentContext, java.lang.String)
	 */
	public boolean authorize(IComponentContext context, String methodSecurityProperties) throws SystemException, BusinessException {
		return true;
	}
}
