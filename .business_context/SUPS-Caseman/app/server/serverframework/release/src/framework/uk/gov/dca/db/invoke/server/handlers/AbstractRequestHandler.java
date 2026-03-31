package uk.gov.dca.db.invoke.server.handlers;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.invoke.server.service.request.RequestContext;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * @author Imran Patel
 *
 */
public abstract class AbstractRequestHandler implements IRequestHandler {
	private Log log = SUPSLogFactory.getLogger(AbstractRequestHandler.class);
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.invoke.server.handlers.RequestHandler#handle(uk.gov.dca.db.invoke.server.service.request.RequestContext, javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
	 */
	public boolean handleRequest(RequestContext ctx) 
		throws SystemException, BusinessException 
	{	
		boolean satisfiedRequest = false;
		
		long startTime = 0;
		if (log.isDebugEnabled() ) {
			startTime = System.currentTimeMillis();
		}
		
		decorateRequest(ctx);
		
		satisfiedRequest = handle(ctx);
		if (log.isDebugEnabled() ) {
			log.debug(ctx.threadName + ", "+ctx.targetMethod+", "+this.getClass().getName()+": Satisfied request="+satisfiedRequest);
		}
	
		if ( !satisfiedRequest )
		{
			if (log.isDebugEnabled() ) {
				log.debug(ctx.threadName + ", "+ctx.targetMethod+", "+this.getClass().getName()+": Getting next handler...");
			}
			
			IRequestHandler nextHandler = ctx.getNextHandler();
			
			if(nextHandler != null)	{
				if (log.isDebugEnabled() ) {
					log.debug(ctx.threadName + ", "+ctx.targetMethod+", "+this.getClass().getName()+": Got next handler");
				}
				
				satisfiedRequest = nextHandler.handleRequest(ctx);
				
				if (log.isDebugEnabled() ) {
					log.debug(ctx.threadName + ", "+ctx.targetMethod+", "+this.getClass().getName()+": Next handler satisfied request="+satisfiedRequest); 
				}
			}
			else if (log.isDebugEnabled() ) 
			{
				log.debug(ctx.threadName + ", "+ctx.targetMethod+", "+this.getClass().getName()+": No next handler");
			}
		}
		
		decorateResponse(ctx, satisfiedRequest);
		
		if (log.isDebugEnabled() ) {
			long timeElapsed = System.currentTimeMillis() - startTime;
			log.debug(ctx.threadName + ", "+ctx.targetMethod+", "+this.getClass().getName()+".processRequest took " + timeElapsed + " milli secs");
		}
		
		return satisfiedRequest;
	}
	
	public abstract void decorateRequest(RequestContext ctx) throws SystemException, BusinessException;

	public abstract void decorateResponse(RequestContext ctx, boolean satisfiedRequest) throws SystemException, BusinessException;
	
	public abstract boolean handle(RequestContext ctx) throws SystemException, BusinessException;
	
}
