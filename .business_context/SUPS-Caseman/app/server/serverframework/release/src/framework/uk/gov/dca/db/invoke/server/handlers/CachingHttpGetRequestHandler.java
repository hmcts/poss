package uk.gov.dca.db.invoke.server.handlers;

import java.util.Date;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.invoke.server.service.request.RequestContext;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * @author Imran Patel
 */
public class CachingHttpGetRequestHandler extends DefaultHttpGetRequestHandler {

	private static final Log log = SUPSLogFactory.getLogger(CachingHttpGetRequestHandler.class);
	
	private final long SECONDS_IN_DAY = 86400;
	private final long SECONDS_IN_HOUR = 3600;
	private final long SECONDS_IN_MIN = 60;

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.invoke.server.handlers.RequestHandler#decorateResponse()
	 */
	public void decorateResponse(RequestContext ctx, boolean satisfiedRequest) {
		
		long currentTime = new Date().getTime();
		long age = 0;
		String expires = ctx.getMethodConfig().getExpiresTime();
		
		if(expires == null || expires.equals("") || satisfiedRequest == false){
			ctx.getResponse().setHeader("Cache-Control", "no-store");
			return;
		}
		
		if(expires.equalsIgnoreCase("endOfDay")){
			Date date = new Date();
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setDate(date.getDate()+1);
			String dateString = date.toGMTString(); 
			
			String day = null;
			
			switch (date.getDay()){
				
				case 0 : day = "Sun, "; break;
				case 1 : day = "Mon, "; break;
				case 2 : day = "Tue, "; break;
				case 3 : day = "Wed, "; break;
				case 4 : day = "Thu, "; break;
				case 5 : day = "Fri, "; break;
				case 6 : day = "Sat, "; break;
			}
			
			dateString = day+dateString;
			ctx.getResponse().setHeader("Expires", dateString);
			log.debug("HTTP Get Response has been set with the following header :  Expires: "+dateString);
			return;
		}
		
		if(expires.endsWith("d")) {
			age = Long.parseLong(expires.substring(0, expires.length()-1));
			age = age*SECONDS_IN_DAY;
		}
		else if(expires.endsWith("h")) {
			age = Long.parseLong(expires.substring(0, expires.length()-1));
			age = age*SECONDS_IN_HOUR;
		}
		else if(expires.endsWith("m")) {
			age = Long.parseLong(expires.substring(0, expires.length()-1));
			age = age*SECONDS_IN_MIN;
		}
		else if(expires.endsWith("s")) {
			age = Long.parseLong(expires.substring(0, expires.length()-1));
		}
		
		ctx.getResponse().setHeader("Cache-Control", "max-age="+age);
		ctx.getResponse().setDateHeader("Last-Modified", currentTime);
		log.debug("HTTP Get Response has been set with the following header :  Cache-Control: max-age="+age);
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.invoke.server.handlers.RequestHandler#decorateRequest()
	 */
	public void decorateRequest(RequestContext ctx) {
		// TODO Auto-generated method stub
		
	}
}
