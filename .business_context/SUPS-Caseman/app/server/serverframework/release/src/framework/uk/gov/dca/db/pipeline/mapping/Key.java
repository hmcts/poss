/*
 * Created on 09-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping;

/**
 * Multi-valued key used for indexing into the contexts of each pivot node.
 * This also supports the idea of a root key.  This is a key that is empty.
 * We may want to handle this special case seperately for performance.
 * 
 * @author Michael Barker
 *
 */
public class Key {
    
    private final Object[] m_values;
    
    public Key(Object[] keyArr) {
        m_values = keyArr;
    }
    
    public int hashCode() {
        int len = m_values.length;
        
        switch (len) {
        case 0:
            return 0;
        case 1:
            return m_values[len-1].hashCode();
        case 2:
            return m_values[len-2].hashCode() + m_values[len-1].hashCode();
        default: 
            return m_values[len-3].hashCode() + m_values[len-2].hashCode() + m_values[len-1].hashCode();
        }
    }
    
    /**
     * Compares all of the values in the multi-value key.
     */
    public boolean equals(Object o) {
        
        boolean result = true;
        
        if (o instanceof Key) {
            Key k = (Key) o;
            if (k.m_values.length == m_values.length) {
                // Reverse iterate as the least significant values
                // are more likely to be different.
                for (int i = m_values.length - 1; i >= 0; i--) {
                    if (!m_values[i].equals(k.m_values[i])) {
                        result = false;
                        break;
                    }
                }
            }
            else {
                result = false;
            }
        }
        else {
            result = false;
        }
        
        return result;
    }
    
    public String toString() {
        
        StringBuffer sb = new StringBuffer();
        
        for (int i = 0; i < m_values.length; i++) {
            sb.append(m_values[i]);
            if (i < m_values.length - 1) {
                sb.append("/");
            }
        }
        
        return sb.toString();
    }
    
    public boolean isEmpty() {
        return m_values.length == 0;
    }
    
    public boolean isRoot() {
        return m_values.length == 0;        
    }

    /**
     * Determines if any of the key values for this
     * key are null.
     * 
     * TODO: Optimise.
     * @return
     */
    public boolean isValid() {
        for (int i = 0; i < m_values.length; i++) {
            if (m_values[i] == null) {
                return false;
            }
        }
        return true;
    }
    
}
