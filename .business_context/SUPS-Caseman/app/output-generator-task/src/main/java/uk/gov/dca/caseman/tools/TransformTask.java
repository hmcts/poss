package uk.gov.dca.caseman.tools;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.Vector;

import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.tools.ant.AntClassLoader;
import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.DirectoryScanner;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.taskdefs.MatchingTask;
import org.apache.tools.ant.taskdefs.XSLTLiaison;
import org.apache.tools.ant.types.Path;
import org.apache.tools.ant.types.Reference;



public class TransformTask extends MatchingTask
{
    private String xml;
    private String xsl;
    private String out;
    /** additional parameters to be passed to the stylesheets */
    private Vector params = new Vector();

    /** Classpath to use when trying to load the XSL processor */
    private Path classpath = null;

    private XSLTLiaison liaison;
    /** The name of the XSL processor to use */
    private String processor;

    private File srcDir;
    private File destDir;
    private boolean filtering = false;
    private boolean flatten = false;
    private boolean forceOverwrite = false;
    private Hashtable filecopyList = new Hashtable();
    /**
     * AntClassLoader for the nested &lt;classpath&gt; - if set.
     *
     * <p>We keep this here in order to reset the context classloader
     * in execute.  We can't use liaison.getClass().getClassLoader()
     * since the actual liaison class may have been loaded by a loader
     * higher up (system classloader, for example).</p>
     *
     * @since Ant 1.6.2
     */
    private AntClassLoader loader = null;

    /** Name of the TRAX Liaison class */
    private static final String TRAX_LIAISON_CLASS =
                        "org.apache.tools.ant.taskdefs.optional.TraXLiaison";

    /** Name of the now-deprecated XSLP Liaison class */
    private static final String XSLP_LIAISON_CLASS =
                        "org.apache.tools.ant.taskdefs.optional.XslpLiaison";

    /** Name of the now-deprecated Xalan liaison class */
    private static final String XALAN_LIAISON_CLASS =
                        "org.apache.tools.ant.taskdefs.optional.XalanLiaison";


    
    /**
     * The xsl attribute
     *
     * @param src the source file
     */
    public void setXsl(String _xsl) {
        xsl = _xsl;
    }
    
    /**
     * The src attribute
     *
     * @param src the source file
     */
    public void setSrc(File src) {
        srcDir = src;
    }
    
    /**
     * Set the optional classpath to the XSL processor
     *
     * @param classpath the classpath to use when loading the XSL processor
     */
    public void setClasspath(Path classpath) {
        createClasspath().append(classpath);
    }


    
    /**
     * Set the reference to an optional classpath to the XSL processor
     *
     * @param r the id of the Ant path instance to act as the classpath
     *          for loading the XSL processor
     */
    public void setClasspathRef(Reference r) {
        createClasspath().setRefid(r);
    }

    /**
     * Set the name of the XSL processor to use; optional, default trax.
     * Other values are "xalan" for Xalan1 and "xslp" for XSL:P, though the
     * later is strongly deprecated.
     *
     * @param processor the name of the XSL processor
     */
    public void setProcessor(String processor) {
        this.processor = processor;
    }
    
    /**
     * Set the optional classpath to the XSL processor
     *
     * @return a path instance to be configured by the Ant core.
     */
    public Path createClasspath() {
        if (classpath == null) {
            classpath = new Path(getProject());
        }
        return classpath.createPath();
    }






    /**
     * The dest attribute
     *
     * @param dest the destination file
     */
    public void setDest(File dest) {
        destDir = dest;
    }

    public void setFiltering(boolean filter) {
        filtering = filter;
    }

    public void setFlatten(boolean flatten) {
        this.flatten = flatten;
    }

    public void setForceoverwrite(boolean force) {
        forceOverwrite = force;
    }

