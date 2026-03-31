/*
 * Created on 19-Apr-2005
 *
 */
package uk.gov.dca.db.async;

/**
 * @author Michael Barker
 *
 */
public abstract class AbstractDestination implements Destination
{
    private String jndiName;
    private String id;
    private int minPoolSize;
    private int maxPoolSize;
    private String factory;

    /**
     * @see uk.gov.dca.db.async.Destination#getJndiName()
     */
    public String getJndiName()
    {
        return this.jndiName;
    }
    
    public void setJndiName(String jndiName)
    {
        this.jndiName = jndiName;
    }
    
    public void setId(String id)
    {
        this.id = id;
    }
    
    public String getId()
    {
        return this.id;
    }
    

    /**
     * @return Returns the maxPoolSize.
     */
    public int getMaxPoolSize()
    {
        return maxPoolSize;
    }
    /**
     * @param maxPoolSize The maxPoolSize to set.
     */
    public void setMaxPoolSize(int maxPoolSize)
    {
        this.maxPoolSize = maxPoolSize;
    }
    /**
     * @return Returns the minPoolSize.
     */
    public int getMinPoolSize()
    {
        return minPoolSize;
    }
    /**
     * @param minPoolSize The minPoolSize to set.
     */
    public void setMinPoolSize(int minPoolSize)
    {
        this.minPoolSize = minPoolSize;
    }
    
    
   /**
    * @return Returns the factory.
    */
   public String getFactory()
   {
      return factory;
   }
   /**
    * @param factory The factory to set.
    */
   public void setFactory(String factory)
   {
      this.factory = factory;
   }
}
