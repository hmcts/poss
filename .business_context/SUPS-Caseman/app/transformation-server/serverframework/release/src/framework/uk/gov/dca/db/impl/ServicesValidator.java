/*
 * Created on 28-Sep-2004
 *
 */
package uk.gov.dca.db.impl;

import java.io.File;
import java.io.FilenameFilter;

import uk.gov.dca.db.XMLService;
import uk.gov.dca.db.XMLServiceFactory;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;

import uk.gov.dca.db.exception.*;

/**
 * @author GrantM
 *
 */
public class ServicesValidator {

	/**
	 * Constructor 
	 */
	public ServicesValidator() {
		//super();
	}
	
	/**
	 * Validates all services within the specified project or, if provided, 
	 * the specified service within the project.
	 * 
	 * @param rootDir
	 * @param packageName
	 * @param projectConfig
	 * @param frameworkConfig
	 * @param serviceName
	 * @param projectConfigRootDir
	 * @param projectConfigPackage
	 */
	public boolean validate(String rootDir, String packageName, String projectConfig, String frameworkConfig, 
			String serviceFolder, String projectConfigPackage )
		throws SystemException
	{
		QueryEngineErrorHandler errorHandler = new ValidationErrorHandler();
			
    	String projectRoot = packageName.replace('.', '/');
    	String fullProjectRoot = rootDir + "/" + projectRoot;
    	String projectConfigRoot = projectConfigPackage.replace('.', '/');
    	   	
    	File projectRootDir = getDir( fullProjectRoot );
    	String[] sServiceDirectories = projectRootDir.list();
    	
    	boolean bValidateSingleService = false;
    	if ( serviceFolder != null && serviceFolder.length() > "_service".length() ) {
    		bValidateSingleService = true;
    	}
    	
    	errorHandler.raiseMessage("Validating project: " + projectRoot);
    	
    	for ( int i = 0; i < sServiceDirectories.length; i++ )
    	{
    		String sServiceDirName = sServiceDirectories[i];
    		if ( sServiceDirName.endsWith("_service") && 
    				( !bValidateSingleService || (bValidateSingleService && serviceFolder.compareTo(sServiceDirName)==0 ) ) ) 
			{
    			errorHandler.raiseMessage("Validating service: " + sServiceDirName);

    			// Get the service name. There is a rule naming for all service directories:
    			//     <service name>_service - all in lower case.
    			String serviceName = sServiceDirName.substring(0, sServiceDirName.indexOf("_service"));
    			if ( serviceName == null || serviceName.length() == 0 ) {
    				throw new SystemException("Null or zero length service name provided. Directory: "+sServiceDirName);
    			}
    			
    			String sServiceDir = fullProjectRoot + "/" + sServiceDirName;
    			File serviceDir = getDir(sServiceDir);
    			
    			// now get the methods
    			String sMethodsDir = sServiceDir + "/methods";
    			File methodsDir = getDir(sMethodsDir);
    			
    			FilenameFilter XMLFileFilter = new XMLFileFilter();
    			File[] arrMethodFiles = methodsDir.listFiles(XMLFileFilter);  
    			
    			String sMethodsRoot = projectRoot + "/" + sServiceDirName + "/methods";
    			validateService(serviceName, errorHandler, sMethodsRoot, arrMethodFiles, frameworkConfig, projectConfigRoot + "/" + projectConfig);
    		}
    	} 
    	
    	return !errorHandler.errorOccurred();
	}
    
	/**
	 * Validates an individual service within the project
	 * 
	 * @param methodsRoot
	 * @param methodsFiles
	 * @param frameworkConfig
	 * @param projectConfig
	 * @throws SystemException
	 */
	public void validateService(String serviceName, QueryEngineErrorHandler errorHandler, String methodsRoot, File[] methodsFiles, String frameworkConfig, String projectConfig)
		throws SystemException
	{
		// XMLService requires an array of method filenames, so create it
		String[] methods = new String[methodsFiles.length];
		
		for ( int i = 0; i < methodsFiles.length; i++ )
		{
			methods[i] = methodsRoot + "/" + methodsFiles[i].getName();
		}
        
		// create the service
		XMLService service = XMLServiceFactory.getInstance(serviceName, methods, frameworkConfig, projectConfig);
		
		// validate the service
		service.validate(errorHandler);
	}
	
	
	/**
	 * Helper method to return the specified directory.
	 * 
	 * @param dirname
	 * @return
	 */
	private static File getDir(String dirname) throws SystemException
    {
        File f = new File(dirname);
        if (!f.exists() || !f.isDirectory())
        {
            throw new SystemException("Directory is not valid: " + dirname);
        }
        return f;        
    }
	
	/**
	 * Helper class to filter out all non-xml files
	 * 
	 * @author GrantM
	 *
	 */
	class XMLFileFilter implements FilenameFilter
	{
		public boolean accept(File dir, String name)
		{
			boolean validName = false;
			
			if ( name != null && name.length() > 4 &&
					name.endsWith(".xml") ) 
			{
				validName = true;
			}
			return validName;
		}
	}
	
	/**
	 * Error handler class which specifies the behaviour we want when validation errors occur.
	 * 
	 * @author GrantM
	 *
	 */
	class ValidationErrorHandler implements QueryEngineErrorHandler
	{
		private boolean bErrorOccurred = false;
		
		public boolean errorOccurred()
		{
			return bErrorOccurred;
		}
		
		public void raiseMessage(String sMsg)
		{
			System.out.println("MESSAGE: " +sMsg);
		}
		
		public void raiseWarning(String sMsg)
		{
			System.err.println("WARNING: " +sMsg);
		}
		
		public void raiseError(String sMsg)
		{
			System.err.println("ERROR: " +sMsg);
			bErrorOccurred = true;
		}
		
		public void raiseCriticalError(String sMsg) throws ConfigurationException
		{
			System.err.println("CRITICAL ERROR: " +sMsg);
			throw new ConfigurationException("CRITICAL ERROR: " +sMsg);
		}
	}
}
