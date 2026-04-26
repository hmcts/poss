/*
 * Created on 30-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.executor;

import java.sql.Connection;
import java.util.Iterator;
import java.util.Map;

import org.jdom.Document;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.mapping.Key;
import uk.gov.dca.db.pipeline.mapping.output.Context;

/**
 * Simple executor that takes a 
 * @author Michael Barker
 *
 */
public class ResultsExecutor implements Executor {

    
    private final Results m_results;
    private Iterator m_currentParent = null;
    private Map m_currentValue = null;
    private boolean isOpen;
    
    public ResultsExecutor(Results results) {
        m_results = results;
    }
    
    public void open(Connection cn, Document inputXML, Context context)
            throws SystemException {
        
        Key parentKey = m_results.getParentKeyDef().create(context);
        if (parentKey.isValid()) {
            Map parent = m_results.getParentRow(parentKey);
            if (parent != null) {
                m_currentParent = parent.values().iterator();
            }            
        }
        isOpen = true;
        
    }

    public boolean next() throws SystemException {
        
        boolean result = false;
        if (isOpen) {
            // Null will indicate that there is
            // no values for this current parent.
            if (m_currentParent != null && m_currentParent.hasNext()) {
//                Key key = (Key) m_currentParent.next();
//                m_currentValue = m_results.getValue(key);
                m_currentValue = (Map) m_currentParent.next();
                result = true;
            }
        }
        else {
            throw new SystemException("The current executor has not been properly opened");
        }
        return result;
        
    }

    public void close() {
        //isOpen = false;
    }

    public void load(Context context) throws SystemException {
        if (m_currentValue != null) {
            // We simply replace the value at the top
            // of the stack with our results.
            // TODO: Check if this is correct, it should be.
            context.pop();
            context.push(m_currentValue);            
        }
        else {
            throw new SystemException("The current executor has not been properly opened");
        }
    }

    public boolean isCacheable() {
        return true;
    }

    public String getLinkedParent() {
        return null;
    }
    
    public Executor getDelegateExecutor(String name) throws SystemException {
        throw new SystemException(this.getClass() + " does not support delegate executors");
    }
    
}
