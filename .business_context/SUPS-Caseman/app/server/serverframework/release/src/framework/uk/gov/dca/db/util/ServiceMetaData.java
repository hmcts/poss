/*
 * Created on 20-Apr-2005
 *
 */
package uk.gov.dca.db.util;

/**
 * @author Michael Barker
 *
 */
public class ServiceMetaData
{
    private String packageName;
    private String beanName;
    
    public ServiceMetaData(String packageName, String beanName)
    {
        this.beanName = beanName;
        this.packageName = packageName;
    }
    
    public String getEjbName()
    {
        return beanName + "Service";
    }
    
    public String getLocalEjbName()
    {
       return "ejb/" + beanName + "ServiceLocal";
    }
    
    public String getLocalClassName()
    {
        return packageName + "." + beanName + "Service";
    }    
    
    /**
     * @return Returns the localHomeClassName.
     */
    public String getLocalHomeClassName()
    {
        return packageName + "." + beanName + "ServiceLocalHome";
    }

    /**
     * @return Returns the packageName.
     */
    public String getPackageName()
    {
        return packageName;
    }

    /**
     * @return Returns the remoteClassName.
     */
    public String getRemoteClassName()
    {
        return packageName + "." + beanName + "ServiceRemote";
    }

    /**
     * @return Returns the remoteHomeClassName.
     */
    public String getRemoteHomeClassName()
    {
        return packageName + "." + beanName + "ServiceHome";
    }
    
    /**
     * @return Returns the serviceName.
     */
    public String getPortComponentName()
    {
        return beanName + "ServiceServicePort";
    }
    
    public String getEndPointClassName()
    {
        return packageName + "." + beanName + "ServiceService";
    }
    
    public String toString()
    {
        return "Package: " + packageName + ", Bean: " + beanName;
    }

    /**
     * Returns the EJB Link.
     * 
     * @return
     */
    public String getEjbLink()
    {
        return beanName + ".jar#" + beanName + "Service";
    }
    
}
