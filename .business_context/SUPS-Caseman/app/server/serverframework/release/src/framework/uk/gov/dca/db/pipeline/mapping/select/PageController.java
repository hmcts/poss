/*
 * Created on 11-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.select;

import java.util.regex.Matcher;

import org.jdom.Element;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IQueryContextReader;
import uk.gov.dca.db.pipeline.Query;

/**
 * Class used for the controlling the reading of pages of information from the client.
 * 
 * @author Michael Barker
 *
 */
public class PageController {

    private String m_pageSizeParameter = null;
    private String m_pageNumberParameter = null;
    
    private int m_pageSize;
    private int m_pageNumber;
    
    public PageController(Element ePaged) throws SystemException {
        
        if (ePaged == null) return;
        
        String pageSize = ePaged.getAttributeValue("pageSize");
        String pageNumber = ePaged.getAttributeValue("pageNumber");
    
        
        if ( pageSize != null && pageSize.length() > 0 &&
                pageNumber != null && pageNumber.length() > 0 ) {
            init(pageSize, pageNumber);
        }
        else {
            throw new SystemException("Page controller configuration is invalid");
        }
    }
    
    public PageController(String pageSize, String pageNumber) {
        init(pageSize, pageNumber);
    }
    
    public void init(String pageSize, String pageNumber) {
        //see if parameterised:
        Matcher vars = Query.s_variablePattern.matcher(pageSize);
        if (vars.find()) {
            m_pageSizeParameter = vars.group(1);
        }
        else {
            m_pageSize = Integer.parseInt(pageSize);
        }
        
        vars = Query.s_variablePattern.matcher(pageNumber);
        if (vars.find()) {
            m_pageNumberParameter = vars.group(1);
        }
        else {
            m_pageNumber = Integer.parseInt(pageNumber);
        }
    }
        
    public int getPageSize(IQueryContextReader context) throws SystemException {
        if (m_pageSizeParameter != null) {
            return Integer.parseInt(context.getValue(m_pageSizeParameter.toUpperCase()).toString());
        }
        else {
            return m_pageSize;
        }
    }
    
    public int getPageNumber(IQueryContextReader context) throws SystemException {
        if (m_pageSizeParameter != null) {
            return Integer.parseInt(context.getValue(m_pageNumberParameter.toUpperCase()).toString());
        }
        else {
            return m_pageNumber;
        }
    }
    
}
