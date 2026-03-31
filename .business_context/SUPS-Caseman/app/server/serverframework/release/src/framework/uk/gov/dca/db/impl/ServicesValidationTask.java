/*
 * Created on 29-Jul-2004
 *
 */
package uk.gov.dca.db.impl;

import java.lang.reflect.Field;
import java.util.Vector;
import org.apache.tools.ant.types.FileSet;
import org.apache.tools.ant.*;
import org.apache.tools.ant.types.Path;
import org.apache.tools.ant.types.Reference;
import java.lang.reflect.Method;
import java.lang.reflect.InvocationTargetException;

/**
 * @author Michael Barker
 *
 */
public class ServicesValidationTask extends Task
{
    private Vector fileSets = new Vector();
    private String packageName = null;
    private String rootDir = null;
    private String frameworkConfig = null;
    private String projectConfig = null;
    private String serviceFolder = null;
    private String projectConfigPackage = null;
    private Path classpath = null;
    
    /**
     * @param packageName The packageName to set.
     */
    public void setPackageName(String packageName)
    {
        this.packageName = packageName;
    }
    
    /**
     * @param configFile The frameworkConfig to set.
     */
    public void setFrameworkConfig(String frameworkConfig)
    {
        this.frameworkConfig = frameworkConfig;
    }
    /**
     * @param projectConfig The projectConfig to set.
     */
    public void setProjectConfig(String projectConfig)
    {
        this.projectConfig = projectConfig;
    }
    /**
     * @param projectConfigPackage The projectConfigPackage to set.
     */
    public void setProjectConfigPackage(String projectConfigPackage)
    {
        this.projectConfigPackage = projectConfigPackage;
    }
    /**
     * @param rootDir The rootDir to set.
     */
    public void setRootDir(String rootDir)
    {
        this.rootDir = rootDir;
    }
    /**
     * @param serviceFolder. The serviceFolder to set.
     */
    public void setServiceFolder(String serviceFolder)
    {
        this.serviceFolder = serviceFolder;
    }
    /**
     * @param classpath The classpath to set.
     */
    public void setClasspathRefId(String classpathRefId)
    {
     	this.classpath = new Path(getProject());
    	Reference r = new Reference();
     	r.setRefId(classpathRefId);
     	this.classpath.setRefid(r);
    }

    
    public void execute() throws BuildException
    {
    	validateAttributes();

     	// The AntClassLoader mechanism is used so that we can control the classpath
     	// used to subsequently load classes i.e. within the server framework classes.
     	// ServicesValidator.validate is called via Method.invoke since we cannot cast
     	// from Object to ServicesValidator and then call the method. This is because 
     	// the 'Object' version is loaded via the AntClassLoader ClassLoader instance
     	// whereas the version cast to uses the current Ant ClassLoader instance. Classes 
     	// can only be cast if the same class loader was used in both cases. 
     	AntClassLoader loader = getProject().createClassLoader(classpath);		
    	try {
    		Class vc = loader.loadClass("uk.gov.dca.db.impl.ServicesValidator");
    		Object objValidator = vc.newInstance();
   		
    		Class clString = String.class;
    		Class[] params = new Class[6];
    		params[0] = clString;
    		params[1] = clString;
    		params[2] = clString;
    		params[3] = clString;
    		params[4] = clString;
    		params[5] = clString;
    		
    		Object[] paramsValues = new Object[6];
    		paramsValues[0] = rootDir;
    		paramsValues[1] = packageName;
    		paramsValues[2] = projectConfig;
    		paramsValues[3] = frameworkConfig;
    		paramsValues[4] = serviceFolder;
    		paramsValues[5] = projectConfigPackage;
    		
    		Method validateMethod = objValidator.getClass().getMethod("validate", params);
    		Object returnValue = validateMethod.invoke(objValidator, paramsValues);
    		
    		// we know it returns a boolean. throw a BuildException on fail so that
    		// the task can be used to stop any subsequent build tasks from executing.
    		Boolean bValid = (Boolean)returnValue;
    		if ( bValid.booleanValue() == false) {
    			String sMsg = "Failed to validate with parameters:\r\n";
    			sMsg += "rootDir=" + rootDir + "\r\n";
    			sMsg += "packageName=" + packageName + "\r\n";
    			sMsg += "projectConfig=" + projectConfig + "\r\n";
    			sMsg += "frameworkConfig=" + frameworkConfig + "\r\n";
    			sMsg += "serviceFolder=" + serviceFolder + "\r\n";
    			sMsg += "projectConfigPackage=" + projectConfigPackage;
    			
    			throw new BuildException(sMsg);
    		}
    	}	
        catch (ClassNotFoundException e){
        	throw new BuildException(e);
		}
		catch (IllegalAccessException e) {
		    throw new BuildException(e);
		}
		catch (InstantiationException e) {
		    throw new BuildException(e);
		}
		catch (InvocationTargetException e ) {
			// it seems a side effect of using the 'Method' class to invoke the method is
			// that all exceptions get wrapped in an InvocationTargetException with no
			// message. Which is not very helpful. So rethrow as a BuildException with a
			// more meaningful message
			String sMessage = null;
			Throwable currentCause = e;
			boolean bFirst = true;
			
			while( currentCause.getCause() != null ) {
				currentCause = currentCause.getCause();
				if ( bFirst ) {
					sMessage = currentCause.getMessage() + "\r\n";
					bFirst = false;
				}
				else
					sMessage += "<--" + currentCause.getMessage() + "\r\n";	
			}
			throw new BuildException(sMessage, e);
		}
		catch (Exception e){
			throw new BuildException(e);
        }
    }
    
    public void addFileset(FileSet fileSet)
    {
        fileSets.add(fileSet);
    }
    
    private void validateAttributes()
    {
        String[] fields = new String[] {
			"rootDir",
            "packageName",
			"projectConfig",
            "frameworkConfig",
			"serviceFolder",
			"projectConfigPackage"
        };
        
        try
        {
        	// make sure that all fields are set.
        	// Note: the serviceFolder is optional and therefore need not be set.
            for (int i = 0; i < fields.length; i++)
            {
                Field f = ServicesValidationTask.class.getDeclaredField(fields[i]);
                if (f.get(this) == null && "serviceFolder".compareToIgnoreCase(f.getName()) != 0)
                {
                	if ( "projectConfigPackage".compareTo(fields[i]) == 0){
                		//default to service package
                		setProjectConfigPackage(packageName);
                	}
                	else {
                		throw new BuildException("\"" + fields[i] + "\" has not been set");
                	}
                }
            }            
        }
        catch (SecurityException e)
        {
            throw new BuildException(e);
        }
        catch (NoSuchFieldException e)
        {
            throw new BuildException(e);
        }
        catch (IllegalArgumentException e)
        {
            throw new BuildException(e);
        }
        catch (IllegalAccessException e)
        {
            throw new BuildException(e);
        }
    }
}
