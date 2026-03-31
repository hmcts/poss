/*
 * Created on 07-Dec-2004
 *
 */
package uk.gov.dca.db.pipeline;

import uk.gov.dca.db.exception.SystemException;

/**
 * An interface which makes it possible to provide read only access to a query's runtime
 * context variable values.
 * 
 * @author GrantM
 */
public interface IQueryContextReader {
	public Object getValue(String variable) throws SystemException;
}
