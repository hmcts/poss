/*
 * Created on 10-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.select;

import org.apache.commons.logging.Log;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.ConfigurationException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.mapping.AbstractFactory;
import uk.gov.dca.db.pipeline.mapping.Pivot;
import uk.gov.dca.db.pipeline.query.sql.StatementType;
import uk.gov.dca.db.util.SUPSLogFactory;


/**
 * @author Michael Barker
 *
 */
public class SelectFactory extends AbstractFactory {
    
    private final static String TYPE_ATTR = "type";
    private final static String GENERATOR_ATTR = "generator";
    
    private final static String SQL_ELEMENT = "SQL";
    private final static String JOIN_ELEMENT = "Join";
    private final static String LINKED_JOIN_ELEMENT = "LinkedJoin";
    private static final String LINKED_SQL_ELEMENT = "LinkedSQL";
    private final static XPath LINKED_JOIN_GENERATOR_PATH;
    private final static XPath LINKED_SQL_GENERATOR_PATH;

    static {
        try {
            LINKED_JOIN_GENERATOR_PATH = XPath.newInstance("./Join/@generator");
            LINKED_SQL_GENERATOR_PATH = XPath.newInstance("./SQL/@generator");
        }
        catch (JDOMException e) {
            throw new RuntimeException("Unable to construct XPath, this is a bug", e);
        }
    }
    
    private final static Log log = SUPSLogFactory.getLogger(SelectFactory.class);
    
    /**
     * Creates a select element given an input query node.
     * 
     * @param eQuery
     * @param tables
     * 
     * @return
     * @throws SystemException 
     */
    public Select create(Pivot pivotNode, Element eQuery) throws SystemException {
        
        Select select;
        if (log.isDebugEnabled()) {
            log.debug("Loading Pivot Node: " + pivotNode.getName());
        }
        
        Element eSQL = eQuery.getChild(SQL_ELEMENT);
        Element eJoin = eQuery.getChild(JOIN_ELEMENT);
        Element eLinkedJoin = eQuery.getChild(LINKED_JOIN_ELEMENT);
        Element eLinkedSQL = eQuery.getChild(LINKED_SQL_ELEMENT);
        
        try {
            // The case where we have a full SQL block.
            if(eSQL != null) {
                String statementTypeName = eSQL.getAttributeValue(TYPE_ATTR);
                StatementType statementType = StatementType.getInstance(statementTypeName);
                
                if(statementTypeName != null && !statementType.equals(StatementType.SELECT)) {
                    throw new ConfigurationException("Assertion failure whilst processing query: [" + pivotNode.getName() 
                            + "].  Only 'select' SQL statments may be specified at this level within a query element");
                }
                
                String generatorName = eSQL.getAttributeValue(GENERATOR_ATTR);
                if (generatorName != null) {
                    select = new DynamicSQLSelect(pivotNode, eSQL, generatorName);
                }
                else {
                    select = new SQLSelect(pivotNode, eSQL);
                }
            }
            // A standard join
            else if (eJoin != null) {
                
                String generatorName = eJoin.getAttributeValue(GENERATOR_ATTR);
                if (generatorName != null) {
                    select = new DynamicJoinSelect(pivotNode, eJoin, generatorName);
                }
                else {
                    select = new JoinSelect(pivotNode, eJoin);
                }
            }
            // A funky linked join.
            else if (eLinkedJoin != null) {
                
                String generatorName = LINKED_JOIN_GENERATOR_PATH.valueOf(eLinkedJoin);
                if (generatorName != null && generatorName.trim().length() > 0) {
                    select = new DynamicLinkedJoinSelect(pivotNode, eLinkedJoin, generatorName);
                }
                else {
                    select = new StaticLinkedJoinSelect(pivotNode, eLinkedJoin);
                }
                
            }
            // A funky linked SQL.
            else if (eLinkedSQL != null) {

                String generatorName = LINKED_SQL_GENERATOR_PATH.valueOf(eLinkedSQL);
                if (generatorName != null && generatorName.trim().length() > 0) {
                    //throw new SystemException("[" + pivotNode.getName() + "] Generated LinkedSQL nodes are not yet supported");
                    select = new DynamicLinkedSQLSelect(pivotNode, eLinkedSQL, generatorName);
                }
                else {
                    select = new LinkedSQLSelect(pivotNode, eLinkedSQL);
                }               
            }
            // Emtpy.
            else {
                // XXX: Need to understand the default.
                // Currently we will use an empty select node.
                log.info("[" + pivotNode.getName() + "] Empty pivot node");
                select = new EmptyJoinSelect(pivotNode);
            }
        }
        catch (Exception e) {
            throw new SystemException("Problem create Select pivotNode: " + pivotNode.getName() + ", error: " + e.getMessage(), e);
        }
        
        return select;
        
        
    }
    
}
