/*
 * Created on 27-Jul-2004
 *
 */
package uk.gov.dca.db.impl;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.Reader;
import java.util.Iterator;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.Task;

import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * @author Michael Barker
 * 
 * A simple bean generator class for Stateless session beans for the SUPS Server
 * side framework.
 *
 */
public class BeanGenerator extends Task
{
    
    protected final static Log log = SUPSLogFactory.getLogger(BeanGenerator.class);
    
    final static String HEADER = "uk/gov/dca/db/ejb/BeanHeader.txt";
    final static String FOOTER = "uk/gov/dca/db/ejb/BeanFooter.txt";
    final static String LOCAL_METHOD = "uk/gov/dca/db/ejb/LocalMethodTemplate.txt";
    final static String WEB_METHOD = "uk/gov/dca/db/ejb/WebMethodTemplate.txt";
    final static String BUILD = "uk/gov/dca/db/ejb/buildTemplate.txt";
    final static String WS_CONFIG = "uk/gov/dca/db/ejb/wsConfigTemplate.txt";
    final static String DEPLOY = "uk/gov/dca/db/ejb/deploy-wsTemplate.txt";
    final static String EJB_LOCAL_REFS = "uk/gov/dca/db/ejb/ejbrefLocalTemplate.txt";
    final static String EJB_REMOTE_REFS = "uk/gov/dca/db/ejb/ejbrefRemoteTemplate.txt";
    final static String ORION_EJB_REFS = "uk/gov/dca/db/ejb/orionEJBrefTemplate.txt";
    final static String OAS_WS_CONFIG = "uk/gov/dca/db/ejb/OASwsConfigTemplate.txt";
    protected final static String VISIBILITY_PROPERTY = "method.visibility";
    protected final static String LOCAL_VISIBILITY = "local";
    protected final static String LOCAL_AND_REMOTE_VISIBILITY = "both";  
    
    final static String CLIENT_BUILD_SERVICE_NAME = "ClientBuild";
    final static String PERMISSIONS_SERVICE_NAME = "Permissions";
    
    String header = null;
    String footer = null;
    String webMethod = null;
    String localMethod = null;
    String build = null;
    String wsConfig = null;
    String deploy = null;
    
    File outputDir;
    
    public BeanGenerator(String header, String footer, String webMethod, String localMethod)
    {
        this.header = header;
        this.footer = footer;
        this.webMethod = webMethod;
        this.localMethod = localMethod;
    }
    
    public BeanGenerator()
    {
    }
    
    /**
     * Generate the EJB class.
     * 
     * @param packageName The name of the package to prefix the bean with.
     * @param outputDirname The directory to output the bean
     * @param beanProps The properties for the beans, will replace in the template.
     * @param methodProps The properties for the methods.
     * @throws GeneratorException If any problem occurs generating the bean.
     */
    
    public void generate(String packageName, String outputDirname, String wsConfigDestDir, Properties beanProps, Properties[] methodProps) throws GeneratorException
    {
        outputDir = new File(outputDirname);
        File dir = createPackageDir(packageName);
        PrintWriter pw = null;
        
        String serviceName = beanProps.getProperty("service.name");
        if (serviceName == null)
        {
            throw new GeneratorException("Property service.name is not defined");
        }
        
        //writeWSconfig(wsConfigDestDir, beanProps);
        
        log("Generating bean for service: " + serviceName, Project.MSG_VERBOSE);
        
        try
        {
            dir.mkdirs(); // make sure all the directories exist
            File headerDestination = new File(dir, serviceName + "Bean.java");
            log("Writting bean file at: " + headerDestination.getAbsolutePath());
            pw = new PrintWriter(new FileWriter(headerDestination));
            pw.write(processHeader(beanProps));
            Properties methodProp = null;
            String visibility = null;
            
            for (int i = 0; i < methodProps.length; i++)
            {
            	methodProp = (Properties)methodProps[i];
            	visibility = methodProp.getProperty(VISIBILITY_PROPERTY);
            	               
                if (LOCAL_AND_REMOTE_VISIBILITY.compareTo(visibility) == 0) {
                	pw.write(processWebMethod(beanProps, methodProp));
                	pw.write(processLocalMethod(beanProps, methodProp));
                }
                else if (LOCAL_VISIBILITY.compareTo(visibility) == 0) {
                	pw.write(processLocalMethod(beanProps, methodProp));
                }
                else {
                	// default to a remote method
                	pw.write(processWebMethod(beanProps, methodProp));
                }
                
            }
            pw.write(processFooter(beanProps));
        }
        catch (IOException e)
        {
            throw new GeneratorException("Unable create file: " + dir.getPath() + File.separator + serviceName + "Bean.java");
        }
        finally
        {
            if (pw != null)
            {
                pw.flush();
                pw.close();
            }
        }
    }

    
    private String processMethod(String filename, String resource, Properties beanProps, Properties methodProps) throws IOException, GeneratorException
    {
        StringBuffer sb = loadFile(filename, resource);
        processBuffer(sb, beanProps);
        processBuffer(sb, methodProps);
        return sb.toString();
    }
    
    
    private String processLocalMethod(Properties beanProps, Properties methodProps) throws IOException, GeneratorException
    {
        return processMethod(localMethod, LOCAL_METHOD, beanProps, methodProps);
    }
    
    
    private String processWebMethod(Properties beanProps, Properties methodProps) throws IOException, GeneratorException
    {
        return processMethod(webMethod, WEB_METHOD, beanProps, methodProps);
    }
    
