/*
 * Created on 29-Jul-2004
 *
 */
package uk.gov.dca.db.impl;

import java.lang.reflect.Field;
import java.util.Vector;
import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Task;
import org.apache.tools.ant.AntClassLoader;
import org.apache.tools.ant.types.FileSet;
import org.apache.tools.ant.types.Path;
import org.apache.tools.ant.types.Reference;

/**
 * @author Michael Barker
 *
 */
public class SUPSBeanGeneratorTask extends Task
{
    private Vector fileSets = new Vector();
    private String destdir = null;
    private String packageName = null;
    private String rootDir = null;
    private String wsConfigDestDir = null;
    private String frameworkConfig = null;
    private String header = null;
    private String footer = null;
    private String localMethod = null;
    private String webMethod = null;
    private String projectConfig = null;
    private String projectConfigPackage = null;
	private Path compilerClasspath = null;
	private AntClassLoader loader = null;
    
    /**
     * @param packageName The packageName to set.
     */
    public void setPackageName(String packageName)
    {
        this.packageName = packageName;
    }
    
    public void setWSConfigDestDir(String wsConfigDestDir) {
    	this.wsConfigDestDir = wsConfigDestDir;
    }
    
    /**
     * @param footer The footer to set.
     */
    public void setFooter(String footer)
    {
        this.footer = footer;
    }
    /**
     * @param header The header to set.
     */
    public void setHeader(String header)
    {
        this.header = header;
    }
    /**
     * @param localMethod The localMethod to set.
     */
    public void setLocalMethod(String localMethod)
    {
        this.localMethod = localMethod;
    }
    /**
     * @param webMethod The webMethod to set.
     */
    public void setWebMethod(String webMethod)
    {
        this.webMethod = webMethod;
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
     * @param destdir The destdir to set.
     */
    public void setDestdir(String destdir)
    {
        this.destdir = destdir;
    }
    /**
     * @param rootDir The rootDir to set.
     */
    public void setRootDir(String rootDir)
    {
        this.rootDir = rootDir;
    }
    
    public void setClasspath(Path path)
    {
        if(compilerClasspath == null)
        {
            compilerClasspath = path;
        } else
        {
            compilerClasspath.append(path);
        }
    }

    public Path getClasspath()
    {
        return compilerClasspath;
    }

    public Path createClasspath()
    {
        if(compilerClasspath == null)
        {
            compilerClasspath = new Path(getProject());
        }
        return compilerClasspath.createPath();
    }

    public void setClasspathRef(Reference reference)
    {
        createClasspath().setRefid(reference);
    }
    
    public void execute() throws BuildException
    {
    	validateAttributes();
    	setupClasspath();
        
        SUPSBeanGenerator gen = new SUPSBeanGenerator(header, footer, localMethod, webMethod);
        
        try
        {
        	gen.generate(packageName, destdir, rootDir, wsConfigDestDir, projectConfig, frameworkConfig, projectConfigPackage);        
        }
        catch (Exception e)
        {
            throw new BuildException(e);
        }
        finally
		{
        	restoreClasspath();
		}
    }
    
    public void addFileset(FileSet fileSet)
    {
        fileSets.add(fileSet);
    }
    
    private void validateAttributes()
    {
        String[] fields = new String[] {
            "destdir",
			"rootDir",
            "packageName",
			"projectConfig",
            "frameworkConfig",
			"projectConfigPackage",
        };
        
        try
        {
            for (int i = 0; i < fields.length; i++)
            {
                Field f = SUPSBeanGeneratorTask.class.getDeclaredField(fields[i]);
                if (f.get(this) == null)
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
    
    private void setupClasspath()
    {
        if(compilerClasspath == null)
        {
            compilerClasspath = (Path)Path.systemClasspath.clone();
        } else
        {
        	// override system classpath if one is specified
            compilerClasspath.concatSystemClasspath("ignore");
        }
        setupClassLoader();
    }
    
    private void restoreClasspath()
    {
   		// restore the original class loader as the class loader for the current thread.
   		loader.resetThreadContextLoader();
    }
    
    private void setupClassLoader()
    {
    	// create a new Ant class loader and add the specified classpath.
    	loader = new AntClassLoader(this.getClass().getClassLoader(), getProject(), compilerClasspath, true);
    	
    	// set the new class loader as the class loader for the current thread.
    	loader.setThreadContextLoader();
    }
}
