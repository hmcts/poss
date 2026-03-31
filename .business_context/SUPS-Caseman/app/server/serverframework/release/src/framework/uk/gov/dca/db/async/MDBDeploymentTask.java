/*
 * Created on 19-Apr-2005
 *
 */
package uk.gov.dca.db.async;

import java.io.File;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.tools.ant.BuildException;

import uk.gov.dca.db.util.BaseSupsTask;
import uk.gov.dca.db.util.BuildUtil;

/**
 * @author Michael Barker
 *
 */
public class MDBDeploymentTask extends BaseSupsTask
{
    public final static String TRANSACTION_TYPE = "Container";
    public final static String QUEUE_PATH = "//item[@class='uk.gov.dca.db.impl.QueueConfigurationItem']";
    public final static String TOPIC_PATH = "//item[@class='uk.gov.dca.db.impl.TopicConfigurationItem']";

    private String root;
    private String projectConfig;
    private String packageName;
    private List subTasks = new ArrayList();
    
    public void execute() throws BuildException
    {
        verbose("Loading root directory: " + root);
        File rootDir = BuildUtil.getDir("root", root);
        
        String projectConfigFilename = root + File.separator + packageName.replace('.', File.separatorChar) + File.separator + projectConfig;
        verbose("Loading project config file: " + projectConfigFilename);
        File projectConfigFile = BuildUtil.getFile("projectConfig", projectConfigFilename);
        
        String[] packages = new String[] { packageName };
        List serviceMetaData = BuildUtil.getServiceMetaData(rootDir, packages);
        verbose(serviceMetaData.toString());
        
        for (Iterator i = subTasks.iterator(); i.hasNext();)
        {
            DescriptorSubTask dst = (DescriptorSubTask) i.next();
            dst.setVerbose(getVerbose());
            dst.process(projectConfigFile, packageName, serviceMetaData);
        }
        
    }
    
    /**
     * Add a sub task to the list of descriptor tasks to execute.
     * @param dst
     */
    public void addDescriptorSubTask(DescriptorSubTask dst)
    {
        this.subTasks.add(dst);
    }
    
    public void addEjbjar(EjbJarDescriptorSubTask ejdst)
    {
        addDescriptorSubTask(ejdst);
    }
    
    public void addJboss(JBossDescriptorSubTask jdst)
    {
        addDescriptorSubTask(jdst);        
    }
    
    public void addOrion(OrionEjbJarDescriptorSubTask oejbdst)
    {
        addDescriptorSubTask(oejbdst);
    }
   

    /**
     * @param projectConfig The projectConfig to set.
     */
    public void setProjectConfig(String projectConfig)
    {
        this.projectConfig = projectConfig;
    }
    
    public void setRoot(String root)
    {
        this.root = root;
    }
    
    public void setPackageName(String packageName)
    {
        this.packageName = packageName;
    }
    
}
