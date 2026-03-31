/*
 * Created on 10-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.modify;

import uk.gov.dca.db.pipeline.mapping.Pivot;

public class BaseModify implements Modify {

    private final boolean m_isModifiable;
    
    public BaseModify(boolean notModifiable) {
        this.m_isModifiable = notModifiable;
        
    }

    public void setPivotNode(Pivot node) {
        // TODO Auto-generated method stub
        
    }
    
}
