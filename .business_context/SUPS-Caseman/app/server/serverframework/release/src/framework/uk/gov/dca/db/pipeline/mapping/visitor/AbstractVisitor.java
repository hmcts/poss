/*
 * Created on 31-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.visitor;

import java.util.Iterator;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.mapping.PivotNode;

public abstract class AbstractVisitor implements Visitor {


    public void processChildren(PivotNode node) throws SystemException, BusinessException {
        for (Iterator i = node.getChildNodes().values().iterator(); i.hasNext();) {
            PivotNode child = (PivotNode) i.next();
            child.accept(this);
        }        
    }
}
