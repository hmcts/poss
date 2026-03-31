package uk.gov.dca.db.invoke.server.service.request;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.invoke.server.MethodConfig;
import uk.gov.dca.db.invoke.server.handlers.CachingHttpGetRequestHandler;
import uk.gov.dca.db.invoke.server.handlers.ContentHandler;
import uk.gov.dca.db.invoke.server.handlers.DefaultHttpGetRequestHandler;
import uk.gov.dca.db.invoke.server.handlers.DefaultHttpPostRequestHandler;
import uk.gov.dca.db.invoke.server.handlers.EJBHttpRequestHandler;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * NOTE: This has been written assuming 1 servlet instance per app server.
 * it will also work provided that each servlet instance serves the same application
 * and each application instance has the same caching configuration.
 * It is assumed that each application is implemented as a single SUPS server framework
 * project consisting of multiple services (i.e. EJBs). In other words, it will not work if
 * for example, CREST was to use 2 server framework projects.
 * 
 * @author Imran Patel
 *
 */
public class RequestServiceDelegate {
	
	protected static HashMap serviceMethodConfig = new HashMap();
	public static final String SUPS_EXCEPTION = "SUPS-Exception";
	private static Log log = SUPSLogFactory.getLogger(RequestServiceDelegate.class);
	private static final Map m_requestHandlersPool;
	private static final List m_defaultGetHandlers;
	private static final List m_defaultPostHandlers;
	
	// static block for initialisation. 
	// The instances of each request handler type are shared by all threads. Create in advance
	// to avoid runtime overhead.
	static 
	{
		m_requestHandlersPool = new HashMap();
		m_requestHandlersPool.put( CachingHttpGetRequestHandler.class.getName(), new CachingHttpGetRequestHandler() );
		m_requestHandlersPool.put( EJBHttpRequestHandler.class.getName(), new EJBHttpRequestHandler() );
		m_requestHandlersPool.put( DefaultHttpPostRequestHandler.class.getName(), new DefaultHttpPostRequestHandler() );
		m_requestHandlersPool.put( DefaultHttpGetRequestHandler.class.getName(), new DefaultHttpGetRequestHandler() );
        m_requestHandlersPool.put( ContentHandler.class.getName(), new ContentHandler() );
		
		m_defaultGetHandlers = new ArrayList();
		m_defaultGetHandlers.add( m_requestHandlersPool.get(DefaultHttpGetRequestHandler.class.getName()) );
		m_defaultGetHandlers.add( m_requestHandlersPool.get(EJBHttpRequestHandler.class.getName()) );
		
		m_defaultPostHandlers = new ArrayList();
		m_defaultPostHandlers.add( m_requestHandlersPool.get(DefaultHttpPostRequestHandler.class.getName()) );
		m_defaultPostHandlers.add( m_requestHandlersPool.get(EJBHttpRequestHandler.class.getName()) );
	}
	
    public static void loadServiceConfig(String location){

    	File [] configFiles = null;
    	SAXBuilder builder = null;
    	
    	if ( log.isDebugEnabled() ) {
    		log.debug("SERVLET CONFIG="+location);
    	}
    	
    	try{
	    	builder = new SAXBuilder();
	    	configFiles = new File(location).listFiles();
    	} catch (Exception e) {
			log.error("Failed to read service configuration files from location specified in web.xml.  Location specified is: "+location);
			e.printStackTrace();
		}
    	
    	if(configFiles != null)
    	{
    	    for (int i=0; i < configFiles.length; i++)
    	    {
    	    	try
				{
    	    		if(configFiles[i].isFile() && configFiles[i].getName().endsWith(".xml")){
    	    			if ( log.isDebugEnabled() ) {
    	    				log.debug("Loading service config file : "+configFiles[i].getAbsolutePath());
    	    			}
    		    		
    		    		Document doc = builder.build(new FileInputStream(configFiles[i]));
    		    		Element root = doc.getRootElement();
    		    		String serviceName = ((Attribute)XPath.selectSingleNode(root, "/service-config/service/@name")).getValue();
    		    		List methods = XPath.selectNodes(root, "/service-config/method");
    		    			
    		    		Iterator methodsItr = methods.iterator();
    		    		while(methodsItr.hasNext()){
    		    			MethodConfig methodConfig = new MethodConfig(serviceName, m_requestHandlersPool, (Element) methodsItr.next());
    		    			serviceMethodConfig.put(methodConfig.getServiceMethodName(),methodConfig);
    		    		}	
    		    		
    		    		if ( log.isDebugEnabled() ) {
    		    			log.debug("Processed service config file : "+configFiles[i].getAbsolutePath());
    		    		}
    	    		}
    	    	} 
    	    	catch (Exception e) {
    				log.error("Failed to read service configuration file '"+configFiles[i]+"':"+e.getMessage(),e);
    				e.printStackTrace();
    			}
    	    }
    	}
    }

    public static void handleRequest(HttpServletRequest request, HttpServletResponse response) throws SystemException, BusinessException{
    	RequestContext ctx = new RequestContext(m_defaultGetHandlers, m_defaultPostHandlers, request, response);
	    ctx.handle();
    }
}
