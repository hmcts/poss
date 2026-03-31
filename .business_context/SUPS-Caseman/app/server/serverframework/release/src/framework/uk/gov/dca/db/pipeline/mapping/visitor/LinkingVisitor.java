/*
 * Created on 10-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.visitor;

import java.util.EmptyStackException;
import java.util.Stack;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.mapping.PivotNode;
import uk.gov.dca.db.pipeline.mapping.select.Linkable;
import uk.gov.dca.db.pipeline.mapping.select.Select;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * This visitor walks the pivot node tree and subtends child linked joins
 * into their parent nodes.
 * 
 * @author Michael Barker
 *
 */
public class LinkingVisitor extends AbstractVisitor {
    
    private final Stack m_queryStack = new Stack();
    private final String m_method;
    private final static Log log = SUPSLogFactory.getLogger(LinkingVisitor.class);
    
    public LinkingVisitor(String method) {
        m_method = method;
        log.debug("Running linking visitor for: " + method);
    }
    
    public void visitPivotNode(PivotNode node) throws SystemException, BusinessException {
        
        Select select = node.getSelect(m_method);
        
        if (log.isDebugEnabled()) {
            log.debug("[" + node.getName() + "] Processing Linked Node");
        }
        
        if (select instanceof Linkable) {
            Linkable l = (Linkable) select;
            
            if (l.isLinkSub()) {
                try {
                    Linkable currentParent = (Linkable) m_queryStack.peek();
                    currentParent.addSub(m_method, l.getLinkedJoin(m_method));
                    l.setLinkedParent(currentParent.getName());
                    if (log.isInfoEnabled()) {
                        log.debug("[" + node.getName() + "] Adding sub-query node to parent: " + currentParent.getName());
                    }
                    processChildren(node);                    
                }
                catch (EmptyStackException e) {
                    throw new SystemException("[" + node.getName() + "] Sub-query linked join pivot node has been defined without a parent", e);
                }
            }
            else {
                m_queryStack.push(l);
                
                processChildren(node);

                m_queryStack.pop();
            }
        }
        else {
            processChildren(node);
        }
    }

}
