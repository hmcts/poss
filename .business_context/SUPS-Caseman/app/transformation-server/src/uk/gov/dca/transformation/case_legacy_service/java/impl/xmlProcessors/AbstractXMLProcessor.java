/*
 * Created on 18-Jul-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.transformation.case_legacy_service.java.impl.xmlProcessors;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.transformation.case_legacy_service.java.IServiceType;
import uk.gov.dca.transformation.case_legacy_service.java.IXMLProcessor;

/**
 * @author Amjad Khan
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public abstract class AbstractXMLProcessor implements IXMLProcessor{
    private static final Log log = LogFactory.getLog(AbstractXMLProcessor.class);
    private final AbstractSupsServiceProxy proxy;
    private final XMLOutputter out;
    private final XMLOutputter outPretty;
    protected IServiceType serviceType;
       
    public AbstractXMLProcessor(IServiceType serviceType) {
        this.serviceType = serviceType;
        proxy = new SupsLocalServiceProxy();
        out = new XMLOutputter(Format.getCompactFormat());
        outPretty = new XMLOutputter(Format.getPrettyFormat());
    }
    
    public Document callService(String params) throws SystemException {
        //Should change info To debug
        log.info("Call Service with Params of \n" + params);
        try {
            Document doc = proxy.getJDOM(serviceType.getBeanServiceName(), serviceType.getMethodName(), params);
            log.info("Call Service returned \n" + getXMLString(doc));
            return doc;
        } catch (BusinessException be) {
            log.error("Business Exception caught in Call Service method of AbstractXMLProcessor");
            throw new SystemException("Wrapping Business Exception caught in Call Service method of AbstractXMLProcessor /n" + be.getMessage(), be);
        } catch (SystemException se) {
            log.error("Service Exception caught in Call Service method of AbstractXMLProcessor");
            throw se;
        } 
    }
    
    public String getXMLString(Document e) {
        return out.outputString(e.getRootElement());
    }
    
    public String getXMLPrettyString(Document e) {
        return outPretty.outputString(e.getRootElement());
    }
    
    public String getXMLString(Element e) {
        return out.outputString(e);
    }
    
    public String getXMLString(List e) {
        return out.outputString(e);
    }
    
    public String getXMLPrettyString(Element e) {
        return outPretty.outputString(e);
    }
    
    public String getXMLPrettyString(List e) {
        return outPretty.outputString(e);
    }
    
    public Document buildDoc(String xml) throws SystemException {
        SAXBuilder b = new SAXBuilder();
        try {
            return b.build(new StringReader(xml));
        } catch (JDOMException je) {
            log.error("JDOM Exception caught in buildDoc method of AbstractXMLProcessor");
            throw new SystemException("Wrapping JDOM Exception caught in buildDoc method of AbstractXMLProcessor /n" + je.getMessage(), je);
        } catch (IOException ie) {
            log.error("IO Exception caught in buildDoc method of AbstractXMLProcessor");
            throw new SystemException("Wrapping IO Exception caught in buildDoc method of AbstractXMLProcessor /n" + ie.getMessage(), ie);
        }
    }
    
    public String formatXMLInToPrettyFormat(String xmlStr) throws SystemException
    {
    	SAXBuilder b = new SAXBuilder();
    	Document d;
        try {
            d = b.build(new StringReader(xmlStr));
        	StringWriter outStr = new StringWriter();
        	outPretty.output(d, outStr);
        } catch (JDOMException je) {
            log.error("JDOM Exception caught in formatXML method of AbstractXMLProcessor");
            throw new SystemException("Wrapping JDOM Exception caught in formatXML method of AbstractXMLProcessor /n" + je.getMessage(), je);
        } catch (IOException ie) {
            log.error("IO Exception caught in formatXML method of AbstractXMLProcessor");
            throw new SystemException("Wrapping IO Exception caught in formatXML method of AbstractXMLProcessor /n" + ie.getMessage(), ie);
        }

    	return out.toString();
    }
    
    public boolean isEmpty(String s)
    {
        return s == null || "".equals(s);
    }
    
    public void addXMLTagValues(StringBuffer strBuf, String val, String constant) {
        addXMLTag(strBuf, constant, false);
        strBuf.append(val);
        addXMLTag(strBuf, constant, true);
    }
    
    public void addXMLTag(StringBuffer strBuf, String constant, boolean endTag) {
        strBuf.append(STARTTAG);
        if(endTag) 
            strBuf.append(SLASH);
        strBuf.append(constant);
        strBuf.append(ENDTAG);
    }
    
    public String replaceKeys(String xml, Map keySeq, Document doc, String key, String xmlNodeKey, String xpathString) throws SystemException {
        Map mapKey = (Map) keySeq.get(key);        
        List paramSupsKeys;
        
        try {            
            paramSupsKeys = XPath.newInstance(xpathString).selectNodes(doc);

            for(int i = 0; i < paramSupsKeys.size(); i++) {
                Element currentObj = (Element) paramSupsKeys.get(i);               
                if(currentObj.getText() != null && mapKey.containsKey(currentObj.getText())) {
                	xml = xml.replaceAll(xmlNodeKey+(currentObj).getText(), xmlNodeKey+(String)mapKey.get(currentObj.getText()));
                }
            } 
            return xml;

        } catch (JDOMException e) {
            log.error("JDOM Exception caught in replaceKeys method /n ");
            throw new SystemException("Wrapping JDOM Exception caught in replaceKeys method /n" + e.getMessage(), e);
        } 
    }
          
    public void addSeqKeys(Document doc, Map keySeq, String key, String xpathSupsKey, String xpathLegacyKey) throws SystemException {
        List paramSupsKeys;
        List paramLegacyKeys;
        Map mapKey = (Map) keySeq.get(key);
        
        try {
            paramSupsKeys = XPath.newInstance(xpathSupsKey).selectNodes(doc);
            paramLegacyKeys = XPath.newInstance(xpathLegacyKey).selectNodes(doc);
            
            if(paramSupsKeys.size() == paramSupsKeys.size())
            {     
    	        for(int i = 0; i < paramSupsKeys.size(); i++) {
    	            Object currentObj = (Object) paramLegacyKeys.get(i);
    	            Object newObj = (Object) paramSupsKeys.get(i);
    	            
    	            if(currentObj instanceof Element && newObj instanceof Element) {
    	                mapKey.put(((Element) currentObj).getText(), ((Element) newObj).getText());
    	            }
    	        }	
            } else {
                throw new SystemException("Keys do not match in size in addSeqKeys");
            }
        } catch (JDOMException e) {
            log.error("JDOM Exception caught in addKeys method /n ");
            throw new SystemException("Wrapping JDOM Exception caught in addKeys method /n" + e.getMessage(), e);
        }       
    }
    
    public void removeLocalCodedParties(Element ele, String xpathCodedPartyPath) throws SystemException {
        try {
            List paramCodedParty = XPath.newInstance(xpathCodedPartyPath).selectNodes(ele);
           
            for(Iterator i = paramCodedParty.iterator(); i.hasNext();) {
                Element codedPartyElement = (Element) i.next();
                String codedPartyStr = codedPartyElement.getText();
                if(codedPartyStr != null && (!isEmpty(codedPartyStr)) && (Integer.parseInt(codedPartyStr) < 1500 || Integer.parseInt(codedPartyStr) > 2000)) {
                    codedPartyElement.setText("");
                }
            }
            
        } catch (JDOMException e) {
            log.error("JDOM Exception caught in removeLocalCodedParties method /n ");
            throw new SystemException("Wrapping JDOM Exception caught in removeLocalCodedParties method /n" + e.getMessage(), e);
        }
    }
    
}
