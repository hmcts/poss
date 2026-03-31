/*
 * Converts a string of the form 
 * 
 * "{path}abc_service"
 * 
 * and returns 
 * 
 * "Abc"
 * 
 * params: dirName - the string to parse
 *         returnName - the property to set with the new value
 * 
 */
package uk.gov.dca.db.impl;

import java.util.StringTokenizer;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.Task;

public class ConvertServiceDirToBeanName extends Task {
   
	String dirName = null;
	String beanNameProperty = "bean_name";
	String beanSrcDirNameProperty = "bean_src_dir_name";

    /* (non-Javadoc)
     * @see org.apache.tools.ant.Task#execute()
     */
    public void execute() throws BuildException {
    	
      int beanPosition = dirName.lastIndexOf("_service");
      int lastSeparatorPosition = dirName.lastIndexOf(System.getProperty("file.separator"));
      
      if (beanPosition == -1) {
      	throw new BuildException("Incorrectly formed service name passed to ConvertServiceDirToBeanName");
      }
      
      String beanName = dirName.substring(lastSeparatorPosition + 1,beanPosition);
      String leadingChar = beanName.substring(0,1).toUpperCase();
      
      String newBeanName = "";
      StringTokenizer toc = new StringTokenizer(beanName,"_");
      while(toc.hasMoreTokens()){
      	final String tmptoc = toc.nextToken("_");
      	leadingChar = tmptoc.substring(0,1).toUpperCase();      	
      	newBeanName = newBeanName + leadingChar.concat(tmptoc.substring(1).toLowerCase());
      }
     
      
      Project project = this.getProject(); 
      project.setNewProperty(beanNameProperty,newBeanName);
      
      project.setNewProperty(beanSrcDirNameProperty,beanName + "_service");
    }
        
    /**
     * @return Get name of service directory
     */
    public String getdirName() {
        return dirName;
    }
    /**
     * @param Set name of service directory. 
     */
    public void setdirName(String dirName) {
        this.dirName = dirName;
    }

}