    private String processHeader(Properties beanProps) throws IOException, GeneratorException
    {
        StringBuffer sb = loadFile(header, HEADER);
        processBuffer(sb, beanProps);
        return sb.toString();
    }
    
    private String processFooter(Properties beanProps) throws IOException, GeneratorException
    {
        StringBuffer sb = loadFile(footer, FOOTER);
        processBuffer(sb, beanProps);
        return sb.toString();        
    }
    
    protected void processBuffer(StringBuffer sb, Properties props)
    {
        for (Iterator i = props.keySet().iterator(); i.hasNext();)
        {
            String key = (String) i.next();
            String value = props.getProperty(key);
            String token = "${" + key + "}";
            int idx = 0;
            while ((idx = sb.indexOf(token, idx)) != -1)
            {
                sb.replace(idx, idx + token.length(), value);
            }
        }        
    }
    
    private final static int BUF_SIZE = 1024;
    public StringBuffer loadFile(String filename, String resource) throws IOException, GeneratorException
    {
        StringBuffer sb = new StringBuffer();
        Reader in = getReader(filename, resource);
        try
        {
            char[] buffer = new char[BUF_SIZE];
            int numRead = 0;
            while ((numRead = in.read(buffer)) > 0)
            {
                sb.append(buffer, 0, numRead);
            }
        }
        finally
        {
            if (in != null)
            {
                in.close();
            }
        }
        return sb;
    }
    
    
    public File createPackageDir(String packageName)
    {
        File dir = new File(outputDir, packageName.replace('.', File.separatorChar));
        if (!dir.exists())
        {
            dir.mkdirs();            
        }
        return dir;
    }
    
    
    protected static File getDir(String dirname)
    {
        File f = new File(dirname);
        if (!f.exists() || !f.isDirectory())
        {
            throw new RuntimeException("Directory is not valid: " + dirname);
        }
        return f;        
    }
    
    protected static File getFile(File dir, String filename)
    {
        File f = new File(dir, filename);
        if (!f.exists() || f.isDirectory())
        {
            throw new RuntimeException("File is not valid: " + filename);
        }
        return f;        
    }
    
    protected static File getFile(String filename)
    {
        File f = new File(filename);
        if (!f.exists() || f.isDirectory())
        {
            throw new RuntimeException("File is not valid: " + filename);
        }
        return f;
    }
    
    /**
     * Gets the appropriate reader for the specified template, either by file name or
     * falling back to the default resource if it is null.
     * 
     * @param filename The name of the template file.
     * @param resource The name of the default resource.
     * @return A reader for the template
     * @throws GeneratorException If any problem occurs opening the template.
     */
    public Reader getReader(String filename, String resource) throws GeneratorException
    {
        if (filename == null)
        {
            try
            {
                // Required 'cause ant does funny things with the class loader.
                ClassLoader cl = Class.forName("uk.gov.dca.db.security.SecurityBean").getClassLoader();  
                InputStream is = cl.getResourceAsStream(resource);
                if (is == null)
                {
                    throw new GeneratorException("Unable to locate template: " + resource);
                }
                return new InputStreamReader(is);            
            }
            catch (ClassNotFoundException e)
            {
                throw new GeneratorException(e);
            }
        }
        else
        {
            try
            {
                return new FileReader(filename);
            }
            catch (IOException e)
            {
                throw new GeneratorException("Unable to load template: " + filename);
            }
        }
    }
        
}
