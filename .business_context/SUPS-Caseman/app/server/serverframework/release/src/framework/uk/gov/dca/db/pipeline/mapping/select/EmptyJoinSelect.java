/*
 * Created on 22-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.select;

import uk.gov.dca.db.pipeline.mapping.Pivot;

public class EmptyJoinSelect extends JoinSelect {

    public EmptyJoinSelect(Pivot pivotNode) {
        super(pivotNode, null);
    }

}
