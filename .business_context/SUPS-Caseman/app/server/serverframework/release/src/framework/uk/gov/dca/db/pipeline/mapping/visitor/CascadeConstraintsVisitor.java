/*
 * Created on 31-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.visitor;

import java.util.List;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.mapping.PivotNode;
import uk.gov.dca.db.pipeline.mapping.select.Linkable;
import uk.gov.dca.db.pipeline.mapping.select.LinkedJoin;
import uk.gov.dca.db.pipeline.mapping.select.Select;

/**
 * This visitor walks the tree cascading any constraints specified on 
 * root nodes down to their child nodes.
 * 
 * @author Michael Barker
 *
 */
public class CascadeConstraintsVisitor extends AbstractVisitor {
    
    private final String m_method;
    private List m_constraints = null;

    public CascadeConstraintsVisitor(String method) {
        m_method = method;
    }
    
    public void visitPivotNode(PivotNode node) throws SystemException, BusinessException {
        
        Select select = node.getSelect(m_method);
        if (select instanceof Linkable) {
            Linkable l = (Linkable) select;
            
            if (l.isLinkRoot()) {
                m_constraints = node.getConstraints(m_method);
                processChildren(node);
                m_constraints = null;
            }
            else if (l.getType().equals(LinkedJoin.Type.QUERY) && m_constraints != null) {
                node.addConstraints(m_method, m_constraints);
                processChildren(node);
            }
            else {
                processChildren(node);
            }
        }
        else {
            m_constraints = null;
            processChildren(node);
        }
    }

}
