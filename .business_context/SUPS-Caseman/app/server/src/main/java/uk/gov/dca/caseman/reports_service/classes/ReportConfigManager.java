/* Copyrights and Licenses
 * 
 * Copyright (c) 2016 by the Ministry of Justice. All rights reserved.
 * Redistribution and use in source and binary forms, with or without modification, are permitted
 * provided that the following conditions are met:
 * - Redistributions of source code must retain the above copyright notice, this list of conditions
 * and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice, this list of
 * conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 * - All advertising materials mentioning features or use of this software must display the
 * following acknowledgment: "This product includes CaseMan (County Court management system)."
 * - Products derived from this software may not be called "CaseMan" nor may
 * "CaseMan" appear in their names without prior written permission of the
 * Ministry of Justice.
 * - Redistributions of any form whatsoever must retain the following acknowledgment: "This
 * product includes CaseMan."
 * This software is provided "as is" and any expressed or implied warranties, including, but
 * not limited to, the implied warranties of merchantability and fitness for a particular purpose are
 * disclaimed. In no event shall the Ministry of Justice or its contributors be liable for any
 * direct, indirect, incidental, special, exemplary, or consequential damages (including, but
 * not limited to, procurement of substitute goods or services; loss of use, data, or profits;
 * or business interruption). However caused any on any theory of liability, whether in contract,
 * strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this
 * software, even if advised of the possibility of such damage.
 * 
 * TODO Id: $
 * TODO LastChangedRevision: $
 * TODO LastChangedDate: $
 * TODO LastChangedBy: $ 
 */
package uk.gov.dca.caseman.reports_service.classes;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.Util;

/**
 * Change History:
 * 16-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 * 25-Jul-2006 Paul Roberts: Removed unused logging object.
 * 
 * @author Anoop Sehdev
 */
public class ReportConfigManager
{

    /** The m report config manager instance. */
    private static ReportConfigManager mReportConfigManagerInstance;
    
    /** The Constant REPORT_CONFIG_DOCUMENT. */
    private static final String REPORT_CONFIG_DOCUMENT = "uk/gov/dca/caseman/reports_service/xml/ReportConfig.xml";
    
    /** The m report config DO list. */
    private HashMap<String, ReportConfigDO> mReportConfigDOList;

    /**
     * Instantiates a new report config manager.
     *
     * @throws SystemException the system exception
     */
    protected ReportConfigManager () throws SystemException
    {
        mInitialise ();
    } // ReportConfigManager()

    /**
     * Gets the single instance of ReportConfigManager.
     *
     * @return single instance of ReportConfigManager
     * @throws SystemException the system exception
     */
    public static ReportConfigManager getInstance () throws SystemException
    {
        if (null == mReportConfigManagerInstance)
        {
            mReportConfigManagerInstance = new ReportConfigManager ();
        }

        return mReportConfigManagerInstance;
    } // getInstance()

    /**
     * Returns the report config data object.
     * 
     * @param reportName The report name.
     * @return The config data object.
     */
    public ReportConfigDO getReportConfigDO (final String reportName)
    {
        final ReportConfigDO reportConfigDO = (ReportConfigDO) mReportConfigDOList.get (reportName);

        return reportConfigDO;
    } // getReportConfigDO()

    /**
     * M initialise.
     *
     * @throws SystemException the system exception
     */
    private void mInitialise () throws SystemException
    {
        SAXBuilder builder = null;
        Document document = null;

        try
        {
            mReportConfigDOList = new HashMap<String, ReportConfigDO>();

            builder = new SAXBuilder ();
            document = builder.build (Util.getInputSource (REPORT_CONFIG_DOCUMENT, this));
            mProcessReportConfigList (document.getRootElement ());
        }
        catch (final JDOMException e)
        {
            throw new SystemException (
                    "Exception occurred loading Report Configuration Data. (" + e.getMessage () + ")", e);
        }
        catch (final IOException e)
        {
            throw new SystemException (
                    "Exception occurred loading Report Configuration Data. (" + e.getMessage () + ")", e);
        }
    } // mInitialise()

    /**
     * (non-Javadoc)
     * Process any ReportConfig elements.
     *
     * @param pReportConfigListElement the report config list element
     */
    private void mProcessReportConfigList (final Element pReportConfigListElement)
    {
        List<Element> elementList = null;
        Element reportConfigElement = null;
        String elementName = null;

        elementList = pReportConfigListElement.getChildren ();

        for (Iterator<Element> i = elementList.iterator (); i.hasNext ();)
        {
            reportConfigElement = (Element) i.next ();
            elementName = reportConfigElement.getName ();

            if (elementName.equals ("ReportConfig"))
            {
                processReportConfigDO (reportConfigElement);
            }
        }

    } // mProcessReportConfigElement()

    /**
     * M get boolean.
     *
     * @param pValue the value
     * @return true, if successful
     */
    private boolean mGetBoolean (final String pValue)
    {
        boolean bResult = false;

        if (null != pValue)
        {
            if (pValue.equalsIgnoreCase ("true"))
            {
                bResult = true;
            }
        }

        return bResult;
    } // mGetBoolean()

    /**
     * (non-Javadoc)
     * Process a ReportConfig element.
     *
     * @param pReportConfigElement the report config element
     */
    private void processReportConfigDO (final Element pReportConfigElement)
    {
        ReportConfigDO reportConfigDO = null;
        List<Element> elementList = null;
        Element currentElement = null;
        String elementName = null;
        String elementText = null;

        reportConfigDO = new ReportConfigDO ();
        elementList = pReportConfigElement.getChildren ();

        for (Iterator<Element> i = elementList.iterator (); i.hasNext ();)
        {
            currentElement = (Element) i.next ();
            elementName = currentElement.getName ();
            elementText = currentElement.getText ().trim ();

            if (elementName.equals ("Name"))
            {
                reportConfigDO.setReportName (elementText);
            }
            else if (elementName.equals ("Reprint"))
            {
                reportConfigDO.setReprint (mGetBoolean (elementText));
            }
            else if (elementName.equals ("UpdateSystemData"))
            {
                reportConfigDO.setUpdateSystemData (mGetBoolean (elementText));
            }
            else if (elementName.equals ("SendReportSequence"))
            {
                reportConfigDO.setSendReportSequence (mGetBoolean (elementText));
            }
            else if (elementName.equals ("WaitForCompletion"))
            {
                reportConfigDO.setWaitForCompletion (mGetBoolean (elementText));
            }
            else if (elementName.equals ("BulkPrint"))
            {
                reportConfigDO.setBulkPrint (mGetBoolean (elementText));
            }
        }

        mReportConfigDOList.put (reportConfigDO.getReportName (), reportConfigDO);
    } // processReportConfigDO()

} // class ReportConfigManager