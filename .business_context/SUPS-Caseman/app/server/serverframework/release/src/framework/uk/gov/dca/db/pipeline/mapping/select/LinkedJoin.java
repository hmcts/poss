/*
 * Created on 10-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.select;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.mapping.KeyDef;


/**
 * Represnts a linked join that can be used to create a larger outer join.
 * 
 * @author Michael Barker
 *
 */
public class LinkedJoin {

    private Collection m_variables;
    private final Collection m_dependentVariables;
    private Map m_tables;
    private final String m_joinClause;
    private final Class m_generatorClass;
    private final KeyDef m_keyDef;
    private final KeyDef m_parentKeyDef;
    private final String m_name;
    
    public LinkedJoin(String name, KeyDef keyDef, KeyDef parentKeyDef, Collection variables, Map tables, String joinClause, Class generatorClass, Collection dependentVariables) {
        m_name = name;
        m_keyDef = keyDef;
        m_parentKeyDef = parentKeyDef;
        m_variables = variables;
        m_tables = tables;
        m_joinClause = joinClause;
        m_generatorClass = generatorClass;
        m_dependentVariables = dependentVariables;
    }
    
    /**
     * This is the name of the pivot node that the linked join came from.
     * 
     * @return
     */
    public String getName() {
        return m_name;
    }
    
    public Collection getVariables() {
        return m_variables;
    }
    
    public void setVariables(Collection c) {
        m_variables = c;
    }
    
    /**
     * Returns all of the variables required for this linked join
     * including those required for the key and parent keys.
     *
     */
    public Collection getAllVariables() {
        ArrayList l = new ArrayList();
        l.addAll(getVariables());
        l.addAll(m_keyDef.getVariables());
        l.addAll(m_parentKeyDef.getVariables());
        return l;
    }
    
    public Collection getDependentVariables() {
        return m_dependentVariables;
    }
    
    public void setTables(Map m) {
        m_tables = m;
    }
    
    public Map getTables() {
        return m_tables;
    }
    
    public KeyDef getKeyDef() {
        return m_keyDef;
    }
    
    public KeyDef getParentKeyDef() {
        return m_parentKeyDef;
    }
    
    public String getJoinClause() {
        return m_joinClause;
    }
    
    public Class getGeneratorClass() {
        return m_generatorClass;
    }
    
    public boolean isDynamic() {
        return m_joinClause == null && m_generatorClass != null;
    }
    
    public static class Type {
        
        public final static Type ROOT = new Type(0);
        public final static Type QUERY = new Type(1);
        public final static Type SUB = new Type(2);

        private final int m_type;
        private Type(int type) {
            this.m_type = type;
        }
        
        public static Type getType(String s) throws SystemException {
            if ("root".equalsIgnoreCase(s)) {
                return ROOT;
            }
            else if ("query".equalsIgnoreCase(s)) {
                return QUERY;
            }
            else if ("sub".equalsIgnoreCase(s)) {
                return SUB;
            }
            else {
                throw new SystemException("Invalid type: " + s);
            }
        }
        
        public int value() {
            return m_type;
        }
        
    }
    
}