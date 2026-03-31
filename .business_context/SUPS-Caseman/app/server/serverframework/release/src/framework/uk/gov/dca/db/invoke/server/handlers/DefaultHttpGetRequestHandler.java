package uk.gov.dca.db.invoke.server.handlers;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.invoke.server.service.request.RequestContext;

/**
 * @author Imran Patel
 *
 */
public class DefaultHttpGetRequestHandler extends HttpRequestHandler {
	
	private static final String SUPS_PARAMS = "PARAMS";
	
	protected void extractRequest(RequestContext ctx) throws SystemException{

        ctx.isSecure = ctx.getRequest().isSecure();
        
        // Parameters form part of the url and will determine if the
        // request will be cached or not
        ctx.serviceName = ctx.getRequest().getParameter(SUPS_SERVICE); 
        ctx.targetMethod = ctx.getRequest().getParameter(SUPS_METHOD); 
		ctx.requestPayload = ctx.getRequest().getParameter(SUPS_PARAMS);
        
        // Headers do not form part of the url
        ctx.user = ctx.getRequest().getHeader(SUPS_USER); 
        ctx.mac = ctx.getRequest().getHeader(SUPS_MAC); 
        ctx.password = ctx.getRequest().getHeader(SUPS_PASSWORD);
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.invoke.server.handlers.RequestHandler#decorateResponse()
	 */
	public void decorateResponse(RequestContext ctx, boolean satisfiedRequest) throws SystemException, BusinessException{
		// TODO Auto-generated method stub
		
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.invoke.server.handlers.RequestHandler#decorateRequest()
	 */
	public void decorateRequest(RequestContext ctx) throws SystemException, BusinessException{
		// TODO Auto-generated method stub
		
	}
}
