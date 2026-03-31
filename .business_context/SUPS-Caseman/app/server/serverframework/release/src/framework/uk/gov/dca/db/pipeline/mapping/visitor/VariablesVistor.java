/*
 * Created on 15-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.visitor;

import java.util.Iterator;

import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.mapping.PivotNode;

/**
 * Walks the pivot nodes building up the list of variable for each pivot node.
 * 
 * @author Michael Barker
 *
 */
public class VariablesVistor implements Visitor {

    private Element m_template;


    public VariablesVistor(Element template) {
        m_template = template;
    }
    
    
    /**
     * Loads the variables for the specified node.
     * @throws BusinessException 
     */
    public void visitPivotNode(PivotNode node) throws SystemException, BusinessException {
        
        String path = node.getUniqueElementPath();
        try {
            Element e = (Element) XPath.selectSingleNode(m_template, path);
            node.loadParameters(e);
            
            for (Iterator i = node.getChildNodes().values().iterator(); i.hasNext();) {
                PivotNode p = (PivotNode) i.next();
                p.accept(this);
            }            
        }
        catch (JDOMException e) {
            throw new SystemException(e);
        }
    }

    
    
}
