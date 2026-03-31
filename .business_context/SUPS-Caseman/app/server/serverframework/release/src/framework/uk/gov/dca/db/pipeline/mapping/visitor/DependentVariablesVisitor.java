/*
 * Created on 16-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.visitor;

import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.Query;
import uk.gov.dca.db.pipeline.mapping.Constraint;
import uk.gov.dca.db.pipeline.mapping.Pivot;
import uk.gov.dca.db.pipeline.mapping.PivotNode;
import uk.gov.dca.db.pipeline.mapping.select.Select;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Handles the setting of dependent variables.
 * 
 * @author Michael Barker
 *
 */
public class DependentVariablesVisitor implements Visitor {

    private Set m_dependentVariables = new LinkedHashSet();
    private final String method;
    private final static Log log = SUPSLogFactory.getLogger(DependentVariablesVisitor.class);
    
    public DependentVariablesVisitor(String method) {
        this.method = method;
    }
    
    
    public void visitPivotNode(PivotNode node) throws SystemException, BusinessException {
        
        // Firstly visit all of the child pivot nodes.
        for (Iterator i = node.getChildNodes().values().iterator(); i.hasNext();) {
            PivotNode child = (PivotNode) i.next();
            child.accept(this);
        }
        
        if (log.isDebugEnabled()) {
            log.debug("[" + node.getName() + "] Processing Dependent variables");
        }        
        
        // Resolve dependent variables
        for (Iterator i = m_dependentVariables.iterator(); i.hasNext();) {
            String variable = (String) i.next();
            Matcher pMatch = Query.s_varContentPattern.matcher(variable);
            if (pMatch.find()) {
                String alias = pMatch.group(1);
                String column = pMatch.group(2);
                boolean isAdded = node.addVariable(method, alias + "." + column);
                if (isAdded) {
                    i.remove();                    
                }
            }
        }
        
        // Add all of our depended variables to the list.
        addDependentVariables(node);
        
        Map m = node.getParameters(method);
        for (Iterator i = m.keySet().iterator(); i.hasNext();) {
        	String parameter = (String) i.next();
        	m_dependentVariables.remove(parameter.toUpperCase());
        }
        
    }
    
    /**
     * Add all of the dependent variables including those defined in the query extensions.
     * 
     * @param node
     */
    private void addDependentVariables(Pivot node) {
        
        Select select = node.getSelect(method);
        m_dependentVariables.addAll(select.getDependentVariables(method));
        List constraints = node.getConstraints(method);
        for (Iterator i = constraints.iterator(); i.hasNext();) {
            Constraint c = (Constraint) i.next();
            List parameters = c.getParameters();
            for (Iterator j = parameters.iterator(); j.hasNext();) {
                String parameter = (String) j.next();
                m_dependentVariables.add(parameter);                    
            }
        }
    }
    
    
    
    public Set getDependentVariables() {
        return m_dependentVariables;
    }

}
