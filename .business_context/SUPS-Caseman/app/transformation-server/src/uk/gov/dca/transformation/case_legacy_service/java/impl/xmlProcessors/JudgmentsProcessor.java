/*
 * Created on 18-Jul-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.transformation.case_legacy_service.java.impl.xmlProcessors;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.transformation.case_legacy_service.java.IServiceType;
import uk.gov.dca.transformation.case_legacy_service.java.IXMLProcessor;

/**
 * @author Troy Baines
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class JudgmentsProcessor extends AbstractXMLProcessor {
    private static final Log log = LogFactory.getLog(JudgmentsProcessor.class);
    private static final String START_TAG = "<params><param name=\"JudgmentSequence\">";
    private static final String END_TAG = "</param></params>";
    
    public JudgmentsProcessor(IServiceType serviceType) {
        super(serviceType);
    }
    
    public void xmlProcessor(List params, Map keySeq, Document doc) throws SystemException {
    	log.info("Start XML Processor of type" + this.getClass().getName());
    	if(params.size() > 0) {
	    	generateDefendantID(doc);
	    	
	    	StringBuffer strBuf = new StringBuffer();
	        addStartTag(strBuf);
	        for(Iterator i = params.iterator(); i.hasNext();) {
	            Object currentObj = (Object) i.next();
	            if(currentObj instanceof Element) {
	                strBuf.append(getXMLString((Element)currentObj));
	            }
	        }
	         
	        addEndTag(strBuf);         
	        Document returnDoc = callService(strBuf.toString());
	        
	        addSeqKeys(returnDoc, keySeq, IXMLProcessor.JUDGEMENT_KEY, "//Judgments//Judgment//JudgSeq", "//Judgments//Judgment//JudgSupsSequence"); 
	        addSeqKeys(returnDoc, keySeq, IXMLProcessor.VARIATION_KEY, "//Judgments//Judgment//Variations//Variation//VarSeq", "//Judgments//Judgment//Variations//Variation//VarSupsSequence"); 
    	}
        log.info("End XML Processor of type" + this.getClass().getName());
     }
     
     private void addStartTag(StringBuffer strBuf) {
         strBuf.append(START_TAG);
     }
     
     private void addEndTag(StringBuffer strBuf) {
         strBuf.append(END_TAG);
     }
     
     private void generateDefendantID(Document doc)
		throws SystemException
				
	       		
				{		
		//DefendantID - Use AgainstPartyNo IF AgainstPartyRoleCode = DEFENDANT
	    //		ELSE use CasePartyNo of first Defendant from InfavourParties
        
    	Element JudgmentElement = null;
    	List JudgmentList = null;
    	Element Judgment = null;
    	Element Party = null;
    	String AgainstPartyRoleCode = null;
    	String AgainstPartyNumber = null;
    	Element DefendantIDElement = null;
    	Element InfavourPartiesElement = null;
    	List InfavourPartiesList = null;
    	String PartyRoleCode = null;
    	String PartyNumber = null;
    	Element CaseForTransfer = null;
    	Element JudgmentForElement = null;
    	Element InFavourParty = null;
    	
    	CaseForTransfer = doc.getRootElement();
    	try {
    	
    		JudgmentList = (XPath.selectNodes(
    						CaseForTransfer,
							"//Judgment"));

    		for(Iterator i = JudgmentList.iterator(); i.hasNext();) {
    		    			Judgment = (Element) i.next();
    		    		
    		    			AgainstPartyRoleCode = ((Element)(XPath.selectSingleNode(
    		    					Judgment, 
				    				"AgainstPartyRoleCode"))).getText();
			
    		    			if (AgainstPartyRoleCode.equals("DEFENDANT")) {
	    	    					
    		    				AgainstPartyNumber = ((Element)(XPath.selectSingleNode(
    		    						Judgment, 
	    	    					"AgainstPartyNumber"))).getText();
	    	        			
    		    				DefendantIDElement = ((Element)(XPath.selectSingleNode(
    		    						Judgment,
										"DefendantID")));
    		    				DefendantIDElement.setText(AgainstPartyNumber);
    		    			}
    	        		
    		    			else{
    		    				InfavourPartiesElement = Judgment.getChild("InFavourParties");
    		    				InfavourPartiesList = InfavourPartiesElement.getChildren();
    			
    		    				for(Iterator x = InfavourPartiesList.iterator(); x.hasNext();) {
    		    					Party = (Element) x.next();
    		    		
    		    					PartyRoleCode = ((Element)(XPath.selectSingleNode(
    		    									Party, 
    		    									"PartyRoleCode"))).getText();
    		    			
    		    					if (PartyRoleCode.equals("DEFENDANT")) {	
    		    						PartyNumber = ((Element)(XPath.selectSingleNode(
    	                							Judgment, 
    	    										"AgainstPartyNumber"))).getText();
    	    						
    		    						DefendantIDElement = ((Element)(XPath.selectSingleNode(
    	    		    						Judgment,
    											"DefendantID")));
    		    						DefendantIDElement.setText(PartyNumber);	
    		    						break;
    		    				
    		    					}
    		    				}		
    		    			}
    		    			
    		    			// Set Judgment_For by selecting first InFavourParty
    		    			
    		    			InfavourPartiesElement = Judgment.getChild("InFavourParties");
		    				InfavourPartiesList = InfavourPartiesElement.getChildren();
		    				
		    				InFavourParty = (Element)(InfavourPartiesList.get(0));
		    				
		    				PartyRoleCode = ((Element)(XPath.selectSingleNode(
		    						InFavourParty, 
									"PartyRoleCode"))).getText();
		    						    					    				
		    				JudgmentForElement = ((Element)(XPath.selectSingleNode(
		    						Judgment,
									"JudgmentFor")));
		    				
		    				JudgmentForElement.setText(PartyRoleCode);	
    		}
   		
    	} catch (JDOMException e) {
			throw new SystemException("Wrapped JDOM Exception caught in method generateDefendantID", e);
			}
		}
       
}
