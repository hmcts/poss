/*
 * Created on 12-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping;

import java.util.Map;

import org.jdom.Element;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.ConfigurationException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractComponent2;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.IGenerator;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;

public abstract class DBService extends AbstractComponent2 implements IGenerator {

    protected PivotDefinitions m_pd = null;
    

    public void validate(String methodId, QueryEngineErrorHandler handler,
            Element processingInstructions, Map preloadCache)
            throws SystemException {
        // TODO Auto-generated method stub

    }

    public void preloadCache(Element processingInstructions, Map preloadCache)
            throws SystemException {
        
        try {
            Element eQueryDef = processingInstructions.getChild("QueryDef");
            if ( eQueryDef == null ){
                throw new ConfigurationException("'QueryDef' element required for '"+getName()+"'");
            }
            String sFile = eQueryDef.getAttributeValue("location");
            String key = "Linked:" + sFile;
            if ( sFile == null ) {
                throw new ConfigurationException("'location' attribute required for  'QueryDef' element of '"+getName()+"'");
            }
            // only create and add a new querydefinitions object if not already in the cache.
            PivotDefinitions pd = (PivotDefinitions) preloadCache.get(key); 
            if ( pd == null )
            {
                String service = (String) m_context.getSystemItem(IComponentContext.SERVICE_NAME_KEY);
                pd = new PivotDefinitions(service, sFile, preloadCache);
                preloadCache.put(key, pd);
            }
            
            String method = (String) m_context.getSystemItem(IComponentContext.METHOD_NAME_KEY);
            pd.addExtensions(method, processingInstructions, preloadCache);            
        }
        catch (BusinessException e) {
            // This is not expected to occur.
            throw new SystemException(e.getMessage(), e);
        }
        
    }

    /**
     * Gets the pivot definitions for this service.
     */
    public void prepare(Element processingInstructions, Map preloadCache)
            throws SystemException {
        
        Element eQueryDef = processingInstructions.getChild("QueryDef");
        if ( eQueryDef == null ){
            throw new ConfigurationException("'QueryDef' element required for '"+getName()+"'");
        }
        String sFile = eQueryDef.getAttributeValue("location");
        String key = "Linked:" + sFile;
        m_pd = (PivotDefinitions) preloadCache.get(key);

        if (m_pd == null) {
            throw new SystemException("No Pivot Definitions for query def: " + sFile);
        }
    }

}
