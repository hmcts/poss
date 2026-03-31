package uk.gov.dca.db.invoke.server.handlers;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.invoke.server.service.request.RequestContext;

/**
 * @author Imran Patel
 *
 */
public class DefaultHttpPostRequestHandler extends HttpRequestHandler {
	/**
     * Note on Content-Length
     * The request body Content-Length header reflects the length of the incoming  
     * data from the client and not the byte count of the decompressed data stream.
	 */
	protected void extractRequest(RequestContext ctx) throws SystemException{
        ctx.user = ctx.getRequest().getHeader(SUPS_USER);
        ctx.mac = ctx.getRequest().getHeader(SUPS_MAC);
        ctx.serviceName = ctx.getRequest().getHeader(SUPS_SERVICE);
        ctx.targetMethod = ctx.getRequest().getHeader(SUPS_METHOD);
        ctx.password = ctx.getRequest().getHeader(SUPS_PASSWORD);
        ctx.isSecure = ctx.getRequest().isSecure();
		
        
        try {
            final InputStream is = ctx.getRequest().getInputStream();
            final int bufSize = (int)Math.round(ctx.getRequest().getContentLength()*1.5);
            
            if (bufSize>0)
            {
	            final StringBuffer requestContent = new StringBuffer(bufSize);
	            
	            // prepare to read the content from the client as UTF-8
	            final Reader reader = new InputStreamReader(is,"UTF-8");
	            
	            // read all the content into the buffer and append this to the content
                // see the comment above for why we read the buffer like this.
	            char[] buf = new char[1024];
	            int numRead = 0;
	            while((numRead = reader.read(buf)) != -1)
	            {
	                requestContent.append(buf, 0, numRead);
	            }
	            
	            // save the payload content
	            ctx.requestPayload = requestContent.toString();
            }
            else
            {
            	ctx.requestPayload = "";
            }
            
        }
        catch(IOException e)
		{
        	throw new SystemException("Failed to read HTTP Request body ", e);
		}
        
        
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
