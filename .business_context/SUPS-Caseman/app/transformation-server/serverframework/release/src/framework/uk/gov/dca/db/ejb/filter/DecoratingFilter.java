/*
 * Created on 06-Dec-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.ejb.filter;

import org.jdom.Element;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

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
		init(config);
		
		Element filterElement = (Element) config.getChild("Filter");
		if(filterElement != null) {
			String filterName = filterElement.getAttributeValue("class");
			Class filterClass = null;
			try {
				filterClass = Class.forName(filterName);
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
	public String apply(String userId, String message) throws BusinessException, SystemException {
		String result = execute(userId, message);
		
		if(decoratedFilter != null) {
			 result = decoratedFilter.apply(userId, result);
		}
		
		return result;
	}
	
	protected abstract void init(Element config) throws SystemException;

	protected abstract String execute(String userId, String message) throws BusinessException, SystemException;
	
	private Filter decoratedFilter = null;
}
