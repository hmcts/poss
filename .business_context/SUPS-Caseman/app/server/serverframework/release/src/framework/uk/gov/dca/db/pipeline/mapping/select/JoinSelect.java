/*
 * Created on 10-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.select;

import org.apache.commons.logging.Log;
import org.jdom.Element;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.mapping.Pivot;
import uk.gov.dca.db.pipeline.mapping.executor.Executor;
import uk.gov.dca.db.pipeline.mapping.executor.SQLExecutor;
import uk.gov.dca.db.pipeline.mapping.sql.SQLGenerator;
import uk.gov.dca.db.pipeline.mapping.sql.StatementFactory;
import uk.gov.dca.db.util.DefaultMap;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Represents a standard join within a query definition file.
 * 
 * @author Michael Barker
 *
 */
public class JoinSelect extends AbstractSelect {

    private final static Log log = SUPSLogFactory.getLogger(JoinSelect.class);
    private final String m_joinClause;
    private final String m_preparedJoin;
    private final DefaultMap m_stFactories = new DefaultMap();
    
    public JoinSelect(Pivot pivotNode, Element eJoin) {
        super(pivotNode);
        if (eJoin != null) {
            m_joinClause = eJoin.getTextNormalize() != null ? eJoin.getTextNormalize() : "";            
        }
        else {
            m_joinClause = "";
        }
        m_preparedJoin = getPreparedSQL(m_joinClause, getDependentVariables(null));
    }
    
    
    /**
     * Preprocesses the sql for this particular node.
     * @throws SystemException 
     * @throws BusinessException 
     */
    public void preprocess(String method) throws SystemException, BusinessException {
        
        SQLGenerator gen = SQLGenerator.create(getVariables(method), getAliases(), 
                getTables(method), m_preparedJoin, 
                getDependentVariables(method), getConstraints(method), 
                isModifiable(), getConfig(method));
      
        m_stFactories.put(method, gen);
        
        log.debug("[" + getName() + "] SQL: " + gen);
    }
    
    
    public String toString() {
        //return super.toString() + " SQL: " + m_defaultSQL;
        return super.toString() + " SQL: " + m_stFactories.get(null);
    }
    
    public StatementFactory getStatementFactory(String methodName) {
        return (StatementFactory) m_stFactories.get(methodName);
    }
    
    /**
     * Creates an static sql executor for this Join statement.
     */
    public Executor createExecutor(String methodName) {
        return new SQLExecutor(getName(), getStatementFactory(methodName), getConfig(methodName).getCustomHandlers());
    }
}
