/*
 * Created on 18-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.executor;

import java.sql.Connection;

import org.jdom.Document;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.mapping.output.Context;

/**
 * Public interface to the execution of SQL by a select statement.  Different select nodes will have
 * differing implementations of this executor service.  Linked Joins will load the data set entirely
 * where as standard joins will hold open a cursor.
 * 
 * @author Michael Barker
 *
 */
public interface Executor {

    public void open(Connection cn, Document inputXML, Context context) throws SystemException, BusinessException;
    
    /**
     * Imitates JDBC stlye cursor behaviour.
     * @return
     * @throws SystemException 
     */
    public boolean next() throws SystemException;
    
    /**
     * Close all open resources held onto by this executor.
     *
     */
    public void close();
    
    /**
     * Loads the current row into the context.
     * 
     * @param context
     * @throws SystemException 
     */
    public void load(Context context) throws SystemException;
    
    public boolean isCacheable();
    
    /**
     * If this executor is a place holder for a sub node, then this method will
     * return the name of the pivot node into which the sub-query was absorbed.
     * All other executors should return null.
     * 
     * @return
     */
    public String getLinkedParent();
    
    /**
     * Gets a delegate executor.  This we return an executor for a sub-query that
     * has been abosrbed into the creating select.
     * 
     * @param name
     * @return
     * @throws SystemException 
     */
    public Executor getDelegateExecutor(String name) throws SystemException;
}
