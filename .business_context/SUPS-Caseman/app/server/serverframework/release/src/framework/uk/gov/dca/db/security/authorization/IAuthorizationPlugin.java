package uk.gov.dca.db.security.authorization;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;



/**
 * @author Imran Patel
 *
 */
public interface IAuthorizationPlugin {

	public boolean authorize(IComponentContext context, String methodSecurityProperties) throws SystemException, BusinessException;

}
