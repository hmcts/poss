package uk.gov.dca.db.pipeline.mapping;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.mapping.jdbc.Handler;
import uk.gov.dca.db.pipeline.mapping.select.PageController;
import uk.gov.dca.db.util.ClassUtil;
import uk.gov.dca.db.util.XML;

/**
 * Pivot config contains all of the static configuration items specified
 * in a query or a query extension.
 * 
 * @author Michael Barker
 *
 */
public class PivotConfig {

    private final static String PAGED_ELEMENT = "Paged";
    private final static String HINT_ELEMENT = "Hint";
    private final static XPath HANDLER_PATH;
    private final static String SELECT_DISTINCT_ATTR = "selectDistinct";
    private final static String NAME_ATTR = "name";
    private final static String CLASS_ATTR = "class";
    private final static PivotConfig DEFAULT_CONFIG = new PivotConfig(false, null, null, new HashMap(), null);
    
    private final boolean isSelectDistinct;
    private PageController pageController;
    private final String hint;
    private final Map customHandlers;
    private final String orderBy;
    
    static {
        try {
            HANDLER_PATH = XPath.newInstance("./Handlers/Handler");
        }
        catch (JDOMException e) {
            throw new RuntimeException("Unable to initialise PivotDefinintions class, THIS IS A BUG.", e);
        }
    }
    
    public PivotConfig(PivotConfig config)
    {
        this.isSelectDistinct = config.isSelectDistinct;
        this.pageController = config.pageController;
        this.hint = config.hint;
        this.customHandlers = config.customHandlers;
        this.orderBy = config.orderBy;
    }
    
    
    public PivotConfig(boolean isSelectDistinct, PageController pageController, 
            String hint, Map customHandlers, String orderBy)
    {
        this.isSelectDistinct = isSelectDistinct;
        this.pageController = pageController;
        this.hint = hint;
        this.customHandlers = customHandlers;
        this.orderBy = orderBy;
    }

    public Map getCustomHandlers() {
        return customHandlers;
    }

    public String getHint() {
        return hint;
    }

    public boolean isSelectDistinct() {
        return isSelectDistinct;
    }

    public String getOrderBy() {
        return orderBy;
    }

    public PageController getPageController() {
        return pageController;
    }

    public static PivotConfig create(PivotConfig defaultConfig, Element eQuery) throws SystemException {
        
        if (defaultConfig == null) {
            defaultConfig = DEFAULT_CONFIG;
        }
        
        boolean isSelectDistinct = getSelectDistinct(eQuery, defaultConfig.isSelectDistinct());
        PageController pc = getPageController(eQuery);
        String hint = getHint(eQuery);
        hint = hint != null ? hint : defaultConfig.getHint();
        
        String orderBy = getOrderBy(eQuery);
        orderBy = orderBy != null ? orderBy : defaultConfig.getOrderBy();
        
        Map customHandlers = new HashMap(defaultConfig.getCustomHandlers());
        customHandlers.putAll(getHandlers(eQuery));

        return new PivotConfig(isSelectDistinct,pc, hint, customHandlers, orderBy);
    }
    
    /**
     * Gets the page controller from an element.
     * 
     * @param query
     * @return
     * @throws SystemException 
     * @throws  
     */
    private static PageController getPageController(Element eQuery) throws SystemException  {
        
        Element ePageController = eQuery.getChild(PAGED_ELEMENT);
        PageController pageController = null; 
        
        if (ePageController != null) {
            pageController = new PageController(ePageController);
        }
        
        return pageController;
        
    }
    
    public static Map getHandlers(Element eQuery) throws SystemException {
        Map handlers = new HashMap();
        
        try {
            List eHandlers = HANDLER_PATH.selectNodes(eQuery);
            for (Iterator i = eHandlers.iterator(); i.hasNext();) {
                Element e = (Element) i.next();
                String name = e.getAttributeValue(NAME_ATTR);
                String className = e.getAttributeValue(CLASS_ATTR);
                
                if (name == null) {
                    throw new SystemException("The handler field name is not defined");
                }
                else if (className == null) {
                    throw new SystemException("The handler class name is not defined");
                }
                else {
                    try {
                        Class clazz = ClassUtil.loadClass(className);
                        Object o = clazz.newInstance();
                        if (o instanceof Handler) {
                            handlers.put(name, o);
                        }
                        else {
                            throw new SystemException("Class specified does not implement the Handler interface: " + className);
                        }
                    } 
                    catch (ClassNotFoundException e1) {
                        throw new SystemException("Unable to load class: " + className, e1);
                    } 
                    catch (InstantiationException e1) {
                        throw new SystemException("Unable to create handler: " + className, e1);
                    } 
                    catch (IllegalAccessException e1) {
                        throw new SystemException("Unable to create handler: " + className, e1);
                    }
                }
                
            }
        } 
        catch (JDOMException e) {
            throw new SystemException("Unable to query for custom handlers", e);
        }
        
        return handlers;
    }

    public static boolean getSelectDistinct(Element eQuery, boolean defaultVal) {
        return XML.getBoolAttr(eQuery, SELECT_DISTINCT_ATTR, defaultVal);
    }
    
    public static String getHint(Element eQuery) {
        return eQuery.getChildText(HINT_ELEMENT);
    }
    
    public static String getOrderBy(Element eQuery) {
        return eQuery.getChildTextNormalize("OrderBy");
    }

    
}
