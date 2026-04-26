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
package uk.gov.dca.utils.eventconfig;

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
 * Config Manager class to manage the configuration of variable data questions.
 */
public class VdManager
{
    
    /** The construction system exception. */
    private SystemException constructionSystemException;
    
    /** The m vd config manager instance. */
    private static VdManager mVdConfigManagerInstance = new VdManager ();

    /** The Constant VD_QUESTION_CONFIG_DOCUMENT. */
    private static final String VD_QUESTION_CONFIG_DOCUMENT = "uk/gov/dca/utils/eventconfig/vdconfig.xml";
    
    /** The m vd config list. */
    private HashMap<String, VdConfig> mVdConfigList = null;

    /**
     * Constructor.
     */
    public VdManager ()
    {
        try
        {
            mInitialise ();
        }
        catch (final SystemException e)
        {
            constructionSystemException = e;
        }
    } // CaseEventConfigManager()

    /**
     * Throws any error raised in initialisation.
     *
     * @throws SystemException any error raised in initialisation.
     */
    private void throwAnyConstructionException () throws SystemException
    {
        if (constructionSystemException != null)
        {
            throw constructionSystemException;
        }
    }

    /**
     * Gets the single instance of VdManager.
     *
     * @return single instance of VdManager
     * @throws SystemException the system exception
     */
    public static VdManager getInstance () throws SystemException
    {
        mVdConfigManagerInstance.throwAnyConstructionException ();
        return mVdConfigManagerInstance;
    }

    /**
     * Returns case event config data object.
     *
     * @param pFieldId String representing the event id to return
     * @return The config data object
     * @throws SystemException Thrown if event id not found in config file
     */
    public VdConfig getVdConfig (final String pFieldId) throws SystemException
    {
        final VdConfig vdConfig = (VdConfig) mVdConfigList.get (pFieldId);
        if (null == vdConfig)
        {
            throw new SystemException ("VdConfig: FieldId = [" + pFieldId + "] not found!");
        }

        return vdConfig;
    }

    /**
     * Initialise. Load vd config data.
     *
     * @throws SystemException Thrown if problems loading the configuration data
     */
    private void mInitialise () throws SystemException
    {
        final SAXBuilder builder;
        final Document document;

        try
        {
            mVdConfigList = new HashMap<String, VdConfig>();

            builder = new SAXBuilder ();
            document = builder.build (Util.getInputSource (VD_QUESTION_CONFIG_DOCUMENT, this));
            mProcessVdConfigList (document.getRootElement ());
        }
        catch (final IOException e)
        {
            throw new SystemException (
                    "Exception occurred loading Vd Configuration Data. " + VD_QUESTION_CONFIG_DOCUMENT, e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (
                    "Exception occurred loading Vd Configuration Data. " + VD_QUESTION_CONFIG_DOCUMENT, e);
        }
    }

    /**
     * Iterates through config list processing each item.
     *
     * @param pVdConfigListElement config list element
     * @throws SystemException Thrown if problems processing the events
     */
    private void mProcessVdConfigList (final Element pVdConfigListElement) throws SystemException
    {
        final List<Element> elementList;
        Element vdConfigElement;
        String elementName;

        elementList = pVdConfigListElement.getChildren ();

        for (Iterator<Element> i = elementList.iterator (); i.hasNext ();)
        {
            vdConfigElement = (Element) i.next ();
            elementName = vdConfigElement.getName ();

            if (elementName.equals ("VariableDataConfig"))
            {
                processVdConfig (vdConfigElement);
            }
        }
    }

    /**
     * Converts string to int.
     *
     * @param pValue String representation of the integer
     * @return int from the String
     */
    private int mGetInteger (final String pValue)
    {
        int increment = 0;
        if (null != pValue && !pValue.equals (""))
        {
            increment = new Integer (pValue).intValue ();
        }
        return increment;
    }

    /**
     * Set data in case event config DO based upon the case event config element passed in.
     * 
     * @param pvdConfigElement Case Event config element
     * @throws SystemException Thrown if problems processing the case event config element
     */
    private void processVdConfig (final Element pvdConfigElement) throws SystemException
    {
        final VdConfig vdConfig;
        final List<Element> elementList;
        Element currentElement;
        String elementName = null;
        String elementText = null;

        try
        {
            vdConfig = new VdConfig ();
            elementList = pvdConfigElement.getChildren ();

            for (Iterator<Element> i = elementList.iterator (); i.hasNext ();)
            {
                currentElement = (Element) i.next ();
                elementName = currentElement.getName ();
                elementText = currentElement.getText ().trim ();

                if (elementName.equals ("FieldId"))
                {
                    vdConfig.setFieldId (elementText);
                }
                else if (elementName.equals ("FieldType"))
                {
                    vdConfig.setFieldType (elementText);
                }
                else if (elementName.equals ("DefaultAnswer"))
                {
                    vdConfig.setDefaultAnswer (elementText);
                }
                else if (elementName.equals ("GridColumn"))
                {
                    vdConfig.setGridColumn (mGetInteger (elementText));
                }
                else if (elementName.equals ("DateIncrement"))
                {
                    vdConfig.setDateIncrement (mGetInteger (elementText));
                }
                else if (elementName.equals ("LOVId"))
                {
                    vdConfig.setLovId (elementText);
                }
            }
            mVdConfigList.put (vdConfig.getFieldId (), vdConfig);
        }
        catch (final Exception e)
        {
            throw new SystemException (
                    "processVdConfig(): Name = [" + elementName + "], Content = [" + elementText + "]", e);
        }
    }
}