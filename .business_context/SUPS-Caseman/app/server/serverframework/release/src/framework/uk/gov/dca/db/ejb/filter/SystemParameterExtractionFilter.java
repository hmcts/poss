/*
 * Created on 07-Jun-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.ejb.filter;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.CallStack;
import uk.gov.dca.db.pipeline.ComponentContext;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class SystemParameterExtractionFilter extends DecoratingFilter{

	/**
	 * Default Constructor
	 */
	public SystemParameterExtractionFilter() {
		super();
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.ejb.filter.DecoratingFilter#init(org.jdom.Element)
	 */
	protected void init(Element config) throws SystemException {

		log.debug("init(): Initialising...");
		
		Element element = config.getChild(ELEMENT_NAME);
		if(element == null) {
			throw new SystemException(ELEMENT_NAME + " element expected within filter definition in sups_config.xml");
		}
		
		paramName = element.getAttributeValue(PARAM_NAME_ATTRIBUTE_NAME);
		paramXPath = element.getAttributeValue(PARAM_XPATH_ATTRIBUTE_NAME);
		log.debug("init(): found param " + paramName + " (" + paramXPath + ")");
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.ejb.filter.DecoratingFilter#execute(java.lang.String, org.jdom.Document)
	 */
	protected Document execute(String userId, Document message) throws BusinessException, SystemException {
	
		try {
			Element root = message.getRootElement();
			
			if(!root.getName().equals("params")) {
				throw new SystemException("'" + root.getName() + "' found as root node when 'params' expected");
			}
			
			ComponentContext context = CallStack.getInstance().peek();

			log.debug("execute(): retrieving " + paramName + " (" + paramXPath + ")");
			
			Element paramElement = (Element) XPath.selectSingleNode(root, paramXPath);
			if(paramElement != null) {
				String paramValue = paramElement.getTextNormalize();
			
				// if the parameter is included in the incomming message but there is no value specified then 
				// DO NOT add the item to the context
				if(paramValue != null && paramValue.length() > 0) {
					if(log.isDebugEnabled()) {
						log.debug("execute(): adding " + paramName + " [" + paramValue + "] to context");
					}
				
					context.putSystemItem(paramName, paramValue);
				}
			}
			else {
				log.warn("execute(): " + paramName + " not found");
			}
		} 
		catch (JDOMException e) {
			throw new SystemException("Could not find specified param in message: " + paramXPath, e);
		}
		
		return message;
	}
	
	protected Log getLog() {
		return log;
	}
	
	private static final String ELEMENT_NAME = "systemParam";
	private static final String PARAM_NAME_ATTRIBUTE_NAME = "name";
	private static final String PARAM_XPATH_ATTRIBUTE_NAME = "xpath";
	
	private static final Log log = SUPSLogFactory.getLogger(SystemParameterExtractionFilter.class);
	
	private String paramXPath = null;
	private String paramName = null;
}
