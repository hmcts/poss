/*
 * Created on 28-Jul-2004
 *
 */
package uk.gov.dca.db.impl;

import java.io.File;
import java.io.IOException;
import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.Attribute;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.xpath.XPath;


/**
 * @author Michael Barker
 *
 */
public class SUPSBeanGenerator extends BeanGenerator
{  
    /**
     * @param headerFilename
     * @param footerFilename
     * @param webMethodFilename
     * @param localMethodFilename
     */
    public SUPSBeanGenerator(String header, String footer, String webMethod, String localMethod)
    {
    	super(header, footer, webMethod, localMethod); 
    }
    
    private final static MessageFormat SERVICE_ERROR = 
        new MessageFormat("{0} ''{1}'' in file {2} does not match {3} as defined previously");
    

    /**
     * Loops over all services defined in the project root directory, creating 1 bean per service.
     * The projectConfigRootDir and projectConfigPackage make it possible to share a single project config
     * amoungst multiple projects.
     * @param packageName
     * @param outputDir
     * @param rootDir
     * @param projectConfig
     * @param frameworkConfig
     * @param projectConfigRootDir
     * @param projectConfigPackage
     * @throws GeneratorException
     * @throws JDOMException
     * @throws IOException
     */
    public void generate(String packageName, 
			 			String outputDir,
						String rootDir,
						String wsConfigDestDir,
						String projectConfig,
						String frameworkConfig,
						String projectConfigPackage)
    	throws GeneratorException, JDOMException, IOException
    {
        try
        {            
        	Map services = new HashMap();
        	
        	String projectRoot = packageName.replace('.', '/');
        	String projectConfigRoot = projectConfigPackage.replace('.', '/');
        	
        	String fullProjectRoot = rootDir + "/" + projectRoot;
        	
        	System.out.println("projectRoot=" + projectRoot);
        	System.out.println("fullProjectRoot=" + fullProjectRoot);
        	System.out.println("projectConfigRoot=" + projectConfigRoot);
        	
        	File projectRootDir = getDir( fullProjectRoot );
        	String[] sServiceDirectories = projectRootDir.list();
        	
        	for ( int i = 0; i < sServiceDirectories.length; i++ )
        	{
        		String sServiceDirName = sServiceDirectories[i];
            	System.out.println("sServiceDirName=" + sServiceDirName);
            	
        		if ( sServiceDirName.endsWith("_service") ) {
        			// Get the service name. There is a rule naming for all service directories:
        			//     <service name>_service - all in lower case.
        			// Here we extract the service name and capitalise the first letter (an arbitray rule).
        			String serviceName = sServiceDirName.substring(0, sServiceDirName.indexOf("_service"));
        			if ( serviceName == null || serviceName.length() == 0 ) {
        				throw new GeneratorException("Null or zero length service name provided. Directory: "+sServiceDirName);
        			}
        			String sFirstLetter = serviceName.substring(0,1).toUpperCase(); 
        			if ( serviceName.length() > 1 ) {
        				serviceName = sFirstLetter + serviceName.substring(1).toLowerCase();
        				serviceName = capitaliseOnUnderscores(serviceName);
        			}
        			else
        				serviceName = sFirstLetter;
        			
        			String sServiceDir = fullProjectRoot + "/" + sServiceDirName;
        			File serviceDir = getDir(sServiceDir);
        			
                    // First get the methods and check to see if any have changed since this was last run --
        			// if not exit loop and go to next service.
        			String sMethodsDir = sServiceDir + "/methods";
        			File methodsDir = getDir(sMethodsDir);
                    File[] arrMethodFiles = methodsDir.listFiles();  
                    long latestFileTimestamp = 0; 
                    long currentFileTimestamp = 0;
                    for (int j=0; j < arrMethodFiles.length ; j++)
                    {
                    	
                       currentFileTimestamp = arrMethodFiles[j].lastModified();    	
                       if (currentFileTimestamp > latestFileTimestamp){
                         latestFileTimestamp = currentFileTimestamp;
                       }
                    }
                    
                    // Get the timestamp for the generated file - exit if newer
                    this.outputDir=new File(outputDir);
                    File dir = createPackageDir(packageName);
                    File serviceBeanFile = new File(dir, serviceName + "Bean.java");
                    long beanFileTimestamp = 0;
				    if (serviceBeanFile.exists()){
                      beanFileTimestamp = serviceBeanFile.lastModified();
				    }
                    if (latestFileTimestamp < beanFileTimestamp) {
                    	System.out.println("Source not changed for service: " + serviceName);
                    	continue;
                    }
                    
                    System.out.println("Found new source, generating service: " + serviceName);
                    
        			ServiceDef service = new ServiceDef();
                    service.setServiceName(serviceName);
                    service.setFrameworkConfig(frameworkConfig);
                    service.setProjectConfig( projectConfigRoot + "/" + projectConfig);
                    service.setPackageName(packageName);
                    service.setProjectSourcePackageName(projectRoot);
                    service.setFullProjectSourceRoot(fullProjectRoot + "/" + sServiceDirName); 
                    service.setSourcePackageName(projectRoot + "/" + sServiceDirName); 
        			defineServiceMethods( projectRoot + "/" + sServiceDirName + "/methods", service, arrMethodFiles );
        			services.put(service.getServiceName(), service);	
        		}
        	}
        	
            for (Iterator i = services.values().iterator(); i.hasNext();)
            {
                ServiceDef service = (ServiceDef) i.next();
                Properties beanProps = service.getBeanProps();
                Properties[] methodProps = service.getMethodProps();
                generate(packageName, outputDir, wsConfigDestDir, beanProps, methodProps);
            }
            
        }
        catch (Exception e)
        {
            throw new GeneratorException(e);
        }
        finally
        {
            
        }
    }
    
