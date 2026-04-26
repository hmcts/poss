/*
 * Created on 10-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.select;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.pipeline.Query;
import uk.gov.dca.db.pipeline.mapping.Pivot;
import uk.gov.dca.db.pipeline.mapping.PivotConfig;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Base class for a select portion of a query def.  Will build all of the 
 * relavent select statements for this pivot.
 * 
 * @author Michael Barker
 *
 */
public abstract class AbstractSelect implements Select {

    private final Pivot m_pivot;
    private final List m_dependentVariables;
    private final static Log log = SUPSLogFactory.getLogger(AbstractSelect.class);
    
    
    public AbstractSelect(Pivot pivot) {
        m_pivot = pivot;
        m_dependentVariables = new ArrayList();
    }
    
    
    public Set getAliases() {
        return m_pivot.getAliases();
    }
    
    
    public Map getTables(String method) {
        return m_pivot.getTables(method);
    }
    
    public Map getAllTables() {
        return m_pivot.getAllTables();
    }
    
    public PivotConfig getConfig(String method) {
        return m_pivot.getConfig(method);
    }
    
    public Set getVariables(String method) {
        return m_pivot.getVariables(method);
    }
    
    public List getConstraints(String method) {
        return m_pivot.getConstraints(method);
    }
    
    public void addVariable(String method, String variable) {
        m_pivot.addVariable(method, variable);
    }
    
    
    /**
     * By default most selects set of dependent variables
     * are always the same.
     */
    public Collection getDependentVariables(String method) {
        return m_dependentVariables;
    }
    
    protected Collection getDependentVariables() {
        return m_dependentVariables;
    }
    
    public String getName() {
        return m_pivot.getName();
    }
        
    public boolean isModifiable() {
        return m_pivot.isModifiable();
    }
    
    
    /**
     * Puts all of the dependent variables in the supplied set and returns the
     * join clause formatted for JDBC.
     * 
     * @param join
     * @param dependentVariables
     * @return
     */
    protected String getPreparedSQL(String join, Collection dependentVariables) {
        dependentVariables.clear();
         
        //Find all parameters
        Matcher vars = Query.s_variablePattern.matcher(join);
        while (vars.find()) {
            //add var to dependent vars list
            String var = vars.group(1).toUpperCase();
            dependentVariables.add(var);
        }
        if (log.isDebugEnabled()) {
            log.debug("[" + getName() + "] Dependent Variables: " + dependentVariables);            
        }
        
        //Replace all parameters with ?
        return vars.replaceAll("?");
    }
    
}
