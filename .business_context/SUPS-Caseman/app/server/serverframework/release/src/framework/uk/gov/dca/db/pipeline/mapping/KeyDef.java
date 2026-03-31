/*
 * Created on 18-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import uk.gov.dca.db.pipeline.mapping.output.Context;

/**
 * Defines the columns used for a key.  Mainly used by
 * linked joins to define the keys that will be used in
 * the hashmaps.
 * 
 * @author Michael Barker
 *
 */
public class KeyDef {

    private final String[] m_columns;
    private final static Pattern ALIAS_PATTERN = Pattern.compile("([^.]+).[^.]");
    
    public KeyDef(String[] columns) {
        this.m_columns = columns;
    }
    
    /**
     * Builds a key value from a Map.
     * 
     * @param m
     * @return
     */
    public Key create(Map m) {
        Object[] keyArr = new Object[m_columns.length];
        for (int i = 0; i < m_columns.length; i++) {
            keyArr[i] = m.get(m_columns[i]);
        }
        return new Key(keyArr);
    }
    
    public boolean isEmpty() {
        return m_columns.length == 0;
    }

    /**
     * Builds a key value from a Context.
     * 
     * @param context
     * @return
     */
    public Key create(Context context) {
        Object[] keyArr = new Object[m_columns.length];
        for (int i = 0; i < m_columns.length; i++) {
            keyArr[i] = context.getValue(m_columns[i]);
        }
        return new Key(keyArr);
    }
    
    /**
     * Gets a list of all of the table aliases for the columns specified
     * in the key.
     * 
     * @return
     */
    public List getTableAliases() {
        
        List l = new ArrayList();
        for (int i = 0; i < m_columns.length; i++) {
            Matcher matcher = ALIAS_PATTERN.matcher(m_columns[i]);
            if (matcher.find()){
                l.add(matcher.group(1));
            }
        }
        return l;
        
    }
    
    /**
     * Gets the array of columns for this key definition.
     * @return
     */
    public String[] getColumns() {
        return m_columns;
    }
    
    /**
     * Returns a collection of all of the variables requried for this key definition.
     * @return
     */
    public Collection getVariables() {
        ArrayList l = new ArrayList();
        for (int i = 0; i < m_columns.length; i++) {
            l.add(new Variable(m_columns[i]));
        }
        return l;
    }
}
