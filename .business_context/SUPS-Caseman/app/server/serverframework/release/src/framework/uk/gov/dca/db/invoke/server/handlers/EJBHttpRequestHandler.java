package uk.gov.dca.db.invoke.server.handlers;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.invoke.server.service.EJBServiceDelegate;
import uk.gov.dca.db.invoke.server.service.request.RequestContext;

/**
 * @author Imran Patel
 *
 */
public class EJBHttpRequestHandler extends AbstractRequestHandler {
	
    private boolean isLocal;

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.invoke.server.handlers.RequestHandler#handleRequest(uk.gov.dca.db.invoke.server.RequestContext, javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	public boolean handle(RequestContext ctx) throws SystemException, BusinessException
	{
		String serviceResult = null;
        if(isLocal){
        	serviceResult = EJBServiceDelegate.processRequestLocal(ctx);
        }
        else {
        	serviceResult = EJBServiceDelegate.processRequestRemote(ctx);
        }

        if(serviceResult != null)
        {
            ctx.setContentLength(serviceResult.length());
            ctx.setResponseMimeType("text/xml");
            ctx.writeOutput(serviceResult);
        }
        
        //if we have reached here with no exceptions then the request has been satisfied
        return true;
	}

	    
    public void setIsLocal(boolean isLocal){
    	this.isLocal = isLocal;
    }
    
    public boolean isLocal(){
    	return isLocal;
    }

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.invoke.server.handlers.RequestHandler#decorateResponse()
	 */
	public void decorateResponse(RequestContext ctx, boolean satisfiedRequest) {
		// TODO Auto-generated method stub
		
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.invoke.server.handlers.RequestHandler#decorateRequest()
	 */
	public void decorateRequest(RequestContext ctx) {
		// TODO Auto-generated method stub
		
	}
}
