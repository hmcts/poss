/*
 * Created on 30-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.executor;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.pipeline.mapping.Key;
import uk.gov.dca.db.pipeline.mapping.KeyDef;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Is a container for the results of the linked queries.
 * 
 * @author Michael Barker
 * 
 */
public class Results {

    private final static Log log = SUPSLogFactory.getLogger(Results.class);
    private final String m_name;
    private final KeyDef m_keyDef;
    private final KeyDef m_parentKeyDef;
    private Map m_parentRows;
    //private Map m_values;

    public Results(String name, KeyDef keyDef, KeyDef parentKeyDef) {
        m_name = name;
        m_keyDef = keyDef;
        m_parentKeyDef = parentKeyDef;
        m_parentRows = new HashMap();
        //m_values = new LinkedHashMap();
    }
    
    public void clear() {
        m_parentRows.clear();
        //m_values.clear();
    }
    
    public Map getParentRow(Key parentKey) {
        return (Map) m_parentRows.get(parentKey);
    }

    public void addRow(Map row)
            throws SQLException {

        Key key = m_keyDef.create(row);
        Key parentKey = m_parentKeyDef.create(row);

        if (key.isValid() && parentKey.isValid()) {
            Map parent = (Map) m_parentRows.get(parentKey);
            if (parent == null) {
                parent = new LinkedHashMap();
                m_parentRows.put(parentKey, parent);
            }
            parent.put(key, row);
            //if (!m_values.containsKey(key)) {
            //    m_values.put(key, row);
            //}
        }
        else if (log.isDebugEnabled()) {
            log.debug("Skipping row as one of the key values are null");
        }
    }
    
    public String getName() {
        return m_name;
    }
    
    public KeyDef getKeyDef() {
        return m_keyDef;
    }
    
    public KeyDef getParentKeyDef() {
        return m_parentKeyDef;
    }

//    public Map getValue(Key key) {
//        return (Map) m_values.get(key);
//    }
    
    public String toString() {
        return m_parentRows.toString();
    }

}
