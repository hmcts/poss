/*
 * Created on 28-Jul-2004
 *
 */
package uk.gov.dca.db.impl;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.TreeMap;
import java.util.TreeSet;

import org.apache.tools.ant.Project;
import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.output.XMLOutputter;
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
    
    public void generate(String packageName, 
            String outputDir,
            String rootDir,
            String wsConfigDestDir,
            String projectConfig,
            String frameworkConfig,
            String projectConfigPackage)
            throws GeneratorException, JDOMException, IOException
            {
            generate(packageName, 
                    outputDir,
                    rootDir,
                    wsConfigDestDir,
                    projectConfig,
                    frameworkConfig,
                    projectConfigPackage, true);
    }

    
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
						String projectConfigPackage,
                        boolean compareOldFiles)
    	throws GeneratorException, JDOMException, IOException
    {
        try
        {   
            if(getProject()== null){
                setProject(new Project());
            }
            log("Generating using Framework Config: " + frameworkConfig, Project.MSG_VERBOSE);
        	Map services = new TreeMap();
        	
        	String projectRoot = packageName.replace('.', '/');
        	String projectConfigRoot = projectConfigPackage.replace('.', '/');
        	
        	String fullProjectRoot = rootDir + "/" + projectRoot;
        	
        	log("projectRoot=" + projectRoot, Project.MSG_VERBOSE);
        	log("fullProjectRoot=" + fullProjectRoot, Project.MSG_VERBOSE);
        	log("projectConfigRoot=" + projectConfigRoot, Project.MSG_VERBOSE);
        	
        	File projectRootDir = getDir( fullProjectRoot );
        	String[] sServiceDirectories = projectRootDir.list();
        	
        	for ( int i = 0; i < sServiceDirectories.length; i++ )
        	{
        		String sServiceDirName = sServiceDirectories[i];
            	log("sServiceDirName=" + sServiceDirName, Project.MSG_VERBOSE);
            	
        		if ( sServiceDirName.endsWith("_service") ) {
                    log("_service=" + sServiceDirName, Project.MSG_VERBOSE);
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
                        loadServiceMetaData(packageName, projectConfig, frameworkConfig, services, projectRoot, projectConfigRoot, fullProjectRoot, sServiceDirName, serviceName);
        		}
        	}
        	     
            /**
            /* write a properties file containing all the ServiceNames and 
            /* a comma seperated list of Methods for that service
             */
            writeServiceMethodRegistry(services, wsConfigDestDir, packageName);

            // write all the remote services for the ejbs
            writeWebXmlEjbRefs(services, wsConfigDestDir + "/" +projectRoot);
            
        	// call writeOASwsConfig here so that we have access to all services
            writeOASwsConfig(services, wsConfigDestDir);
        	
            for (Iterator i = services.values().iterator(); i.hasNext();) 
            {  	
                ServiceDef service = (ServiceDef) i.next();
                String sServiceDir = service.getFullProjectSourceRoot();
    			
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
                File serviceBeanFile = new File(dir, service.getServiceName() + "Bean.java");
                long beanFileTimestamp = 0;
			    if (serviceBeanFile.exists()){
                  beanFileTimestamp = serviceBeanFile.lastModified();
			    }
                if (compareOldFiles && (latestFileTimestamp < beanFileTimestamp) ) {
                	log("Source not changed for service: " + service.getServiceName(), Project.MSG_VERBOSE);
                	continue;
                }
                
                log("Found new source, generating service: " + service.getServiceName(), Project.MSG_VERBOSE);
             
                Properties beanProps = service.getBeanProps();
                Properties[] methodProps = service.getMethodProps();
                generate(packageName, outputDir, wsConfigDestDir, beanProps, methodProps);
                // call writeDependencies here so we still have access to other services 
                writeDependencies(service, wsConfigDestDir, services);
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

    /**
     * @param packageName
     * @param projectConfig
     * @param frameworkConfig
     * @param services
     * @param projectRoot
     * @param projectConfigRoot
     * @param fullProjectRoot
     * @param sServiceDirName
     * @param serviceName
     * @throws IOException
     * @throws JDOMException
     * @throws GeneratorException
     */
    private void loadServiceMetaData(String packageName, String projectConfig, String frameworkConfig, Map services, String projectRoot, String projectConfigRoot, String fullProjectRoot, String sServiceDirName, String serviceName) throws IOException, JDOMException, GeneratorException {
        String sServiceDir = fullProjectRoot + "/" + sServiceDirName;
        
        // First get the methods and check to see if any have changed since this was last run --
        // if not exit loop and go to next service.
        String sMethodsDir = sServiceDir + "/methods";
        File methodsDir = getDir(sMethodsDir);
        File[] arrMethodFiles = methodsDir.listFiles();
        
        ServiceDef service = new ServiceDef();
        service.setServiceName(serviceName);
        log("Generating using Framework Config: " + frameworkConfig, Project.MSG_VERBOSE);
        service.setFrameworkConfig(frameworkConfig);
        service.setProjectConfig( projectConfigRoot + "/" + projectConfig);
        service.setPackageName(packageName);
        service.setProjectSourcePackageName(projectRoot);
        service.setFullProjectSourceRoot(fullProjectRoot + "/" + sServiceDirName); 
        service.setSourcePackageName(projectRoot + "/" + sServiceDirName); 
        defineServiceMethods( projectRoot + "/" + sServiceDirName + "/methods", service, arrMethodFiles );
        services.put(service.getServiceName(), service);
    }
    
    private void writeOASwsConfig(Map services, String wsConfigDestDir) throws GeneratorException {
    	final String START_TOKEN = "<gen-beans:repeat>";
    	final String END_TOKEN = "</gen-beans:repeat>";
    	final String TARGET_FILENAME = "oasWSConfig.xml";
    	PrintWriter pw = null;
    	StringBuffer stream = new StringBuffer();
    	
    	final String START_SERVICE_TOKEN = "<uri>/";
    	final String END_SERVICE_TOKEN = "</uri>";

    	
    	try {
    		File targetFile = new File(wsConfigDestDir, TARGET_FILENAME);
    		boolean exists = targetFile.exists();
    		   		
    		// extract the repeatable section of the template
    		StringBuffer baseTemplate = loadFile(null, OAS_WS_CONFIG);
    		int startIndex = baseTemplate.indexOf(START_TOKEN);
	    	int endIndex = baseTemplate.indexOf(END_TOKEN);
	    	String iterativeTemplate = baseTemplate.substring(startIndex + START_TOKEN.length(), endIndex);
	    	String eof = baseTemplate.substring(endIndex + END_TOKEN.length());
	    	
	    	// if exists, load contents bar the end tag and write to pw
	    	log("oasWSConfig.xml exists = " + exists, Project.MSG_VERBOSE);
    		if(exists) {
    			stream = loadFile(wsConfigDestDir + File.separator + TARGET_FILENAME, null);
    			stream.delete(stream.indexOf(eof), stream.length());
    		}
    		else {
    	    	stream = baseTemplate.delete(startIndex, baseTemplate.length());
    		}

	    	// complete the repeatable section of the template for each service
	    	Iterator serviceIterator = services.values().iterator();
	    
	    	while(serviceIterator.hasNext()) {
	    		ServiceDef service = (ServiceDef) serviceIterator.next();
                if(stream.indexOf(START_SERVICE_TOKEN + service.getServiceName() + END_SERVICE_TOKEN) == -1) {
                    processService(stream, iterativeTemplate, service);

                }
	    		else{
	    		    log(service.getServiceName() + " already exists in WS config", Project.MSG_VERBOSE);
	    		}
	    	}
	    	
	    	stream.append(eof);
	    	
	    	pw = new PrintWriter(new FileWriter(targetFile));
	    	pw.write(stream.toString());
    	}
    	catch(IOException e) {
    		throw new GeneratorException("Unable to create file: " + wsConfigDestDir + File.separator + TARGET_FILENAME);
    	}
    	finally {
    		if(pw != null) {
    			pw.flush();
    			pw.close();
    		}
    	}
    	
    }

    /**
     * @param stream
     * @param iterativeTemplate
     * @param service
     */
    private void processService(StringBuffer stream, String iterativeTemplate, ServiceDef service) {
        log("Adding WS config for " + service.getServiceName(), Project.MSG_VERBOSE);
        Properties beanProps = service.getBeanProps();
        StringBuffer buffer = new StringBuffer(iterativeTemplate);
        processBuffer(buffer, beanProps);
        stream.append(buffer);
    }
    
    private void writeWebXmlEjbRefs(Map services, String webxmlMergeDestDir) throws GeneratorException {
        final String LOCAL_TARGET_FILENAME = "webxml-local-ejb-refs.xml";
        final String REMOTE_TARGET_FILENAME = "webxml-remote-ejb-refs.xml";
        PrintWriter lpw = null;
        PrintWriter rpw = null;
        StringBuffer localRefsTemplate = new StringBuffer();
        StringBuffer remoteRefsTemplate = new StringBuffer();
        
        try {

            File dir = new File(webxmlMergeDestDir);
            if(!dir.exists()){
                dir.mkdirs();                
            }
            
            File localTargetFile = new File(webxmlMergeDestDir, LOCAL_TARGET_FILENAME);                   
            File remoteTargetFile = new File(webxmlMergeDestDir, REMOTE_TARGET_FILENAME);
            
            localRefsTemplate = loadFile(null, EJB_LOCAL_REFS);
            remoteRefsTemplate = loadFile(null, EJB_REMOTE_REFS);
            lpw = new PrintWriter(new FileWriter(localTargetFile));
            rpw = new PrintWriter(new FileWriter(remoteTargetFile));
            // complete the repeatable section of the template for each service
            Iterator serviceIterator = services.values().iterator();
        
            while(serviceIterator.hasNext()) {
                ServiceDef service = (ServiceDef) serviceIterator.next();
                log("Adding service config for " + service.getServiceName(), Project.MSG_VERBOSE);
                Properties beanProps = service.getBeanProps();
                StringBuffer lbuffer = new StringBuffer(localRefsTemplate.toString());
                processBuffer(lbuffer, beanProps);
                lpw.write(lbuffer.toString());
                
                StringBuffer rbuffer = new StringBuffer(remoteRefsTemplate.toString());
                processBuffer(rbuffer, beanProps);
                rpw.write(rbuffer.toString());
            }
            
            
        }
        catch(IOException e) {
            throw new GeneratorException("Unable to create file: " + webxmlMergeDestDir + File.separator + LOCAL_TARGET_FILENAME + " or " + REMOTE_TARGET_FILENAME);
        }
        finally {
            if(lpw != null) {
                lpw.flush();
                lpw.close();
            }
            if(rpw != null) {
                rpw.flush();
                rpw.close();
            }
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
            
            log("sMethodFilename=" + sMethodFilename, Project.MSG_VERBOSE);
        	
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
            	
            	service.addDependencies(getDependencies(methodDoc));
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
        TreeSet dependencies = new TreeSet();
        Map methods = new HashMap();
        int remoteMethodsCount;
        int localOnlyMethodsCount;

        public String getSourcePackageName() {
        	return sourcePackageName;
        }
        
        public void addDependencies(Collection newDependencies) {
        	dependencies.addAll(newDependencies);
        }
        
        public Collection getDependencies() {
        	return dependencies;
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
            if(method.getVisibility().equalsIgnoreCase(LOCAL_AND_REMOTE_VISIBILITY)){
                remoteMethodsCount++;
            }
            else{
            	localOnlyMethodsCount++;
            }
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
        public String[] getRemoteMethodNames()
        {            
        	int pos = 0;
        	String[] methodNames = new String[remoteMethodsCount];
        	final Iterator methodDefsIterator = methods.values().iterator();
    		while(methodDefsIterator.hasNext()){
    			MethodDef methodDef = (MethodDef)methodDefsIterator.next();
    			if(methodDef.getVisibility().equalsIgnoreCase(BeanGenerator.LOCAL_AND_REMOTE_VISIBILITY)){
    				if(methodDef.getName() != null){
    					methodNames[pos++] = methodDef.getName();
    				}
    			}        			
    		}        
            return methodNames;
        }

		public int getLocalOnlyMethodsCount() {
			return localOnlyMethodsCount;
		}

		public void setLocalOnlyMethodsCount(int localOnlyMethodsCount) {
			this.localOnlyMethodsCount = localOnlyMethodsCount;
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
        
        XMLOutputter out = new XMLOutputter();
        
        String output = out.outputString(e);
        char [] charArray = output.toCharArray();
        StringBuffer stringBuf = new StringBuffer();
        
        for(int i=0; i<charArray.length; i++){
        	if(charArray [i] == '"') 
        		stringBuf.append("\\\"");
        	else stringBuf.append(charArray[i]);
        }
        
        return stringBuf.toString();
    }
    
    public String getTransactionType(Document methodDoc) throws JDOMException, GeneratorException {
    	Element e = (Element) XPath.selectSingleNode(methodDoc.getRootElement(), "//Transaction");
        if ( e == null ) {
        	// if the transaction node is not specified then default the transaction type to "Required"
        	return "Required";
        }
        return e.getAttributeValue("type");
    }
    
    private Collection getDependencies(Document methodDoc) throws JDOMException, GeneratorException {
    	Element dependenciesElement = (Element) XPath.selectSingleNode(methodDoc.getRootElement(), "//Dependencies");
    	TreeSet dependencies = new TreeSet();
    	
    	if(dependenciesElement != null) {
    		List elementList = dependenciesElement.getChildren();
	    	Iterator elements = elementList.iterator();
	    	
	    	while(elements.hasNext()) {
	    		Element e = (Element) elements.next();
	    		if(e.getName().toUpperCase().equals("DEPENDENCY")) {
	    			String serviceName = e.getAttributeValue("serviceName");
	    			if(serviceName != null) {
	    				dependencies.add(serviceName);
	    			}
	    		}
	    	}
    	}
    	
    	return dependencies;
    }
    
    private void writeDependencies(ServiceDef currentService, String wsConfigDestDir, Map services) throws GeneratorException {
    	String serviceName = currentService.getServiceName();
    	String targetFilename = "ejb-ejbrefs-" + serviceName + "Bean.xml";
        String orionTargetFilename = "oc4j-" + serviceName + "Bean-settings.xml";
    	PrintWriter pw = null;
        PrintWriter opw = null;
    	File dir = null;
    	try {        	
	    	Iterator i = currentService.getDependencies().iterator();
	    	if(i.hasNext()) {
	    		log("Writing dependency merge file: " + targetFilename, Project.MSG_VERBOSE);
	    		dir = new File(wsConfigDestDir, currentService.getProjectSourcePackageName());
	    	    if(!dir.exists())
	    	    {
	    	        dir.mkdirs();            
	    	    }
	    		pw = new PrintWriter(new FileWriter(new File(dir, targetFilename)));
                opw = new PrintWriter(new FileWriter(new File(dir, orionTargetFilename)));
	    	}
	    	while(i.hasNext()) {
	    	    log("getting next dependency", Project.MSG_VERBOSE);	    		
	    	    String dependency = (String) i.next();
	    		log("looking up service definition for dependency: " + dependency, Project.MSG_VERBOSE);
	    		ServiceDef targetService = (ServiceDef) services.get(dependency);
	    		// make sure we are not depending on the service itself, 
	    		// to prevent generation of multiple ejb-ref elements in the ejb-jar.xml
	    	    if(!currentService.getServiceName().equals(targetService.getServiceName())){		    		
		    		Properties beanProps = targetService.getBeanProps();
		    		log("Loading EJB Ref template", Project.MSG_VERBOSE);
		    		StringBuffer sb = loadFile(null, EJB_LOCAL_REFS);                    
		    		log("processing buffer", Project.MSG_VERBOSE);
	            	processBuffer(sb, beanProps);
	            	log("writing buffer", Project.MSG_VERBOSE);
	            	pw.write(sb.toString());
                    
                    log("Loading Orion EJB Ref template", Project.MSG_VERBOSE);                    
                    sb = loadFile(null, ORION_EJB_REFS);                    
                    log("processing orion buffer", Project.MSG_VERBOSE);                    
                    processBuffer(sb, beanProps);
                    log("writing orion buffer", Project.MSG_VERBOSE);
                    opw.write(sb.toString());
	    	    }
	    	    else{	    	        
	    	        log("IGNORING: dependency is this service: " + serviceName, Project.MSG_VERBOSE);
	    	    }
	    	}
    	}
    	catch(IOException e) {
    		log(e.getMessage());
    		throw new GeneratorException("Unable to create file: " + dir.getAbsolutePath() + File.separator + targetFilename, e);
    	}
    	finally {
    		if(pw != null) {
    			pw.flush();
    			pw.close();
    		}
            if(opw != null) {
                
                // write the Security and CommandProcessor entries
                opw.write("\n\n\n<!-- ### The following entries have been added by " + SUPSBeanGenerator.class.getName() + " ### -->");
                opw.write("\n<ejb-ref-mapping name=\"ejb/CommandProcessorLocal\" location=\"CommandProcessor\" />");
                opw.write("\n<ejb-ref-mapping name=\"ejb/SecurityServiceLocal\" location=\"SecurityService\" />");
                opw.write("\n<!-- ### The above entries have been added by " + SUPSBeanGenerator.class.getName() + " ### -->\n\n");
                
                opw.flush();
                opw.close();
            }
    	}
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
    

    private void writeServiceMethodRegistry(Map services, String serviceRegistryDirectory, String packageName) throws GeneratorException {
        final String SERVICE_METHOD_REGISTRY_FILENAME = "service-method-registry.properties";
        
        try {

            File dir = new File(serviceRegistryDirectory);
            if(!dir.exists()){
                dir.mkdirs();                
            }
            
            File serviceRegistryTargetFile = new File(serviceRegistryDirectory, SERVICE_METHOD_REGISTRY_FILENAME);                   
            
            // complete the repeatable section of the template for each service
            Iterator serviceIterator = services.values().iterator();
            Properties serviceMethodRegistry = new Properties();
            while(serviceIterator.hasNext()) {
                ServiceDef service = (ServiceDef) serviceIterator.next();
                log("Adding service config for " + service.getServiceName(), Project.MSG_VERBOSE);
                String methodNamesAsString = methodsAsString(service.getRemoteMethodNames());
                serviceMethodRegistry.put(service.getServiceName(), methodNamesAsString);                
            }
            
            serviceMethodRegistry.store(new FileOutputStream(serviceRegistryTargetFile), "Service and Methods Registry for " + packageName);
        }
        catch(IOException e) {
            throw new GeneratorException("Unable to create file: " + serviceRegistryDirectory + File.separator + SERVICE_METHOD_REGISTRY_FILENAME);
        }
        finally {
        }
        
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
    
    private String methodsAsString(String[] methodNames){
    	StringBuffer sb = new StringBuffer(1024);
    	for(int i=0; i<methodNames.length; i++){
			sb.append(methodNames[i]);
			if(i<methodNames.length - 1){
    			sb.append(",");
    		}
    	}
    	return sb.toString();
    }
}

