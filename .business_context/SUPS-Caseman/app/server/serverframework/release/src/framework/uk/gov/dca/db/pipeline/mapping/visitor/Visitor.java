/*
 * Created on 10-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.visitor;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.mapping.PivotNode;

public interface Visitor {

    public void visitPivotNode(PivotNode node) throws SystemException, BusinessException;
    
}
