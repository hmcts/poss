/*
 * Created on 01-Dec-2004
 *
 */
package uk.gov.dca.db.pipeline;

import org.jdom.Document;
import org.jdom.Element;
import uk.gov.dca.db.exception.*;

/**
 * Interface for dynamically generating SQL
 * @author GrantM
 */
public interface ISQLGenerator {

	/**
	 * Initialises and prepares the generator for being able to perform evaluation.
	 * It is expected that this will usually do nothing.
	 * Called once, when the object is instantiated.
	 * @param generateConfig - the XML config element with which the generator is associated.
	 *        It makes it possible to provide generator implementation specific config.         
	 * @throws SystemException
	 */
	public void initialise(Element generateConfig) throws SystemException;
	
	/**
	 * Creates the dynamically generated SQL. It is expected that the SQL will be different
	 * per request.
	 * Called per request.
	 * @param inputXML
	 * @param contextVariables - gives access to method parameters and field values 
	 *                already retrieved by parent queries.
	 * @return
	 * @throws BusinessException  
	 * @throws SystemException
	 */
	public String generate(Document inputXML, IQueryContextReader context ) throws BusinessException, SystemException;
	
	/**
	 * Returns a copy of the generator
	 */
	public Object clone();
}