    private void defineServiceMethods( String methodsURIRoot, ServiceDef service, File[] methodFiles )
    	throws IOException, JDOMException, GeneratorException
	{
    	SAXBuilder builder = new SAXBuilder();
          
        for (int i = 0; i < methodFiles.length; i++)
        {
        	// get the method name. This is defined by the filename.
            File methodFile = methodFiles[i];
            String sMethodFilename = methodFile.getName();
            
            System.out.println("sMethodFilename=" + sMethodFilename);
        	
            if ( sMethodFilename.endsWith(".xml") ) 
            {
            	String methodName = sMethodFilename.substring(0, sMethodFilename.indexOf(".xml"));
            	methodName = capitaliseOnUnderscores(methodName);
            	
            	// get the security roles.
            	Document methodDoc = builder.build(methodFile);
            	String roles = getRoles(methodDoc);
            	String transactionType = getTransactionType(methodDoc);
            	String visibility = getMethodVisibility(methodDoc);
            	
            	// now define the method                
            	MethodDef method = new MethodDef();
            	method.setMethodFile(methodsURIRoot + "/" + sMethodFilename);
            	method.setRoles(roles);
            	method.setName(methodName);
            	method.setTransactionType(transactionType);
            	method.setVisibility(visibility);
            	
            	service.addMethod(method);
            }
        }
	}
    
    static class ServiceDef
    {
        String serviceName;
        String packageName;
        String projectConfig;
        String frameworkConfig;
        String sourcePackageName;
        String projectSourcePackageName;
        String fullProjectSourceRoot;
        
        public String getSourcePackageName() {
        	return sourcePackageName;
        }
        
        public void setSourcePackageName(String sourcePackageName) {
        	this.sourcePackageName = sourcePackageName;
        }
        
        public String getProjectSourcePackageName() {
        	return projectSourcePackageName;
        }
        
        public void setProjectSourcePackageName(String projectSourcePackageName) {
        	this.projectSourcePackageName = projectSourcePackageName;
        }
        
        /**
         * @return Returns the packageName.
         */
        public String getPackageName()
        {
            return packageName;
        }
        /**
         * @param packageName The packageName to set.
         */
        public void setPackageName(String packageName)
        {
            this.packageName = packageName;
        }
        Map methods = new HashMap();
        
        /**
         * @return Returns the projectConfig.
         */
        public String getProjectConfig()
        {
            return projectConfig;
        }
        /**
         * @param configFile The projectConfig to set.
         */
        public void setProjectConfig(String projectConfig)
        {
            this.projectConfig = projectConfig;
        }
        /**
         * @return Returns the configFile.
         */
        public String getFrameworkConfig()
        {
            return frameworkConfig;
        }
        /**
         * @param configFile The configFile to set.
         */
        public void setFrameworkConfig(String frameworkConfig)
        {
            this.frameworkConfig = frameworkConfig;
        }
        
        /**
         * @param fullProjectSourceRoot the fullProjectSourceRoot to set
         */
        public void setFullProjectSourceRoot(String fullProjectSourceRoot)
        {
            this.fullProjectSourceRoot = fullProjectSourceRoot;
        }
        
        /**
         * @return Returns the fullProjectRoot
         */
        public String getFullProjectSourceRoot()
        {
        	return this.fullProjectSourceRoot;
        }
        /**
         * @return Returns the serviceName.
         */
        public String getServiceName()
        {
            return serviceName;
        }
        /**
         * @param serviceName The serviceName to set.
         */
        public void setServiceName(String serviceName)
        {
            this.serviceName = serviceName;
        }

