/*
 * Created on 11-Aug-2005
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

public class DynamicJoinSelect extends AbstractSelect {

    private final Class m_generatorClass;
    private final DefaultMap m_stFactories = new DefaultMap();
    private final static Log log = SUPSLogFactory.getLogger(DynamicJoinSelect.class);
    
    public DynamicJoinSelect(Pivot pivotNode, Element eJoin, String className) throws SystemException {
        super(pivotNode);
        
        assert pivotNode != null : "pivotNode are null";
        assert eJoin != null   : "eSQL is null";
        assert className != null : "className is null";
        
        try {
            m_generatorClass = Thread.currentThread().getContextClassLoader().loadClass(className);
        }
        catch (Exception e) {
            throw new SystemException("Unable to construct DynamicJoinGenerator", e);
        }
        
    }

    public Executor createExecutor(String methodName) throws SystemException {
        return new SQLExecutor(getName(), (StatementFactory) m_stFactories.get(methodName), getConfig(methodName).getCustomHandlers());
    }

    public void preprocess(String method) throws SystemException, BusinessException {
        
        SQLGenerator gen = SQLGenerator.create(getVariables(method), getAliases(), 
                getTables(method), m_generatorClass, 
                getDependentVariables(method), getConstraints(method), 
                isModifiable(), getConfig(method));
        
        m_stFactories.put(method, gen);
        
        log.debug("[" + getName() + "] SQL: " + gen);
    }

}
