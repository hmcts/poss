/*
 * Created on 15-Jul-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.transformation.case_legacy_service.java.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.Util;

/**
 * @author Amjad Khan
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class CaseTransferXmlProcessor {
    private static final Log log = LogFactory.getLog(CaseTransferXmlProcessor.class);
    private static final String XMLFILETranfer = "uk/gov/dca/transformation/case_legacy_service/xml/transfer-config.xml";
    private static final String XMLFILENonEventList = "uk/gov/dca/transformation/case_legacy_service/xml/non-legacy-events.xml";
    private ArrayList serviceList;
    private String beanName;
    private String processorName;
    private String orderNo;
    private String methodName;
    private String xpathName;
    private Map nonLegacyEventMap;
    
    public CaseTransferXmlProcessor() throws SystemException {
        serviceList = new ArrayList();
        nonLegacyEventMap = (Map) new Hashtable();
        populate();
    }
    
    public List getConfigObjects() {
        return serviceList;
    }
    
    public Map getNonLegacyEventMap() {
        return nonLegacyEventMap;
    }
    
    private void populate() throws SystemException  {
        processMainRootElements(getXMLFile(XMLFILETranfer).getRootElement().getChildren());
        populateNonEventMap();
    }
    
    private void populateNonEventMap() throws SystemException {
        String valLegacyEventID = null;
        String valSupsEventID = null;
        try {
            List nonEventList = XPath.selectNodes(getXMLFile(XMLFILENonEventList), "//NonLegacyEvents//NonLegacyEvent");

            for(Iterator i = nonEventList.iterator(); i.hasNext();) {
                List nonEventElementList = ((Element) i.next()).getChildren();
                for(Iterator j = nonEventElementList.iterator(); j.hasNext();) {
                    Element nonEventElement = (Element) j.next();
                                                          
                    if (nonEventElement.getName().equals("LegacyEventID")) {
                        valLegacyEventID = nonEventElement.getText();
                    } else if (nonEventElement.getName().equals("SupsEventID")) {
                        valSupsEventID = nonEventElement.getText();
                    }                 
                }
                
                if(valLegacyEventID != null && valSupsEventID != null) {
                    nonLegacyEventMap.put(valSupsEventID, valLegacyEventID);
                }
            }       
        } catch (JDOMException e) {
            log.error("Jdom Exception Error in populateNonEventMap = " + e.getMessage(), e);  
            throw new SystemException("Jdom Exception Error in populateNonEventMap = " + e.getMessage(), e);
        }
    }
    
    public Document getXMLFile(String fileName) throws SystemException {
        SAXBuilder builder = new SAXBuilder();    
        try {       
            return builder.build(Util.getInputSource(fileName, this));  
        } catch(SystemException se) {
            throw se;
    	} catch(Exception e) {          
            log.error("Unable to Load XML", e);
            throw new SystemException("Unable to Load = " + e.getMessage(), e);
        }       
    }
    
    private void processMainRootElements(List elements) throws SystemException {   
        
        for(Iterator i = elements.iterator(); i.hasNext();) {
            Element current = (Element)i.next();
            String name = current.getName();

            if(name.equals("BeanService")) {
                processInit(current.getChildren());
            } 
        }    
    }

    private void processInit(List elements) throws SystemException {       
        try {  
            for(Iterator i = elements.iterator(); i.hasNext();) {
                Element current = (Element)i.next();
                String name = current.getName();
                
                if (name.equals("Name")) {
                    beanName = current.getText();               
                } else if(name.equals("Method")) {
                    processApplication(current.getChildren());
                }
            }
            cleanBeanName();
        } catch (Exception e) {
            log.error("Error in processInit = " + e.getMessage(), e);  
            throw new SystemException("Error in processInit = " + e.getMessage(), e);
        }  
    }
    
    private void processApplication(List elements) throws SystemException {       
        try {  
            for(Iterator i = elements.iterator(); i.hasNext();) {
                Element current = (Element)i.next();
                String name = current.getName();
                
                if (name.equals("Name")) {
                    methodName = current.getText();               
                } else if (name.equals("Xpath")) {              
                    xpathName = current.getText();             
                } else if (name.equals("Processor")) {              
                    processorName = current.getText();
                } else if (name.equals("OrderNo")) {              
                    orderNo = current.getText();
                }
            } 
            addBeanServiceObject();     
        } catch (Exception e) {
            log.error("Error in processApplication = " + e.getMessage(), e);  
            throw new SystemException("Error in processApplication = " + e.getMessage(), e);
        }  
    }

    private void addBeanServiceObject() {
       if(beanName != null && methodName != null && processorName != null &&
          xpathName != null) {
           
           ServiceType serviceT = createServiceType();
           
           if(checkOrderNo(orderNo)) {
               serviceList.add(Integer.parseInt(serviceT.getOrderNo()), serviceT);
           } else {
               serviceList.add(serviceT);
           }
       } else {
            log.error("\n FAILED TO ADD Service Object in " + this.getClass().getName() + "\n ");
       }
       cleanParamNames();
    }
    
    private boolean checkOrderNo(String orderNo) {
        return !(orderNo != null && orderNo.equals(""));
    }
    
    private ServiceType createServiceType() {
        ServiceType serviceT = new ServiceType();
        serviceT.setBeanServiceName(beanName);
        serviceT.setMethodName(methodName);
        serviceT.setCustomProcessorName(processorName);
        serviceT.setOrderNo(orderNo);
        serviceT.setXpath(xpathName);
        return serviceT;
    }
    
    private void cleanParamNames() {
        processorName = null;
        orderNo = null;
        methodName = null;
        xpathName = null;       
    }
    
    private void cleanBeanName() {
        beanName = null;       
    }
      
}
