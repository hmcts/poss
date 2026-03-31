/*
 * Created on 02-Sep-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.select;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.jdom.Element;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.mapping.Pivot;
import uk.gov.dca.db.pipeline.mapping.executor.Executor;
import uk.gov.dca.db.pipeline.mapping.executor.LinkedSQLExecutor;
import uk.gov.dca.db.pipeline.mapping.executor.Results;
import uk.gov.dca.db.pipeline.mapping.sql.DynamicStatementFactory;
import uk.gov.dca.db.pipeline.mapping.sql.StatementFactory;

public class DynamicLinkedSQLSelect extends LinkedSelect implements Linkable {

    private final Class m_generatorClass;
    private StatementFactory gen;
    
    public DynamicLinkedSQLSelect(Pivot pivot, Element eLinked, String className) throws SystemException {
        super(pivot, eLinked);
        
        try {
            m_generatorClass = Thread.currentThread().getContextClassLoader().loadClass(className);
        }
        catch (Exception e) {
            throw new SystemException("Unable to construct DynamicLinkedJoinSelect", e);
        }
    }

    public StatementFactory getStatementFactory(String method) {
        return gen;
    }

    public Executor createExecutor(String methodName) throws SystemException {
        Map resultsMap = new HashMap();
        resultsMap.put(getName(), new Results(getName(), getKeyDef(), getParentKeyDef()));
        
        for (Iterator i = getSubs(methodName).values().iterator(); i.hasNext();) {
            LinkedJoin lj = (LinkedJoin) i.next();
            Results results = new Results(lj.getName(), lj.getKeyDef(), lj.getParentKeyDef());
            resultsMap.put(lj.getName(), results);
        }
        
        return new LinkedSQLExecutor(getStatementFactory(methodName), getName(), resultsMap, getCachedKeyDef(), getConfig(methodName).getCustomHandlers());            
    }

    public void preprocess(String method) throws SystemException,
            BusinessException {
        
        gen = new DynamicStatementFactory(m_generatorClass);
    }

    public LinkedJoin getLinkedJoin(String method) throws SystemException {
        throw new SystemException("[" + getName() + "] Linked SQL nodes can not be absorbed into parent nodes");
    }
}
