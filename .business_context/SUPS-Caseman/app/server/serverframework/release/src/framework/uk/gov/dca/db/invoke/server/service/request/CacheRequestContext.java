package uk.gov.dca.db.invoke.server.service.request;



/**
 * @author Imran Patel
 *
 */
public class CacheRequestContext extends RequestContext{
	
	public CacheRequestContext(){
	}
	
	public CacheRequestContext(String serviceName, String targetMethod)
	{
		this.serviceName = serviceName;
		this.targetMethod = targetMethod;
	}

}
