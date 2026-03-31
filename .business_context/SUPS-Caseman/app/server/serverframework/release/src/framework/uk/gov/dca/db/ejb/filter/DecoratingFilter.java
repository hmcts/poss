/*
 * Created on 06-Dec-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.ejb.filter;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.ClassUtil;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public abstract class DecoratingFilter implements Filter {

	/**
	 * Default constructor
	 */
	public DecoratingFilter() {
		super();
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.ejb.Filter#initialise(org.jdom.Element)
	 */
	public void initialise(Element config) throws SystemException {
		Log log = getLog();
		
		init(config);
		
		log.debug("initialise(): looking for nested filters...");
		Element filterElement = (Element) config.getChild("filter");
		if(filterElement != null) {
			String filterName = filterElement.getAttributeValue("class");
			log.debug("initialise(): found nested filter - " + filterName);
			Class filterClass = null;
			try {
				filterClass = ClassUtil.loadClass(filterName);
			}
			catch(ClassNotFoundException e) {
				throw new FiltrationException("Could not find filter class '"+filterClass+"': "+e.getMessage(), e);
			}
			
			if(filterClass == null) {
				throw new FiltrationException("Could not find filter class " + filterName);
			}
				
			try {
				decoratedFilter = (Filter) filterClass.newInstance();
			}	
			catch(InstantiationException e) {
				throw new FiltrationException("Could not instantiate filter '"+filterClass+"': "+e.getMessage(), e);
			}
			catch(IllegalAccessException e) {
				throw new FiltrationException("Could not access filter '"+filterClass+"': "+e.getMessage(), e);
			}
			
			decoratedFilter.initialise(filterElement);
		}
	}
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.ejb.Filter#apply(java.lang.String, java.lang.String)
	 */
	public Document apply(String userId, Document message) throws BusinessException, SystemException {
		Document result = execute(userId, message);
		
		if(decoratedFilter != null) {
			getLog().debug("apply(): applying next filter in chain");
			result = decoratedFilter.apply(userId, result);
		}
		
		return result;
	}
	
	protected abstract void init(Element config) throws SystemException;

	protected abstract Document execute(String userId, Document message) throws BusinessException, SystemException;
	
	protected abstract Log getLog();
	
	private Filter decoratedFilter = null;
}