        /**
         * @param methods The methods to set.
         */
        public void addMethod(MethodDef method)
        {
            methods.put(method.getName(), method);
        }
        
        public Properties getBeanProps()
        {
            Properties p = new Properties();
            p.setProperty("service.name", serviceName);
            p.setProperty("service.package", packageName);
            p.setProperty("service.sourcepackage", sourcePackageName);
            p.setProperty("service.project_config", projectConfig);
            p.setProperty("service.framework_config", frameworkConfig);
            p.setProperty("service.project_root_package", projectSourcePackageName);
            p.setProperty("service.source_root", fullProjectSourceRoot);
            StringBuffer sb = new StringBuffer();
            for (Iterator i = methods.values().iterator(); i.hasNext();)
            {
                MethodDef method = (MethodDef) i.next();
                sb.append("\"" + method.getMethodFile() + "\"");
                if (i.hasNext())
                {
                    sb.append(",");
                }
            }
            p.setProperty("service.methods", sb.toString());
            return p;
        }
        
        public Properties[] getMethodProps()
        {
            Properties[] methodProps = new Properties[methods.size()];
            int j = 0;
            for (Iterator i = methods.values().iterator(); i.hasNext(); j++)
            {
                methodProps[j] = ((MethodDef) i.next()).getProps();
            }
            return methodProps;
        }
    }
    
    static class MethodDef
    {
    	private String roles;
        private String methodFile;
        private String name;
        private String transactionType;
        private String visibility;
        
        public String getName()
        {
            return name;
        }
        
        public void setName(String name)
        {
            this.name = name;
        }
        
        public void setTransactionType(String transactionType) {
        	this.transactionType = transactionType;
        }
        
        public String getVisibility() {
        	return visibility;
        }
        
        public void setVisibility(String visibility) {
        	this.visibility = visibility;
        }
        
        public String getTransactionType() {
        	return transactionType;
        }
        
        public void setRoles(String roles)
        {
            this.roles = roles;
        }
        
        public String getRoles()
        {
            return roles;
        }
        
        public String getMethodFile()
        {
            return methodFile;
        }
        
        public void setMethodFile(String methodFile)
        {
            this.methodFile = methodFile;
        }
        
        public Properties getProps()
        {
            Properties p = new Properties();
            p.setProperty("method.name", name);
            p.setProperty("method.roles", roles);
            p.setProperty("method.transaction.type", transactionType);
            p.setProperty(VISIBILITY_PROPERTY, visibility);
            return p;
        }
    }
    
    public String getRoles(Document methodDoc) throws JDOMException, GeneratorException
    {
        Element e = (Element) XPath.selectSingleNode(methodDoc.getRootElement(), "//Security");
        if ( e == null ) {
        	throw new GeneratorException("No security role defined for method");
        }
        return e.getAttributeValue("roles");
    }
    
    public String getTransactionType(Document methodDoc) throws JDOMException, GeneratorException {
    	Element e = (Element) XPath.selectSingleNode(methodDoc.getRootElement(), "//Transaction");
        if ( e == null ) {
        	// if the transaction node is not specified then default the transaction type to "Required"
        	return "Required";
        }
        return e.getAttributeValue("type");
    }
    

    public String getMethodVisibility(Document methodDoc) throws JDOMException, GeneratorException {
    	Attribute e = (Attribute) XPath.selectSingleNode(methodDoc, "/service-method/@visibility");
        if ( e == null ) {
        	// if the visibility node is not specified then default the transaction type to "Required"
        	return LOCAL_AND_REMOTE_VISIBILITY;
        }
        String visibility = e.getValue();
        
        if ( LOCAL_AND_REMOTE_VISIBILITY.compareToIgnoreCase(visibility) != 0 &&
        		LOCAL_VISIBILITY.compareToIgnoreCase(visibility) != 0) 
        {
        	throw new GeneratorException("Invalid value for <service-method> visibility attribute: "+visibility);
        }
        
        return visibility;
    }
    
    // Helper method to remove any underscores and convert the following letter to a capital
    // Input will be a service or method name string.
    private String capitaliseOnUnderscores(String sName)
    {
    	String sReturn = "";
    	
    	// length must be minimum 2 chars eg. _a
    	if ( sName != null && sName.length() >= 2) 
    	{
    		String[] arrWords = sName.split("_");
    		
    		sReturn = arrWords[0];
    		for ( int i = 0; i < arrWords.length-1; i++)
    		{
    			String sWord = arrWords[i+1];
    			sReturn += sWord.substring(0,1).toUpperCase() + sWord.substring(1);
    		}
    	}
    	else sReturn = sName;
    	
    	return sReturn;
    }
  
}
