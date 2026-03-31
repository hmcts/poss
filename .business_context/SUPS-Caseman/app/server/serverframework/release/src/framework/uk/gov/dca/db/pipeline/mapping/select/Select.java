/*
 * Created on 10-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.select;

import java.util.Collection;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.mapping.executor.Executor;

/**
 * Interface representing a select portion of a Query node.
 * 
 * @author Michael Barker
 *
 */
public interface Select {

    /**
     * Gets all of the variables that need to be select to support this node.
     * 
     * @return
     */
    public Collection getDependentVariables(String method);
    
    /**
     * Creates an executor used to query information from the database 
     * all state, e.g. cursors, keyed values etc. are held in the executor.
     * 
     * @return methodName The name of the method to create an executor for.
     */
    public Executor createExecutor(String methodName) throws SystemException;

    /**
     * Preprocess this node.  Notification to pre-generate any possible SQL, etc.
     * 
     * @param method
     * @throws SystemException
     * @throws BusinessException 
     */
    public void preprocess(String method) throws SystemException, BusinessException;
    
    public String getName();
}
