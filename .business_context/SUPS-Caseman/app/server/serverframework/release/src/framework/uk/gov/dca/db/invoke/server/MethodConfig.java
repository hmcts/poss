package uk.gov.dca.db.invoke.server;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.jdom.Element;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.invoke.server.handlers.CachingHttpGetRequestHandler;
import uk.gov.dca.db.invoke.server.handlers.EJBHttpRequestHandler;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * @author Imran Patel
 *
 */
public class MethodConfig {

	private static Log log = SUPSLogFactory.getLogger(MethodConfig.class);
	
	private String name;
	private String parentService;
	private String serviceMethodName;
	private String getExpiresTime;
	private List getHandlerList = null;
	private List postHandlerList = null;

	private final static String HTTP_GET_CACHE_ELEMENT = "HTTPCache";
	private final static String HTTP_GET_ELEMENT = "get";
	
	/**
	 * @param element
	 * @throws SystemException
	 */
	public MethodConfig(String parentService, Map requestHandlersPool, Element element) throws SystemException {
		name = element.getAttributeValue("name");
		
		log.debug("METHOD CFG FOR:"+name);
		this.parentService = parentService;
		getHandlerList = extractGetConfig(element, requestHandlersPool);
		//postHandlerList = extractPostConfig(element);
		
	}
	
	public String getExpiresTime(){
		return getExpiresTime;
	}
	
	public List getHandlerList() {
		return getHandlerList;
	}
	
	public List postHandlerList() {
		return postHandlerList;
	}
	
	/**
	 * @return
	 */
	public String getName() {
		return name;
	}
	
	public String getParentService(){
		return parentService;
	}
	
	public String getServiceMethodName(){
		
		if(serviceMethodName == null){
			serviceMethodName = parentService+"."+name;
		}
		
		return serviceMethodName;
	}
	
	private List extractGetConfig(Element element, Map requestHandlersPool) throws SystemException{
		
		List handlerList = null;
		
		if(element != null){
			Element handlerTypeEl = element.getChild(HTTP_GET_ELEMENT);
			if(handlerTypeEl != null){
				Element httpCacheEl = handlerTypeEl.getChild(HTTP_GET_CACHE_ELEMENT);
				if(httpCacheEl != null){
					handlerList = new ArrayList();
					handlerList.add( requestHandlersPool.get(CachingHttpGetRequestHandler.class.getName()) );
					handlerList.add( requestHandlersPool.get(EJBHttpRequestHandler.class.getName()) );
					
					getExpiresTime = httpCacheEl.getAttributeValue("expires");
				}
			}
		}
		
		return handlerList;
	}
}
