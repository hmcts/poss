/*
 * Created on 01-Sep-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.select;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.jdom.Element;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.mapping.Pivot;
import uk.gov.dca.db.pipeline.mapping.executor.Executor;
import uk.gov.dca.db.pipeline.mapping.executor.LinkedSQLExecutor;
import uk.gov.dca.db.pipeline.mapping.executor.Results;
import uk.gov.dca.db.pipeline.mapping.sql.SimpleStatementFactory;
import uk.gov.dca.db.pipeline.mapping.sql.StatementFactory;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Represents a full sql query as a linked join.
 * 
 * @author Michael Barker
 *
 */
public class LinkedSQLSelect extends LinkedSelect implements Linkable {

    private final static Log log = SUPSLogFactory.getLogger(LinkedSQLSelect.class);
    protected final static String SQL_ELEMENT = "SQL";
    private final String m_sql;
    private final String m_preparedSql;
    private SimpleStatementFactory m_statementFactory;
    
    public LinkedSQLSelect(Pivot pivot, Element eLinkedSQL) throws SystemException {
        super(pivot, eLinkedSQL);
        
        m_sql = eLinkedSQL.getChildTextNormalize(SQL_ELEMENT);
        m_preparedSql = getPreparedSQL(m_sql, getDependentVariables(null));
    }
    
    public void preprocess(String method) {
        m_statementFactory = new SimpleStatementFactory(m_preparedSql, getDependentVariables(method));
        log .debug("[" + getName() + "] SQL: " + m_statementFactory);        
    }
    
    
    public StatementFactory getStatementFactory(String method) {
        return m_statementFactory;
    }
    
    /**
     * Creates an static sql executor for this Join statement.
     */
    public Executor createExecutor(String methodName) {
        Map resultsMap = new HashMap();
        resultsMap.put(getName(), new Results(getName(), getKeyDef(), getParentKeyDef()));
        
        for (Iterator i = getSubs(methodName).values().iterator(); i.hasNext();) {
            LinkedJoin lj = (LinkedJoin) i.next();
            Results results = new Results(lj.getName(), lj.getKeyDef(), lj.getParentKeyDef());
            resultsMap.put(lj.getName(), results);
        }
        
        return new LinkedSQLExecutor(getStatementFactory(methodName), getName(), resultsMap, getCachedKeyDef(), getConfig(methodName).getCustomHandlers());            
    }    
    

    public LinkedJoin getLinkedJoin(String method) throws SystemException {
        throw new SystemException("[" + getName() + "] Linked SQL nodes can not be absorbed into parent nodes");
    }

}
