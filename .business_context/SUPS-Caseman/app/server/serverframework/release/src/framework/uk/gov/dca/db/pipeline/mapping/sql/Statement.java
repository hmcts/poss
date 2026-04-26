/*
 * Created on 23-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.sql;

import java.util.Collection;
import java.util.Map;

import uk.gov.dca.db.exception.SystemException;

public interface Statement {
    
    /**
     * Gets the SQL String to be executed.
     * 
     * @param inputXML The input document.
     * @param context The current context.
     * @return
     * @throws SystemException 
     */
    public String getSQL();
        
    /**
     * Returns a list of variables that need to fetched from
     * the context variables for use as parameters for where
     * clause of the query.
     * 
     * @return An ordered list of variable names
     */
    public Collection getDependentVariables();
    
    /**
     * Aliases the names of columns.
     * 
     * @return
     */
    public Map getColumnAliases();
    
}
