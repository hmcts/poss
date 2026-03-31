package uk.gov.dca.db.invoke.server.handlers;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.invoke.server.service.request.RequestContext;


/**
 * @author Imran Patel
 *
 */
public interface IRequestHandler {
	
	public boolean handleRequest(RequestContext ctx) throws SystemException, BusinessException;
}
