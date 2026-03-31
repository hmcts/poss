/*
 * Created on 22-Apr-2005
 *
 */
package uk.gov.dca.db.util;

import org.apache.tools.ant.Project;
import org.apache.tools.ant.Task;

/**
 * @author Michael Barker
 *
 */
public class BaseSupsTask extends Task
{
   private boolean verbose = false;
   
   public void setVerbose(boolean verbose)
   {
       this.verbose = verbose;
   }
   
   public boolean getVerbose()
   {
       return this.verbose;
   }
   
   public void verbose(String s)
   {
       if (getVerbose())
       {
           log(s,Project.MSG_VERBOSE);
       }
   }
   
   public void verbose(Exception e)
   {
       if (getVerbose())
       {
           log(e.getMessage(),Project.MSG_VERBOSE);
           e.printStackTrace();
       }
   }
}
