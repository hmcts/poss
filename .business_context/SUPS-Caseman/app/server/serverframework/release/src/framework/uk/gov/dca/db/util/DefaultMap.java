/*
 * Created on 02-Sep-2005
 *
 */
package uk.gov.dca.db.util;

import java.util.HashMap;
import java.util.Map;

/**
 * A mep delegate the handles a default value.
 * 
 * @author Michael Barker
 *
 */
public class DefaultMap {

    private Object defaultValue = null;
    private final Map values;
    
    public DefaultMap() {
        values = new HashMap();
    }
    
    public DefaultMap(Class mapClass) {
        try {
            values = (Map) mapClass.newInstance();
        }
        catch (InstantiationException e) {
            throw new RuntimeException(e);
        }
        catch (IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }
    
    public Object get(Object key) {
        if (key == null || !values.containsKey(key)) {
            return defaultValue;
        }
        else {
            return values.get(key);
        }
    }
    
    public void setDefaultValue(Object value) {
        defaultValue = value;
    }
    
    public void put(Object key, Object value) {
        if (key == null) {
            defaultValue = value;
        }
        else {
            values.put(key, value);
        }
    }
}
