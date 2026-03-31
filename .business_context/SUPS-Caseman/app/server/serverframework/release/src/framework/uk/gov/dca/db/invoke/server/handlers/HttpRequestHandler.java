package uk.gov.dca.db.invoke.server.handlers;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.invoke.server.service.request.RequestContext;
import uk.gov.dca.db.util.SUPSLogFactory;


/**
 * @author Imran Patel
 *
 */
public abstract class HttpRequestHandler extends AbstractRequestHandler {
	
    private Log log = SUPSLogFactory.getLogger(HttpRequestHandler.class);
	public static final String SUPS_USER = "SUPS-User";
	public static final String SUPS_MAC = "SUPS-Mac";
	public static final String SUPS_SERVICE = "SUPS-Service";
	public static final String SUPS_METHOD = "SUPS-Method";
	public static final String SUPS_PASSWORD = "SUPS-Password";
	public static final String HTTP_GET = "GET";
	
    public boolean handle(RequestContext ctx) throws SystemException
    {
        extractRequest(ctx);

        logIncomingMessage(ctx);
        
        // HTTP handlers never staisfy the request
        return false;
    }

	private void logIncomingMessage(RequestContext ctx) {
        if(log.isInfoEnabled()){
	        log.info("Received Header: SUPS-User: " + ctx.user +
	                "; SUPS-Mac: " + ctx.mac +
	                "; SUPS-Service: " + ctx.serviceName +
	                "; SUPS-Method: " + ctx.targetMethod +
	                "; requestPayload: " + ctx.requestPayload);
        }
    }

    protected abstract void extractRequest(RequestContext ctx) throws SystemException;

}
