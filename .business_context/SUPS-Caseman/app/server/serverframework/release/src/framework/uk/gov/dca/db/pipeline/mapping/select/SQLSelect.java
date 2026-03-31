/*
 * Created on 10-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.select;

import org.apache.commons.logging.Log;
import org.jdom.Element;

import uk.gov.dca.db.pipeline.mapping.Pivot;
import uk.gov.dca.db.pipeline.mapping.executor.Executor;
import uk.gov.dca.db.pipeline.mapping.executor.SQLExecutor;
import uk.gov.dca.db.pipeline.mapping.sql.SimpleStatementFactory;
import uk.gov.dca.db.pipeline.mapping.sql.StatementFactory;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Represents a static SQL block
 * 
 * @author Michael Barker
 *
 */
public class SQLSelect extends AbstractSelect {

    private final static Log log = SUPSLogFactory.getLogger(SQLSelect.class);
    private final String m_sql;
    private final String m_preparedSql;
    private StatementFactory m_statementFactory;
    
    public SQLSelect(Pivot pivotNode, Element eSQL) {
        super(pivotNode);
        
        assert pivotNode != null : "pivotNode is null";
        assert eSQL != null   : "eSQL is null";
        
        m_sql = eSQL.getTextNormalize();
        m_preparedSql = getPreparedSQL(m_sql, getDependentVariables(null));
    }
    
    
    /**
     * SQL blocks ignore all per-method constraints etc.
     */
    public void preprocess(String method) {
        m_statementFactory = new SimpleStatementFactory(m_preparedSql, getDependentVariables(method));
        log.debug("[" + getName() + "] SQL: " + m_statementFactory);
    }
    
    public StatementFactory getStatementFactory(String methodName) {
        return m_statementFactory;
    }
    
    /**
     * Creates an static sql executor for this Join statement.
     */
    public Executor createExecutor(String methodName) {
        return new SQLExecutor(getName(), getStatementFactory(methodName), getConfig(methodName).getCustomHandlers());
    }    
    
    public boolean isDynamic() {
        return false;
    }
    
    public boolean isSelectGenerated() {
        return false;
    }
    

}