    public void execute() throws BuildException {
       
        if (srcDir == null) 
        {
            throw new BuildException("src attribute must be set!", getLocation());
        }
        if (!srcDir.exists()) 
        {
            throw new BuildException("srcdir " + srcDir.toString() + " does not exist!", getLocation());
        }
        if (destDir == null) 
        {
            throw new BuildException("The dest attribute must be set.",getLocation());
        }
        if (srcDir.equals(destDir)) 
        {
            log("Warning: src == dest", Project.MSG_WARN);
        }

        DirectoryScanner ds = super.getDirectoryScanner(srcDir);
        OutputStream os = null;
		
        try 
		{
            String[] files = ds.getIncludedFiles();
            scanDir(srcDir, destDir, files);
            
            if (filecopyList.size() > 0) 
            {
                log("Transforming " + filecopyList.size() + " file" + (filecopyList.size() == 1 ? "" : "s") + " to " + destDir.getAbsolutePath());
                Enumeration e = filecopyList.keys();
                while (e.hasMoreElements()) 
                {
                    String fromFile = (String) e.nextElement();
                    String toFile = (String) filecopyList.get(fromFile);
                    try 
					{
                        getProject().copyFile(fromFile, toFile, filtering,forceOverwrite);
                        os = new java.io.FileOutputStream(toFile);
                    	
            			try 
            			{
            				 //Setup XSLT
            	            TransformerFactory factory = TransformerFactory.newInstance();
            	            Transformer transformer = factory.newTransformer(new StreamSource(xsl));
            				
            				for (Enumeration ee = params.elements(); ee.hasMoreElements();) 
            				{
            	                Param p = (Param) ee.nextElement();
            	                if (p.shouldUse()) 
            	                {
            	                   transformer.setParameter(p.getName(), p.getExpression());
            	                }            	            
            	            }
            	          
            	            //Setup input for XSLT transformation
            	            Source src = new StreamSource(fromFile);
            	        
            	            //Resulting SAX events (the generated FO) must be piped through to FOP
            	            Result res = new StreamResult(os);

            	            //Start XSLT transformation and FOP processing
            	            transformer.transform(src, res);
            	        } 
            			catch(Exception eee)
						{
            				eee.printStackTrace();
						}
            			finally 
            			{
            	            os.close();
            	        }
                        
                    } 
                    catch (Exception ioe) 
					{
                        String msg = "Failed to transform " + fromFile + " to " + toFile + " due to " + ioe.getMessage();
                        log(msg);
                        ioe.printStackTrace();
                        try
						{	
                        	os.close();
						}
                        catch(IOException er)
						{
                        	er.printStackTrace();
						}
                        throw new BuildException(msg, ioe, getLocation());
                        
                    }
                }
            }
        } 
        catch(Exception eeee)
		{
        	eeee.printStackTrace();
		}	
        finally 
		
		{
            filecopyList.clear();
        }
    }

    private void scanDir(File from, File to, String[] files) 
    {
        for (int i = 0; i < files.length; i++) 
        {
            String filename = files[i];
            File srcFile = new File(from, filename);
            File destFile;
            if (flatten) 
            {
                destFile = new File(to, new File(filename).getName());
            } 
            else 
            {
                destFile = new File(to, filename);
            }
            if (forceOverwrite || (srcFile.lastModified() > destFile.lastModified())) 
            {
                filecopyList.put(srcFile.getAbsolutePath(), destFile.getAbsolutePath());
            }
        }
    }

    /**
     * Create an instance of an XSL parameter for configuration by Ant.
     *
     * @return an instance of the Param class to be configured.
     */
    public Param createParam() {
        Param p = new Param();
        params.addElement(p);
        return p;
    }

    /**
     * The Param inner class used to store XSL parameters
     */
    public static class Param {
        /** The parameter name */
        private String name = null;

        /** The parameter's value */
        private String expression = null;

        private String ifProperty;
        private String unlessProperty;
        private Project project;

        /**
         * Set the current project
         *
         * @param project the current project
         */
        public void setProject(Project project) {
            this.project = project;
        }

        /**
         * Set the parameter name.
         *
         * @param name the name of the parameter.
         */
        public void setName(String name) {
            this.name = name;
        }

        /**
         * The parameter value
         * NOTE : was intended to be an XSL expression.
         * @param expression the parameter's value.
         */
        public void setExpression(String expression) {
            this.expression = expression;
        }

