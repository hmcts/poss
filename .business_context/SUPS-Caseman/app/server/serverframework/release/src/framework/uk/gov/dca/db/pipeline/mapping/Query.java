/*
 * Created on 10-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping;

import uk.gov.dca.db.pipeline.mapping.modify.Modify;
import uk.gov.dca.db.pipeline.mapping.select.Select;

/**
 * Represents a query node in the query def file.
 * 
 * @author Michael Barker
 *
 */
public class Query {
    
    
    private final Select select;
    private final Modify modify;
    private final String pivotNode;
    
    public Query(String pivotNode, Select select, Modify modify) {
        this.pivotNode = pivotNode;
        this.select = select;
        this.modify = modify;
    }

    public Select getSelect() {
        return select;
    }
    
    public Modify getModify() {
        return modify;
    }
    
    public String getPivotNode() {
        return pivotNode;
    }
    
}
