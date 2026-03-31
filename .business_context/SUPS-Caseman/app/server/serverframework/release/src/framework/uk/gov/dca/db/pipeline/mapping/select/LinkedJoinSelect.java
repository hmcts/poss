/*
 * Created on 02-Sep-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.select;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import org.apache.commons.logging.Log;
import org.jdom.Element;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.mapping.Pivot;
import uk.gov.dca.db.pipeline.mapping.executor.DelegatedExecutor;
import uk.gov.dca.db.pipeline.mapping.executor.Executor;
import uk.gov.dca.db.pipeline.mapping.executor.LinkedSQLExecutor;
import uk.gov.dca.db.pipeline.mapping.executor.Results;
import uk.gov.dca.db.pipeline.mapping.sql.SQLGenerator;
import uk.gov.dca.db.pipeline.mapping.sql.StatementFactory;
import uk.gov.dca.db.util.DefaultMap;
import uk.gov.dca.db.util.SUPSLogFactory;

public abstract class LinkedJoinSelect extends LinkedSelect {

    private final static Log log = SUPSLogFactory.getLogger(LinkedJoinSelect.class);
    private final DefaultMap m_stFactories = new DefaultMap();

    public LinkedJoinSelect(Pivot pivot, Element eLinked) throws SystemException {
        super(pivot, eLinked);
    }
    
    /**
     * Linked Joins' variables can change across differing methods as a root
     * may have a different sub joins below it.
     * 
     * TODO: Should this be moved to the base LinkedSelect class.
     * 
     */
    public Collection getDependentVariables(String method) {
        ArrayList l = new ArrayList();
        l.addAll(getDependentVariables());
        Map subs = getSubs(method);
        for (Iterator i = subs.values().iterator(); i.hasNext();) {
            LinkedJoin lj = (LinkedJoin) i.next();
            l.addAll(lj.getDependentVariables());
        }
        return l;
    }
    
    /**
     * Preprocesses the sql for this node.
     * @throws BusinessException 
     * 
     * @see uk.gov.dca.db.pipeline.mapping.select.AbstractSelect#preprocessSQL()
     */
    public void preprocess(String method) throws SystemException, BusinessException {
        
        if (!isLinkSub()) {
            Map tables = new HashMap();
            tables.putAll(getTables(method));
            tables.putAll(getKeyTables());
            
            Set variables = new TreeSet();
            variables.addAll(getVariables(method));
            variables.addAll(getKeyVariables());
            
            Collection joins = getJoins();
//            if (!SQLGenerator.isEmpty(m_joinClause)) {
//                joins.add(m_joinClause);
//            }
            
            Collection generators = getDynamicJoins();
            Map subs = getSubs(method);
            for (Iterator i = subs.values().iterator(); i.hasNext();) {
                LinkedJoin lj = (LinkedJoin) i.next();
                tables.putAll(lj.getTables());
                variables.addAll(lj.getAllVariables());
                if (lj.isDynamic()) {
                    generators.add(lj.getGeneratorClass());
                }
                else {
                    joins.add(lj.getJoinClause());                    
                }
            }
            
            // TODO: See if this is required.
            //PivotConfig pc = new PivotConfig(false, null, oc.getOrderBy(), oc.getHandlers(), oc.getHint());
            
            SQLGenerator gen = SQLGenerator.create(variables, getAliases(), 
                    tables, joins, generators, getDependentVariables(method), 
                    getConstraints(method), isModifiable(), getConfig(method));

            m_stFactories.put(method, gen);
        }
        else {
            log.debug("[" + getName() + "] Sub-queries do not need to preprocessSQL");
        }
    }

    public StatementFactory getStatementFactory(String methodName) {
        return (StatementFactory) m_stFactories.get(methodName);
    }
    
    /**
     * Gets an executor that that will handle a linked join.
     * 
     * @see uk.gov.dca.db.pipeline.mapping.select.AbstractSelect#createExecutor(java.lang.String)
     */
    public Executor createExecutor(String methodName) {
        // If this node has be sub-tended into the parent pass the delegate placeholder.
        if (isLinkSub()) {
            return new DelegatedExecutor(getLinkedParent());
        }
        else {
            Map resultsMap = new HashMap();
            resultsMap.put(getName(), new Results(getName(), getKeyDef(), getParentKeyDef()));
            
            for (Iterator i = getSubs(methodName).values().iterator(); i.hasNext();) {
                LinkedJoin lj = (LinkedJoin) i.next();
                Results results = new Results(lj.getName(), lj.getKeyDef(), lj.getParentKeyDef());
                resultsMap.put(lj.getName(), results);
            }
            
            return new LinkedSQLExecutor(getStatementFactory(methodName), getName(), resultsMap, getCachedKeyDef(), getConfig(methodName).getCustomHandlers());            
        }
    }
    
    
    /**
     * Gets the inital list of static joins for this select
     * 
     * @return
     */
    public abstract Collection getJoins();
    
    /**
     * Gets the initial list of dynamic joins for this select.
     * @return
     */
    public abstract Collection getDynamicJoins();
}
