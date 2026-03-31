/*
 * Created on 01-Sep-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.select;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import org.jdom.Element;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.Table;
import uk.gov.dca.db.pipeline.mapping.KeyDef;
import uk.gov.dca.db.pipeline.mapping.Pivot;
import uk.gov.dca.db.pipeline.mapping.Variable;
import uk.gov.dca.db.pipeline.mapping.select.LinkedJoin.Type;
import uk.gov.dca.db.pipeline.mapping.sql.StatementFactory;
import uk.gov.dca.db.util.DefaultMap;

/**
 * Base class for all linked elements.  Handles all the key definitions
 * and absortbing of sub-queries.
 * 
 * @author Michael Barker
 *
 */
public abstract class LinkedSelect extends AbstractSelect {
    
    protected final static String KEY_ATTR = "key";
    protected final static String PARENT_ELEMENT = "Parent";
    protected final static String TYPE_ATTR = "type";
    protected static final String TABLES_ATTR = "tables";
    private static final String CACHE_KEY_ATTR = "cacheKey";
    
    private final LinkedJoin.Type m_type;
    private final KeyDef m_keyDef;
    private final KeyDef m_parentKeyDef;
    private final Map m_keyTables = new HashMap();
    private final Set m_keyVariables = new TreeSet();
    private String m_linkedParent = null;
    private final DefaultMap m_subs = new DefaultMap();
    private KeyDef cacheKeyDef;

    public LinkedSelect(Pivot pivot, Element eLinked) throws SystemException {
        super(pivot);
        
        m_subs.put(null, new HashMap());
        String keyStr = eLinked.getAttributeValue(KEY_ATTR);
        if (keyStr == null) {
            throw new SystemException("Key columns are not defined for LinkedJoin");
        }
        
        String typeStr = eLinked.getAttributeValue(TYPE_ATTR);
        m_type = LinkedJoin.Type.getType(typeStr);
        
        String[] keyColumns = keyStr.split(" ");
        m_keyDef = new KeyDef(keyColumns);
        m_parentKeyDef = loadParentKeys(eLinked, m_keyTables);
        addKeyVariables(m_parentKeyDef, m_keyVariables);
        addKeyVariables(m_keyDef, m_keyVariables);
        
        String cacheKeyDefStr = eLinked.getAttributeValue(CACHE_KEY_ATTR);
        String[] cacheKeyColumns = cacheKeyDefStr != null ? cacheKeyDefStr.split(" ") : new String[0];
        cacheKeyDef = new KeyDef(cacheKeyColumns);
     
        if (getParentKeyDef().isEmpty() && !LinkedJoin.Type.ROOT.equals(getType())) {
            throw new SystemException("[" + pivot.getName() + "] LinkedJoins must define their parent keys unless they have type 'root'");
        }        
    }

    /**
     * Adds the columns defined by the parent key to the list of variables for this
     * pivotnode.
     * 
     * @param keyDef
     * @throws SystemException
     */
    private void addKeyVariables(KeyDef keyDef, Set variables) throws SystemException {
        
        String[] columns = keyDef.getColumns();
        for (int i = 0; i < columns.length; i++) {
            Variable v = new Variable(columns[i]);
            variables.add(v);
        }
        
    }
    
    
    /**
     * Loads the parent key definition and adds and tables defined
     * by the parent keys into this tables for this element.
     * 
     * @param eLinkedJoin
     * @return
     * @throws SystemException 
     */
    private KeyDef loadParentKeys(Element eLinkedJoin, Map tables) throws SystemException {
        
        Map allTables = getAllTables();
        //Map tables = getTables();
        List eParents = eLinkedJoin.getChildren(PARENT_ELEMENT);
        List columns = new ArrayList();
        for (Iterator i = eParents.iterator(); i.hasNext();) {
            Element eParent = (Element) i.next();
            String[] keyColumns = eParent.getAttributeValue(KEY_ATTR).split(" ");
            // Get all of the key columns.
            for (int j = 0; j < keyColumns.length; j++) {
                columns.add(keyColumns[j]);
            }
            String aliasesStr = eParent.getAttributeValue(TABLES_ATTR);
            if (aliasesStr != null) {
                String[] aliases = aliasesStr.split(" ");
                for (int j = 0; j < aliases.length; j++) {
                    String alias = aliases[j];
                    Table table = (Table) allTables.get(alias);
                    if (table != null) {
                        tables.put(alias, table);
                    }
                    else {
                        throw new SystemException("Table for alias: " + alias + " is not defined");
                    }
                }
            }
            else {
                throw new SystemException("'tables' attribute not defined for parent element");
            }
        }
        return new KeyDef((String[]) columns.toArray(new String[0]));
    }

    public abstract StatementFactory getStatementFactory(String method);
    
    
    protected KeyDef getCachedKeyDef() {
        return cacheKeyDef;
    }
    
    
    /**
     * Add a sub linked join into this node.
     */
    public void addSub(String method, LinkedJoin linkedJoin) {
      
        Map sub = (Map) m_subs.get(method);
        if (sub == null) {
            sub = new HashMap();
            m_subs.put(method, sub);
        }
        sub.put(linkedJoin.getName(), linkedJoin);
    }

    /**
     * Gets the approriate map of sub queries for this linked join.
     * 
     * @param method
     * @return
     */
    public Map getSubs(String method) {
        return (Map) m_subs.get(method);
    }
    
    
    /**
     * @see uk.gov.dca.db.pipeline.mapping.select.Linkable#getType()
     */
    public Type getType() {
        return m_type;
    }
    
    public KeyDef getParentKeyDef() {
        return m_parentKeyDef;
    }
    
    public KeyDef getKeyDef() {
        return m_keyDef;
    }
    
    public Map getKeyTables() {
        return m_keyTables;
    }
    
    public Set getKeyVariables() {
        return m_keyVariables;
    }
    
    public boolean isLinkRoot() {
        return LinkedJoin.Type.ROOT.equals(m_type);
    }
    
    public boolean isLinkSub() {
        return LinkedJoin.Type.SUB.equals(m_type);
    }

    public void setLinkedParent(String name) {
        this.m_linkedParent = name;
    }
    
    public String getLinkedParent() {
        return m_linkedParent;
    }
    
}
