/*
 * Created on 06-Jul-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.transformation.common.config;

import java.util.Hashtable;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.Util;
import uk.gov.dca.transformation.common.web_delegator.impl.WebServiceObject;

/**
 * @author Amjad Khan
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class ConfigXmlProcessor {
    private static final Log log = LogFactory.getLog(ConfigXmlProcessor.class);
    private static final String XMLFILE = "caseman-config.xml";
    private HashMap objHashRules;
    private Hashtable jndiEnvs;
    private String userName;
    private String password;
    private String endPoint;
    private String serviceName;
    private String webServiceName;
    
    public ConfigXmlProcessor() throws SystemException {
        objHashRules = new HashMap();
        jndiEnvs = new Hashtable();
        populate();
    }
    
    public Map getWebServiceObjects() {
        return objHashRules;
    }
    
    public Hashtable getJndiMap() {
        return jndiEnvs;
    }
    
    private void populate() throws SystemException  {
        processMainRootElements(getXMLFile().getRootElement().getChildren());
    }
    
    public Document getXMLFile() throws SystemException {
        SAXBuilder builder = new SAXBuilder();    
        try {       
            return builder.build(Util.getInputSource(XMLFILE, this));  
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

            if(name.equals("Init")) {
                processInit(current.getChildren());
            } else if(name.equals("ApplicationService")) {
                processApplication(current.getChildren());
            }
        }    
    }

    private void processInit(List elements) throws SystemException {             
        String naming = null;
        String provider = null;
        String pkgs = null;
        
        try {  
            for(Iterator i = elements.iterator(); i.hasNext();) {
                Element current = (Element)i.next();
                String name = current.getName();
                
                if (name.equals("UserName")) {
                    userName = current.getText();               
                } else if (name.equals("Password")) {              
                    password = current.getText();             
                } else if (name.equals("EndPoint")) {              
                    endPoint = current.getText();             
                } else if (name.equals("java.naming.factory.initial")) {              
                    naming = current.getText();             
                } else if (name.equals("java.naming.provider.url")) {              
                    provider = current.getText();             
                } else if (name.equals("java.naming.factory.url.pkgs")) {              
                    pkgs = current.getText();             
                }
            }
            jndiEnvs.put("java.naming.factory.initial", naming);
            jndiEnvs.put("java.naming.provider.url", provider);
            jndiEnvs.put("java.naming.factory.url.pkgs", pkgs);
        } catch (Exception e) {
            log.debug("Error in processInit = " + e.getMessage(), e);  
            throw new SystemException("Error in processInit = " + e.getMessage(), e);
        }  
    }
    
    private void processApplication(List elements) throws SystemException {       
        try {  
            for(Iterator i = elements.iterator(); i.hasNext();) {
                Element current = (Element)i.next();
                String name = current.getName();
                
                if (name.equals("Name")) {
                    serviceName = current.getText();               
                } else if (name.equals("WebService")) {              
                    webServiceName = current.getText();             
                } else if (name.equals("Method")) {              
                    processMethod(current.getChildren(), setUpObjectType());            
                }
            }          
        } catch (Exception e) {
            log.debug("Error in processApplication = " + e.getMessage(), e);  
            throw new SystemException("Error in processApplication = " + e.getMessage(), e);
        }  
    }
    
    private WebServiceObject setUpObjectType() {
        WebServiceObject objType = new WebServiceObject();
        objType.setUserName(userName);
        objType.setPassword(password);
        objType.setServiceEndPoint(endPoint);
        objType.setServiceName(serviceName);
        objType.setWebServiceName(webServiceName);
        return objType;
    }
    
    private void processMethod(List elements, WebServiceObject objType) throws SystemException {       
        try {  
            for(Iterator i = elements.iterator(); i.hasNext();) {
                Element current = (Element)i.next();
                String name = current.getName();
                
                if (name.equals("Name")) {
                    objType.setMethodName(current.getText());               
                } else if (name.equals("WebServiceName")) {              
                    objType.setWebServiceMethodName(current.getText());             
                }
            }
            //Add object
            addWebServiceObject(objType);
        } catch (Exception e) {
            log.debug("Error in processMethod = " + e.getMessage(), e);  
            throw new SystemException("Error in processMethod = " + e.getMessage(), e);
        }  
    }
    
    private void addWebServiceObject(WebServiceObject objType) {
        if(objType.getMethodName() != null && objType.getPassword() != null && objType.getServiceEndPoint() != null
           && objType.getServiceName() != null && objType.getUserName() != null && objType.getWebServiceMethodName() != null 
           && objType.getWebServiceName() != null) {
            objHashRules.put(objType.getServiceName()+objType.getMethodName(), objType);
        } else {
            System.out.println("\n\n\n\n\n\n\n\n FAILED TO ADD \n\n\n\n\n\n");
        }
    }
    
    
    
}
