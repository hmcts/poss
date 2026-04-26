/*
 * Created on 10-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.modify;

import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.jdom.Attribute;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.ConfigurationException;
import uk.gov.dca.db.exception.SystemException;

public class ModifyFactory {

    private final static String MODIFY_ELEMENT = "Modify";
    private final static String NOT_MODIFIABLE_ATTR = "notModifiable";
    private static final String SQL_ELEMENT_NAME = "SQL";
    
    public static Modify create(Element queryNode, Map tables) throws SystemException {
        
        
        Element modifyElement = queryNode.getChild(MODIFY_ELEMENT);
        
        //try {
        boolean isModifiable = !(new Boolean(modifyElement.getAttributeValue(NOT_MODIFIABLE_ATTR)).booleanValue());
        Modify modify = new BaseModify(isModifiable);
            //notModifiable = XPath.selectSingleNode(modifyElement, "@notModifiable");
        //}
        //catch(JDOMException e) {
         //   throw new SystemException("Unable to evaluate attribute 'notModifiable': "+e.getMessage(),e);
        //}
        
//        if (notModifiable != null) {
//            m_notModifiable = true;
//            return;
//        }
        
        Iterator sqlStatements = null;
        try {
            sqlStatements = XPath.selectNodes(modifyElement, SQL_ELEMENT_NAME).iterator();
        }
        catch(JDOMException e) {
          //  throw new SystemException("Unable to evaluate element '"+SQL_ELEMENT_NAME+"': "+e.getMessage(),e);
        }
        
        while(sqlStatements.hasNext()) {
            Element sql = (Element) sqlStatements.next();
           // extractModifySQL(sql);
        }

        /* 'Property' variables. These are variables which are not bound to the database. */
        Iterator properties = null;
        try {
            properties = XPath.selectNodes(modifyElement, "Property").iterator();
        }
        catch(JDOMException e) {
          //  throw new SystemException("Unable to evaluate element 'Property': "+e.getMessage(),e);
        }
        
        while (properties.hasNext()) {
            Element field = (Element) properties.next();
          //  createProperty( field,false );
        }
        
        /* Update fields - used by existance check. These are bound to the database */
        Iterator fields = null;
        try {
            fields = XPath.selectNodes(modifyElement, "Field").iterator();
        }
        catch(JDOMException e) {
            //throw new SystemException("Unable to evaluate element 'Field': "+e.getMessage(),e);
        }
        
        while (fields.hasNext()) {
            Element field = (Element) fields.next();
            //createProperty( field,true );
        }
        /* Get existance checks */
        Iterator existanceChecks = null;
        try {
            existanceChecks = XPath.selectNodes(modifyElement, "CheckExists").iterator();
        }
        catch(JDOMException e) {
            throw new SystemException("Unable to evaluate element 'CheckExists': "+e.getMessage(),e);
        }
        
        while (existanceChecks.hasNext()) {
            Element existanceCheck = (Element) existanceChecks.next();
            String alias = existanceCheck.getAttributeValue("table").toUpperCase();
            
            String onExistsAction = existanceCheck.getAttributeValue("onExist");
            String onNotExistsAction = existanceCheck.getAttributeValue("onNotExist");
            
            // get the optimistic lock setting
            boolean bUseOptimisticLock = true; // default value
            Attribute attrOptimisticLock = existanceCheck.getAttribute("useOptimisticLock");
            if (attrOptimisticLock != null) {
                String useLock = attrOptimisticLock.getValue();
                if ( "false".compareToIgnoreCase(useLock) == 0 ) {
                    bUseOptimisticLock = false;
                }
                else if ("true".compareToIgnoreCase(useLock) != 0){
                    throw new ConfigurationException("Invalid value for CheckExists attribute 'useOptimisticLock': "+useLock);
                }
            }
            
            // now create unique clause for existance check
            String uniqueFields = existanceCheck.getAttributeValue("fields").toUpperCase();
            String sUniqueClause = "";
            List lFields = new LinkedList();
            boolean bFirst = true;
            
            String[] arrFields = uniqueFields.split("\\s");
            for (int f=0; f < arrFields.length; f++)
            {
                String sAliasedName = alias + "." + arrFields[f];
                lFields.add(sAliasedName);
                
                if ( bFirst == true )
                {
                    sUniqueClause += sAliasedName + " = ?";
                    bFirst = false;
                }
                else 
                    sUniqueClause += " AND " + sAliasedName + " = ?";
            }
            
            // create existance check
//            ExistanceCheck check = new ExistanceCheck(alias, onExistsAction, onNotExistsAction, sUniqueClause, lFields, bUseOptimisticLock,
//                    existanceCheck.getAttributeValue("condition"), existanceCheck.getAttributeValue("onConditionTrue"), existanceCheck.getAttributeValue("onConditionFalse"));
//            
//            m_existanceMap.put(check.getAlias(), check);
        }
        return null;
        
    }
    
}