        /**
         * Get the parameter name
         *
         * @return the parameter name
         * @exception BuildException if the name is not set.
         */
        public String getName() throws BuildException {
            if (name == null) {
                throw new BuildException("Name attribute is missing.");
            }
            return name;
        }

        /**
         * Get the parameter's value
         *
         * @return the parameter value
         * @exception BuildException if the value is not set.
         */
        public String getExpression() throws BuildException {
            if (expression == null) {
                throw new BuildException("Expression attribute is missing.");
            }
            return expression;
        }

        /**
         * Set whether this param should be used.  It will be
         * used if the property has been set, otherwise it won't.
         * @param ifProperty name of property
         */
        public void setIf(String ifProperty) {
            this.ifProperty = ifProperty;
        }

        /**
         * Set whether this param should NOT be used. It
         * will not be used if the property has been set, otherwise it
         * will be used.
         * @param unlessProperty name of property
         */
        public void setUnless(String unlessProperty) {
            this.unlessProperty = unlessProperty;
        }
        /**
         * Ensures that the param passes the conditions placed
         * on it with <code>if</code> and <code>unless</code> properties.
         */
        public boolean shouldUse() {
            if (ifProperty != null && project.getProperty(ifProperty) == null) {
                return false;
            } else if (unlessProperty != null
                    && project.getProperty(unlessProperty) != null) {
                return false;
            }

            return true;
        }
    } // Param

    /**
     * Get the Liason implementation to use in processing.
     *
     * @return an instance of the XSLTLiason interface.
     */
    protected XSLTLiaison getLiaison() 
    {
        // if processor wasn't specified, see if TraX is available.  If not,
        // default it to xslp or xalan, depending on which is in the classpath
        if (liaison == null) 
        {
            if (processor != null) 
            {
                try
				{
                    resolveProcessor(processor);
                } 
                catch (Exception e) 
				{
                    throw new BuildException(e);
                }
            }
            else 
            {
                try 
				{
                    resolveProcessor("trax");
                } 
                catch (Throwable e1)
				{
                    try 
					{
                        resolveProcessor("xalan");
                    } 
                    catch (Throwable e2) 
					{
                        try 
						{
                            resolveProcessor("xslp");
                        } 
                        catch (Throwable e3) 
						{
                            e3.printStackTrace();
                            e2.printStackTrace();
                            throw new BuildException(e1);
                        }
                    }
                }
            }
        }
        return liaison;
    }
    
    /**
     * Load processor here instead of in setProcessor - this will be
     * called from within execute, so we have access to the latest
     * classpath.
     *
     * @param proc the name of the processor to load.
     * @exception Exception if the processor cannot be loaded.
     */
    private void resolveProcessor(String proc) throws Exception {
        if (proc.equals("trax")) {
            final Class clazz = loadClass(TRAX_LIAISON_CLASS);
            liaison = (XSLTLiaison) clazz.newInstance();
        } else if (proc.equals("xslp")) {
            log("DEPRECATED - xslp processor is deprecated. Use trax "
                + "instead.");
            final Class clazz = loadClass(XSLP_LIAISON_CLASS);
            liaison = (XSLTLiaison) clazz.newInstance();
        } else if (proc.equals("xalan")) {
            log("DEPRECATED - xalan processor is deprecated. Use trax "
                + "instead.");
            final Class clazz = loadClass(XALAN_LIAISON_CLASS);
            liaison = (XSLTLiaison) clazz.newInstance();
        } else {
            liaison = (XSLTLiaison) loadClass(proc).newInstance();
        }
    }

    /**
     * Load named class either via the system classloader or a given
     * custom classloader.
     *
     * @param classname the name of the class to load.
     * @return the requested class.
     * @exception Exception if the class could not be loaded.
     */
    private Class loadClass(String classname) throws Exception 
	{
        if (classpath == null) 
        {
            return Class.forName(classname);
        } 
        else 
        {
            loader = getProject().createClassLoader(classpath);
            loader.setThreadContextLoader();
            Class c = Class.forName(classname, true, loader);
            return c;
        }
    }


}

