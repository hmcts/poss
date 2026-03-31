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
 * @author Amjad Khan
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class TestProcessor extends AbstractXMLProcessor {
    private static final Log log = LogFactory.getLog(TestProcessor.class);
    private static final String START_TAG = "<params><param name=\"caseNumber\">"; //<Obligations>";
    private static final String END_TAG = "</param></params>";
    private static final String DOC_STRING = "<Params><Test><SupsSeq>1</SupsSeq><LegacySeq>11</LegacySeq></Test>" 
    										+"<Test><SupsSeq>2</SupsSeq><LegacySeq>22</LegacySeq></Test>"
    										+"<Test><SupsSeq>3</SupsSeq><LegacySeq>33</LegacySeq></Test>"
    										+"<Test><SupsSeq>4</SupsSeq><LegacySeq>44</LegacySeq></Test>"
    										+"<Test><SupsSeq>5</SupsSeq><LegacySeq>55</LegacySeq></Test>"
    										+"<Test><SupsSeq>6</SupsSeq><LegacySeq>66</LegacySeq></Test>"
    										+"<Test><SupsSeq>7</SupsSeq><LegacySeq>77</LegacySeq></Test>"
    										+"<Test><SupsSeq>8</SupsSeq><LegacySeq>88</LegacySeq></Test></Params>";
    										
    public TestProcessor(IServiceType serviceType) {
        super(serviceType);
    }
    
    public void xmlProcessor(List params, Map keySeq, Document doc) throws SystemException {
        log.info("Start XML Processor of type" + this.getClass().getName());
        StringBuffer strBuf = new StringBuffer();

        for(Iterator i = params.iterator(); i.hasNext();) {
            Object currentObj = (Object) i.next();
            if(currentObj instanceof Element) {
                strBuf.append(getXMLString((Element)currentObj));
            }
        }
        
        callService(strBuf.toString());
        
        callService(replaceKeys(strBuf.toString(), keySeq, doc, IXMLProcessor.TEST_KEY, "<SupsSeq>", "//Test//SupsSeq"));
        
        addSeqKeys(callService(strBuf.toString()), keySeq, IXMLProcessor.JUDGEMENT_KEY, "//Params//Test//SupsSeq", "//Params//Test//LegacySeq");             
        
        addSeqKeys(callService(replaceKeys(strBuf.toString(), keySeq, doc, IXMLProcessor.TEST_KEY, "<SupsSeq>", "//Test//SupsSeq")), keySeq, IXMLProcessor.JUDGEMENT_KEY, "//Params//Test//SupsSeq", "//Params//Test//LegacySeq");  
        log.info("End XML Processor of type" + this.getClass().getName());
    }
    
    private void addStartTag(StringBuffer strBuf) {
        strBuf.append(START_TAG);
    }
    
    private void addEndTag(StringBuffer strBuf) {
        strBuf.append(END_TAG);
    }
    
}
