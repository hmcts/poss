/*
 * Created on 20-Apr-2005
 *
 */
package uk.gov.dca.db.util;

import java.io.File;
import java.io.FilenameFilter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.tools.ant.BuildException;

/**
 * @author Michael Barker
 *
 */
public class BuildUtil
{
    public final static String PATTERN = "_service";
    
    /**
     * Generates a list of the Services for a given package.
     * @param dirName
     * @param packages
     * @return
     */
    public static List getServiceMetaData(File dir, String[] packages)
    {
        FilenameFilter filter = new PatternFilter(PATTERN);
        
        List paramsList = new ArrayList();
 
        for (int i = 0; i < packages.length; i++)
        {
            File packageDir = new File(dir, packages[i].replace('.', File.separatorChar));            
            File[] services = packageDir.listFiles(filter);
            
            for (int j = 0; j < services.length; j++)
            {
                String serviceName = services[j].getName().replaceAll(PATTERN, "");
                String serviceNameCapped = recapName(serviceName);
                ServiceMetaData md = new ServiceMetaData(packages[i], serviceNameCapped);
                paramsList.add(md);
            }
        }  
        
        return paramsList;
    }
    
    public static String recapName(String s)
    {
        String[] parts = s.split("_");
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < parts.length; i++)
        {
            sb.append(parts[i].substring(0, 1).toUpperCase());
            sb.append(parts[i].substring(1));
        }
        return sb.toString();
    }

    private static class PatternFilter implements FilenameFilter
    {
        private Pattern pattern;

        public PatternFilter(String pattern)
        {
            this.pattern = Pattern.compile(pattern);
        }

        /* (non-Javadoc)
         * @see java.io.FilenameFilter#accept(java.io.File, java.lang.String)
         */
        public boolean accept(File dir, String name)
        {
            Matcher m = pattern.matcher(name);
            return m.find();
        }
    }
    
    public static File getDir(String param, String dirName) throws BuildException
    {
        File dir = new File(dirName);
        
        if (!dir.exists())
        {
            throw new BuildException("The directory: " + dirName + " for parameter: " + param + " does not exist");
        }
        else if (!dir.isDirectory())
        {
            throw new BuildException("The directory: " + dirName + " for parameter: " + param + " is not a file");
        }
            
        return dir;
    }
    
    public static File getFile(String param, String filename) throws BuildException
    {
        File f = new File(filename);
        
        if (!f.exists())
        {
            throw new BuildException("The file: " + filename + " for parameter: " + param + " does not exist");
        }
        else if (f.isDirectory())
        {
            throw new BuildException("The file: " + filename + " for parameter: " + param + " is a directory");            
        }
        
        return f;
    }
    
    
}
