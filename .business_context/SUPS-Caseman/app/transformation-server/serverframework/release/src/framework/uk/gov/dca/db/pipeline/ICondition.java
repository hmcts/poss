/*
 * Created on 01-Dec-2004
 *
 */
package uk.gov.dca.db.pipeline;

import org.jdom.Element;
import uk.gov.dca.db.exception.*;

/**
 * Interface for a generalised, reusable boolean condition
 * @author GrantM
 */
public interface ICondition {

	/**
	 * Initialises and prepares the condition for being able to perform evaluation.
	 * @param clause - the condition clause [the minimum config required]
	 * @param conditionConfig - the XML element with which the condition is associated.
	 *        It makes it possible to provide condition implementation specific config.       
	 * @throws SystemException
	 */
	public void initialise(String clause, Element conditionConfig) throws SystemException;
	
	/**
	 * Evaluates the clause against the input XML.
	 * @param inputXML
	 * @return
	 * @throws BusinessException 
	 * @throws SystemException
	 */
	public boolean evaluate(Element inputXML) throws BusinessException, SystemException;
	
	/**
	 * Returns a copy of the condition
	 */
	public Object clone();
}