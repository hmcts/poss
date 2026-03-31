/*
 * Created on 11-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.select;

import java.util.ArrayList;
import java.util.Collection;

import org.jdom.Element;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.mapping.Pivot;

/**
 * Represents a Dyanmic Linked Join select.
 * 
 * @author Michael Barker
 *
 */
public class DynamicLinkedJoinSelect extends LinkedJoinSelect implements Linkable {

    private final Class m_generatorClass;

    public DynamicLinkedJoinSelect(Pivot pivotNode, Element eLinkedJoin, String className) throws SystemException {
        super(pivotNode, eLinkedJoin);
        
        assert pivotNode != null : "pivotNode are null";
        assert eLinkedJoin != null   : "eLinkedJoin is null";
        assert className != null : "className is null";
        
        try {
            m_generatorClass = Thread.currentThread().getContextClassLoader().loadClass(className);
        }
        catch (Exception e) {
            throw new SystemException("Unable to construct DynamicLinkedJoinSelect", e);
        }
    }
    

    public LinkedJoin getLinkedJoin(String method) throws SystemException {
        return new LinkedJoin(getName(), getKeyDef(), getParentKeyDef(), 
                getVariables(method), getTables(method), null, 
                m_generatorClass, getDependentVariables(method));
    }

    public Collection getJoins() {
        return new ArrayList();
    }


    public Collection getDynamicJoins() {
        Collection dynamicJoins = new ArrayList();
        dynamicJoins.add(m_generatorClass);
        return dynamicJoins;
    }
    
}
