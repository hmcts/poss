/*
 * Created on 10-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.select;

import org.jdom.Element;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.mapping.Pivot;
import uk.gov.dca.db.pipeline.mapping.executor.Executor;
import uk.gov.dca.db.pipeline.mapping.executor.SQLExecutor;
import uk.gov.dca.db.pipeline.mapping.sql.DynamicStatementFactory;
import uk.gov.dca.db.pipeline.mapping.sql.StatementFactory;


public class DynamicSQLSelect extends AbstractSelect {

    private final Class m_generatorClass;
    private StatementFactory m_statementFactory;
    
    public DynamicSQLSelect(Pivot pivotNode, Element eSQL, String className) throws SystemException {
        super(pivotNode);

        assert pivotNode != null : "pivotNode are null";
        assert eSQL != null   : "eSQL is null";
        assert className != null : "className is null";
        
        try {
            m_generatorClass = Thread.currentThread().getContextClassLoader().loadClass(className);
        }
        catch (Exception e) {
            throw new SystemException("Unable to construct DynamicSQLGenerator", e);
        }
        
    }
    
    public Executor createExecutor(String methodName) throws SystemException {
        return new SQLExecutor(getName(), m_statementFactory, getConfig(methodName).getCustomHandlers());
    }

    public void preprocess(String method) throws SystemException {
        m_statementFactory = new DynamicStatementFactory(m_generatorClass);
    }

}
