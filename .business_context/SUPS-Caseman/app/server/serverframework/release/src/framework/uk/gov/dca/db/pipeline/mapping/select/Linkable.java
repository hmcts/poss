/*
 * Created on 10-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.select;

import uk.gov.dca.db.exception.SystemException;

/**
 * Defines the interface for linkable queries.  Allows for sub queries to
 * be subtended into other queries.
 * 
 * @author Michael Barker
 *
 */
public interface Linkable extends Select {

    /**
     * Gets the LinkedJoin for this node, to be absorbed into a 
     * parent node.
     * 
     * @return
     * @throws SystemException If this linked join does not support
     * being absorbed into a parent node.
     */
    public LinkedJoin getLinkedJoin(String method) throws SystemException;
    
    /**
     * Determines if this node is of a LinkedJoin.Type.ROOT.  Only root
     * are able to absorb sub queries.
     * 
     * @return
     */
    public boolean isLinkRoot();
    
    /**
     * Determines if this node is of type Linked.Type.SUB.  Only linked queries
     * of type sub can be absorbed.
     * 
     * @return
     */
    public boolean isLinkSub();
    
    /**
     * Adds a linked join to this Linkable node.
     * 
     * @param method
     * @param linkedJoin
     */
    public void addSub(String method, LinkedJoin linkedJoin);
    
    /**
     * Sets the name of the parent node that this join has been linked to.
     * @param name
     */
    public void setLinkedParent(String name);
    
    /**
     * Gets the type of this linked join.
     * @return
     */
    public LinkedJoin.Type getType();
   
}
