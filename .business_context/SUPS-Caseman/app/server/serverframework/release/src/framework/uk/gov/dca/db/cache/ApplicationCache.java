package uk.gov.dca.db.cache;

import uk.gov.dca.db.util.ConfigUtil;
import edu.emory.mathcs.backport.java.util.concurrent.ConcurrentHashMap;

/**
 * Thread local application cache.  Supplies and initialisation
 * method to share the backing HashMap across threads.
 * 
 * @author Michael Barker
 *
 */
public class ApplicationCache
{
    private ConcurrentHashMap cache = null;
    
    private static ThreadLocal instance = new ThreadLocal() {
        protected synchronized Object initialValue ()
        {
           return new ApplicationCache();
        }        
    };
    
    /**
     * Allows a caller to initialise the cache with the backing
     * hash map.
     * @param cache
     */
    public ApplicationCache init(ConcurrentHashMap cache)
    {
        this.cache = cache;
        return this;
    }
    
    /**
     * Get an object from the cache.
     * 
     * @param key The key for the cache item.
     * @return
     */
    public Object get(Object key)
    {
        if (cache == null)
        {
            cache = new ConcurrentHashMap();
        }
        return cache.get(key);
    }
    
    /**
     * Clears the backing hash map.
     * @return
     */
    public ApplicationCache clear()
    {
        this.cache = null;
        return this;
    }
    
    /**
     * Put an object in the cache.
     * 
     * @param key The key for the cache item.
     * @param value The value to be associated to the key.
     * @return
     */
    public Object put(Object key, Object value)
    {
        if (cache == null)
        {
            cache = new ConcurrentHashMap();
        }
        cache.put(key, value);
        return this;
    }

    public static ApplicationCache getInstance()
    {
        return (ApplicationCache) instance.get();
    }
    
    public ConfigUtil getConfig(){
        return (ConfigUtil)get(ConfigUtil.APPLICATION_CONFIG_CONFIG_KEY);
    }
}
