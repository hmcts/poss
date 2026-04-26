/*
 * Created on 10-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.select;

import java.util.ArrayList;
import java.util.Collection;

import org.jdom.Element;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.mapping.Pivot;

/**
 * Represents a linked join.  Linked joins allow child linked joins to 
 * be merged with their parents.  Each join must contain the main join and
 * a link to link it to its parent.  Also it is not possible to have context
 * variables within a linked join.
 * 
 * 
 * @author Michael Barker
 *
 */
public class StaticLinkedJoinSelect extends LinkedJoinSelect implements Linkable {

    protected final static String JOIN_ELEMENT = "Join";
    private String m_preparedJoin;
    
    public StaticLinkedJoinSelect(Pivot pivotNode, Element eLinkedJoin) throws SystemException {
        super(pivotNode, eLinkedJoin);
                
        String joinClause = eLinkedJoin.getChildTextNormalize(JOIN_ELEMENT);
        m_preparedJoin = getPreparedSQL(joinClause, getDependentVariables());
    }


    public LinkedJoin getLinkedJoin(String method) {
        return new LinkedJoin(getName(), getKeyDef(), getParentKeyDef(), 
                getVariables(method), getTables(method), m_preparedJoin, 
                null, getDependentVariables());
    }


    public Collection getJoins() {
        Collection joins = new ArrayList();
        joins.add(m_preparedJoin);
        return joins;
    }


    public Collection getDynamicJoins() {
        return new ArrayList();
    }
    
}
