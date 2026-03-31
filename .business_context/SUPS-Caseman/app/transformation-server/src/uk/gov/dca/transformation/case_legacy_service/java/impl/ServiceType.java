/*
 * Created on 15-Jul-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.transformation.case_legacy_service.java.impl;

import java.lang.reflect.InvocationTargetException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.transformation.case_legacy_service.java.IServiceType;
import uk.gov.dca.transformation.case_legacy_service.java.IXMLProcessor;

/**
 * @author Amjad Khan
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class ServiceType implements IServiceType {
	private static final Log log = LogFactory.getLog(ServiceType.class);

    private static final String SERVICETYPES_TAG = "ServicesTypes";
    private static final String SERVICETYPE_TAG = "BeanServiceName"; 
    private static final String METHOD_NAME_TAG = "MethodName";     
    private static final String XPATH_TAG = "Xpath";
    private static final String CUSTOMPROCCESOR_NAME_TAG = "CustomProcessorName";
    private static final String ORDER_NUMBER_TAG = "OrderNumber";
    private static final String SLASH = "/";
    private static final String STARTTAG = "<";
    private static final String ENDTAG = ">";  
    
    private String beanServiceName;
    private String methodName;
    private String xpath;
    private String customProcessorName;
    private String orderNo;
    
    public ServiceType(String beanServiceName, String methodName, String xpath, String customProcessorName, String orderNo) {
        setBeanServiceName(beanServiceName);
        setMethodName(methodName);
        setXpath(xpath);
        setCustomProcessorName(customProcessorName);
        setOrderNo(orderNo);
    }
    
    public ServiceType() {
    }
    
    public void setBeanServiceName(String beanServiceName) {
        this.beanServiceName = beanServiceName;
    }   
    
    public void setMethodName(String methodName) {
        this.methodName = methodName;
    } 
    
    public void setXpath(String xpath) {
        this.xpath = xpath;
    }
    
    public void setCustomProcessorName(String customProcessorName) {
        this.customProcessorName = customProcessorName;
    }
    
    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }
    
    public String getBeanServiceName() {
        return beanServiceName;
    } 
    
    public String getMethodName() {
        return methodName;
    }   
    
    public String getXpath() {
        return xpath;
    } 
    
    public String getCustomProcessorName() {
        return customProcessorName;
    } 
    
    public String getOrderNo() {
        return orderNo;
    }
    
    public IXMLProcessor getProcessor() throws SystemException
    {
        try {
            return ((IXMLProcessor) Class.forName(customProcessorName).getConstructor(new Class[] {IServiceType.class}).newInstance(new Object[] {(IServiceType)this})); 
        } catch (InstantiationException e) {
            log.error("Instantiation Exception caught in getProcessor method of ServiceType");
            throw new SystemException("Instantiation JDOM Exception caught in getProcessor method of ServiceType /n" + e.getMessage(), e);
        } catch (IllegalAccessException e) {
            log.error("IllegalAccess Exception caught in getProcessor method of ServiceType");
            throw new SystemException("Wrapping IllegalAccess Exception caught in getProcessor method of ServiceType /n" + e.getMessage(), e);
        } catch (ClassNotFoundException e) {
            log.error("ClassNotFound Exception caught in getProcessor method of ServiceType");
            throw new SystemException("Wrapping ClassNotFound Exception caught in getProcessor method of ServiceType /n" + e.getMessage(), e);
        }  catch (SecurityException e) {
            log.error("Security Exception caught in getProcessor method of ServiceType");
            throw new SystemException("Wrapping Security Exception caught in getProcessor method of ServiceType /n" + e.getMessage(), e);
        } catch (InvocationTargetException e) {
            log.error("InvocationTarget Exception caught in getProcessor method of ServiceType");
            throw new SystemException("Wrapping InvocationTarget Exception caught in getProcessor method of ServiceType /n" + e.getMessage(), e);
        } catch (NoSuchMethodException e) {
            log.error("NoSuchMethod Exception caught in getProcessor method of ServiceType");
            throw new SystemException("Wrapping NoSuchMethod Exception caught in getProcessor method of ServiceType /n" + e.getMessage(), e);
        }
    }
 
    public boolean equals(Object obj) {
        
        if(obj == this) {
            return true;
        } else if (!(obj instanceof ServiceType)) {
            return false;
        }
        
        ServiceType objType = (ServiceType)obj;
        if(beanServiceName != null && (!beanServiceName.equals(objType.beanServiceName))) {
            return false;         
        }
        if(methodName != null && (!methodName.equals(objType.methodName))) {
            return false;         
        }   
        if(xpath != null && (!xpath.equals(objType.xpath))) {
            return false;         
        } 
        if(customProcessorName != null && (!customProcessorName.equals(objType.customProcessorName))) {
            return false;         
        } 
        if(orderNo != null && (!orderNo.equals(objType.orderNo))) {
            return false;         
        } 
        return true;
    }
    
    public int hashCode() {
        int result = 17;
        if(beanServiceName != null) {
            result = 37 * result + (beanServiceName.hashCode());
        }
        if(methodName != null){
            result = 37 * result + (methodName.hashCode());
        }
        if(xpath != null){
            result = 37 * result + (xpath.hashCode());
        }
        if(customProcessorName != null){
            result = 37 * result + (customProcessorName.hashCode());
        }
        if(orderNo != null){
            result = 37 * result + (orderNo.hashCode());
        }
        return result;
    }    
  
    public String toString() {
        return ("[" + SERVICETYPES_TAG+ " OBJECT = \n"  +
                SERVICETYPE_TAG + " = " + beanServiceName + "," +
                METHOD_NAME_TAG + " = " + methodName + "," +
                XPATH_TAG + " = " + xpath + "," +
                CUSTOMPROCCESOR_NAME_TAG + " = " + customProcessorName + "," +
                ORDER_NUMBER_TAG + " = " + orderNo + " ]");
    }
	
}
