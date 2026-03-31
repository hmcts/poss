/*
 * Created on 30-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.executor;

import java.sql.Connection;

import org.jdom.Document;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.mapping.output.Context;

/**
 * This executor is a link to another executor.  It is used when
 * a sub-query has been absorbed into a parent node.
 * 
 * @author Michael Barker
 *
 */
public class DelegatedExecutor implements Executor {

    private final String m_parent;

    public DelegatedExecutor(String parent) {
        m_parent = parent;
    }
    
    public void open(Connection cn, Document inputXML, Context context)
            throws SystemException {
        
        throw new SystemException("Executor should be delegated to: " + m_parent);
    }

    public boolean next() throws SystemException {
        throw new SystemException("Executor should be delegated to: " + m_parent);
    }

    public void close() {
        // No-op
    }

    public void load(Context context) throws SystemException {
        throw new SystemException("Executor should be delegated to: " + m_parent);
    }

    public boolean isCacheable() {
        return false;
    }
    
    public String getLinkedParent() {
        return m_parent;
    }
    
    public Executor getDelegateExecutor(String name) throws SystemException {
        throw new SystemException(this.getClass() + " does not support delegate executors");
    }

}
