/*
 * Created on 22-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping;

import java.util.List;
import java.util.Map;
import java.util.Set;

import uk.gov.dca.db.pipeline.mapping.select.Select;

/**
 * Public interface to the Pivot node.
 * 
 * @author Michael Barker
 *
 */
public interface Pivot {

    /**
     * Gets the name of the pivot node.  This will be a simple xpath
     * to its position within the DOM.
     * 
     * @return
     */
    String getName();

    /**
     * Get the select portion of this pivot node.
     * 
     * @param method The name of the relavant method.
     * @return
     */
    Select getSelect(String method);

    /**
     * Get the tables specified for this pivot node.
     * 
     * @param method
     * @return
     */
    Map getTables(String method);

    Map getAllTables();

    Set getAliases();

    Set getVariables(String method);
    
    boolean addVariable(String method, String variable);

    List getConstraints(String method);

    void addExtension(String method, PivotData data);

    Map getParameters(String name);
    
    boolean hasParameter(String method, String parameter);
    
    boolean isModifiable();
    
    void addConstraints(String method, List constraints);
    
    PivotConfig getConfig(String method);
}