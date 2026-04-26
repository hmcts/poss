/*
 * Created on 01-Dec-2004
 *
 */
package uk.gov.dca.db.pipeline;

import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;
import uk.gov.dca.db.exception.*;

/**
 * A condition which evaluates the input XML against an xpath clause. 
 * 
 * @author GrantM
 *
 */
public class XPathCondition implements ICondition {

	String m_clause = null;
	
	/**
	 * Default constructor
	 */
	public XPathCondition() {
		super();
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.ICondition#initialise(java.lang.String, jdom.org.Element)
	 */
	public void initialise(String clause, Element conditionConfig) throws SystemException {
		if (clause == null || clause.length() == 0) {
			throw new ConfigurationException("No clause provided for XPath condition");
		}
		m_clause = clause;
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.ICondition#evaluate(org.jdom.Document)
	 */
	public boolean evaluate(Element inputXML) throws BusinessException, SystemException {
		boolean result = true;
		
		try {
			Object xpathResult = XPath.selectSingleNode(inputXML, m_clause);

			// There are 2 ways to evaluate an xpath condition:
			// - the first is to test for boolean 'true' (e.g. count > 0)
			// - if not boolean, test for non-null
			if ( xpathResult != null ) {
				if ( xpathResult instanceof Boolean && ((Boolean)xpathResult).booleanValue() == false) {
					result = false;
				}
			}
			else
				result = false;	
		}
		catch( JDOMException e) {
			result = false;
		}	
		
		return result;
	}
	
	/**
	 * Returns a copy of the condition
	 */
	public Object clone() {
		XPathCondition clone = new XPathCondition();
		clone.m_clause = this.m_clause;
		return clone;
	}

}
