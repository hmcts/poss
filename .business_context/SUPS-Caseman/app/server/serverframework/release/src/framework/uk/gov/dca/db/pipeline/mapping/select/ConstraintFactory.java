/*
 * Created on 22-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.select;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.jdom.Element;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.mapping.Constraint;

/**
 * Creates a list of constriants for a Query or QueryExtension node.
 * 
 * @author Michael Barker
 *
 */
public class ConstraintFactory {

    private static final String CONSTRAINT_ELEMENT = "Constraint";

    public List create(Element eQuery) throws SystemException {
        
        List eConstraints = eQuery.getChildren(CONSTRAINT_ELEMENT);
        List constraints = new ArrayList();
        
        for (Iterator i = eConstraints.iterator(); i.hasNext();) {
            Element eConstraint = (Element) i.next();
            Constraint c = new Constraint(eConstraint);
            constraints.add(c);
        }
        
        return constraints;
    }
    
}
