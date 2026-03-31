/*
 * Created on 16-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.output;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import uk.gov.dca.db.pipeline.IQueryContextReader;
import uk.gov.dca.db.pipeline.IQueryContextWriter;

/**
 * Stack based implementation of a set of context information.
 * 
 * @author Michael Barker
 *
 */
public class Context extends ArrayList implements IQueryContextReader, IQueryContextWriter {

    /**
     * 
     */
    private static final long serialVersionUID = -3082045047663060828L;

    /**
     * 
     */
    public Context() {
        super();
        // TODO Auto-generated constructor stub
    }

    /**
     * @param c
     */
    public Context(Collection c) {
        super(c);
        // TODO Auto-generated constructor stub
    }

    /**
     * @param initialCapacity
     */
    public Context(int initialCapacity) {
        super(initialCapacity);
        // TODO Auto-generated constructor stub
    }
    
    
    public void push(Map m) {
        add(m);
    }
    
    public Map pop() {
        return (Map) remove(size() - 1);
    }
    
    public Map peek() {
        return (Map) get(size() - 1);
    }
    
    public Object getValue(String name) {
        
        Object value = null;
        for (int i = size() - 1; i >= 0; i--) {
            Map m = (Map) get(i);
            value = m.get(name);
            if (value != null) {
                break;
            }
        }
        return value;
    }
    
    public void setValue(String name, Object value) {
        peek().put(name, value);
    }
    
}
