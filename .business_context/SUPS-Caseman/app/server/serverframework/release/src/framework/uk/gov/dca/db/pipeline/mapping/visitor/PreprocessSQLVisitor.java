/*
 * Created on 16-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.visitor;

import java.util.Iterator;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.mapping.PivotNode;
import uk.gov.dca.db.pipeline.mapping.select.Select;

/**
 * The Vistor that tells the pivot nodes to generate their SQL
 * statements.
 * 
 * @author Michael Barker
 *
 */
public class PreprocessSQLVisitor implements Visitor {

    private String method;
    
    public PreprocessSQLVisitor(String method) {
        this.method = method;
    }
    
    public void visitPivotNode(PivotNode node) throws SystemException, BusinessException {
        
        Select select = node.getSelect(method);
        select.preprocess(method);            
        
        for (Iterator i = node.getChildNodes().values().iterator(); i.hasNext();) {
            PivotNode pivotNode = (PivotNode) i.next();
            pivotNode.accept(this);
        }
        
    }

}
