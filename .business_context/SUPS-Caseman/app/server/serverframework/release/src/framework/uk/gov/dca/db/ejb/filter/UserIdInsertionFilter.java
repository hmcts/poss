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
import org.jdom.output.XMLOutputter;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class UserIdInsertionFilter extends DecoratingFilter {

	/**
	 * Default Constructor
	 */
	public UserIdInsertionFilter() {
		super();
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.ejb.Filter#apply(java.lang.String, java.lang.String)
	 */
	public Document execute(String userId, Document message) throws BusinessException, SystemException {
	    Element root = message.getRootElement();

	    if(!root.getName().equals("params")) {
	    	throw new BusinessException("'" + root.getName() + "' found as root node when 'params' expected");
	    }
	    
	    // construct a new param element for the user id
	    Element param = new Element("param");
	    param.setAttribute("name", userIdName);
	    param.setText(userId);
	    
	    if(log.isDebugEnabled()) {
	    	log.debug("execute(): new element =" + outputter.outputString(param));
	    }
	    	
	    // add the new element to the message
	    root.addContent(param);
	    	    
	    if(log.isDebugEnabled()) {
	    	log.debug("execute(): result = " + outputter.outputString(message));
	    }
	    
		return message;
	}
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.ejb.Filter#initialise(org.jdom.Element)
	 */
	protected void init(Element config) throws SystemException {
		userIdName = config.getChildTextNormalize(USER_ID_NAME_ELEMENT_NAME);
	}
	
	protected Log getLog() {
		return log;
	}
	
	private static final String USER_ID_NAME_ELEMENT_NAME = "userIdName";
	private static final Log log = SUPSLogFactory.getLogger(UserIdInsertionFilter.class);
	
	private String userIdName = null;
	private XMLOutputter outputter = new XMLOutputter();
}
