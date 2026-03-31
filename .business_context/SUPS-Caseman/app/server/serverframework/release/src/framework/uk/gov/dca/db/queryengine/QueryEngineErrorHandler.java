/*
 * Created on 22-Sep-2004
 *
 */
package uk.gov.dca.db.queryengine;

import uk.gov.dca.db.exception.ConfigurationException;

/**
 * @author Grant Miller
 *
 * Interface for raising query engine errors. Subclasses decide how to handle errors.
 * For example, log the error, throw an exception etc.
 */
public interface QueryEngineErrorHandler {
	public boolean errorOccurred();	
	public void raiseMessage(String sMsg) throws QueryEngineException;
	public void raiseWarning(String sMsg) throws QueryEngineException;
	public void raiseError(String sMsg) throws QueryEngineException, ConfigurationException;
	public void raiseCriticalError(String sMsg) throws QueryEngineException, ConfigurationException;
}
