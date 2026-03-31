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

import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;

import org.jdom.Element;

/**
 * Class: RequestReportXMLBuilder.java
 * 
 * @author Chris hutt
 *         Created: 10-Oct-2005
 *         Description: This class is intended to provided assistance in creating the XML element
 *         structure that needs to be passed to the RequestReport() service method.
 *         The RequestReport() method requires the presence of a number of XML
 *         elements (tags), even if they are empty, otherwise it fall over.
 *         The getXMLElement() method will provide an XML Element structure with
 *         the set of Element required by the RequestReport() method.
 */
public class RequestReportXMLBuilder
{

    /** The Constant TAG_REPORT. */
    private static final String TAG_REPORT = "Report";
    
    /** The Constant TAG_REPORTMODULE. */
    private static final String TAG_REPORTMODULE = "ReportModule";
    
    /** The Constant TAG_REPORTMODULE_GROUP. */
    private static final String TAG_REPORTMODULE_GROUP = "ReportModuleGroup";
    
    /** The Constant TAG_PRINTJOBID. */
    private static final String TAG_PRINTJOBID = "PrintJobId";
    
    /** The Constant TAG_JOBID. */
    private static final String TAG_JOBID = "Jobid";
    
    /** The Constant TAG_COURTCODE. */
    private static final String TAG_COURTCODE = "CourtCode";
    
    /** The Constant TAG_COURTUSER. */
    private static final String TAG_COURTUSER = "CourtUser";
    
    /** The Constant TAG_SPECIFICPARAMETERS. */
    private static final String TAG_SPECIFICPARAMETERS = "SpecificParameters";
    
    /** The Constant TAG_PARAMETER. */
    private static final String TAG_PARAMETER = "Parameter";
    
    /** The Constant TAG_VIEW. */
    private static final String TAG_VIEW = "View";
    
    /** The Constant TAG_SERVICE. */
    private static final String TAG_SERVICE = "Service";

    /** The Report module. */
    private String ReportModule;
    
    /** The Print job id. */
    private String PrintJobId;
    
    /** The Job id. */
    private String JobId;
    
    /** The Court code. */
    private String CourtCode;
    
    /** The Court user. */
    private String CourtUser;
    
    /** The Parameter. */
    private String Parameter;
    
    /** The Specific parameters. */
    private Element SpecificParameters;
    
    /** The report module group. */
    private String reportModuleGroup = "";

    /**
     * Gets the report module group.
     *
     * @return the report module group
     */
    public String getReportModuleGroup ()
    {
        return reportModuleGroup;
    }

    /**
     * Sets the report module group.
     *
     * @param reportModuleGroup the new report module group
     */
    public void setReportModuleGroup (final String reportModuleGroup)
    {
        this.reportModuleGroup = reportModuleGroup;
    }

    /** The request report XML element. */
    private Element requestReportXMLElement = null;

    /**
     * This version of the constructor allows the class to initialised by an existing
     * XML Element. Any additional elements will not be discarded.
     * 
     * @param pElement The parameters element.
     */
    public RequestReportXMLBuilder (final Element pElement)
    {
        // Take a copy of the input XML Element.
        // It may contain other elements that need to be passed on without manipulation.
        requestReportXMLElement = (Element) pElement.clone ();

        ReportModule = mGetElementValue (pElement, TAG_REPORTMODULE);
        PrintJobId = mGetElementValue (pElement, TAG_PRINTJOBID);
        JobId = mGetElementValue (pElement, TAG_JOBID);
        CourtCode = mGetElementValue (pElement, TAG_COURTCODE);
        CourtUser = mGetElementValue (pElement, TAG_COURTUSER);
        SpecificParameters = mGetElement (pElement, TAG_SPECIFICPARAMETERS);

    } // RequestReportXMLBuilder()

    /**
     * This version of the constructor allows the class to be constructed purely with
     * scalar values and a hasMap containing the SpecificParameters.
     * 
     * @param pReportModule The report module.
     * @param pPrintJobId The print job id.
     * @param pJobId The job id.
     * @param pCourtCode The court code.
     * @param pCourtUser The court user.
     * @param pParamMap The parameters hash map.
     */
    public RequestReportXMLBuilder (final String pReportModule, final String pPrintJobId, final String pJobId,
            final String pCourtCode, final String pCourtUser, final HashMap<String, String> pParamMap)
    {
        super ();
        String key = null;
        String value = null;
        Element paramElement = null;

        ReportModule = pReportModule;
        PrintJobId = pPrintJobId;
        JobId = pJobId;
        CourtCode = pCourtCode;
        CourtUser = pCourtUser;

        final Set<String> keys = pParamMap.keySet ();
        final Iterator<String> it = keys.iterator ();

        SpecificParameters = new Element ("SpecificParameters");
        while (it.hasNext ())
        {
            key = (String) it.next ();
            value = (String) pParamMap.get (key);

            paramElement = new Element (Parameter);
            paramElement.setAttribute ("name", key);
            paramElement.addContent (value);
            SpecificParameters.addContent (paramElement);
        }
    }

    /**
     * This version of the constructor allows the class to be constructed purely with
     * scalar values.
     * 
     * @param pReportModule The report module.
     * @param pPrintJobId The print job id.
     * @param pJobId The job id.
     * @param pCourtCode The court code.
     * @param pCourtUser The court user.
     */
    public RequestReportXMLBuilder (final String pReportModule, final String pPrintJobId, final String pJobId,
            final String pCourtCode, final String pCourtUser)
    {
        super ();
        final String key = null;
        final String value = null;
        final Element paramElement = null;

        ReportModule = pReportModule;
        PrintJobId = pPrintJobId;
        JobId = pJobId;
        CourtCode = pCourtCode;
        CourtUser = pCourtUser;
        SpecificParameters = new Element ("specificParameters");

    }

    /**
     * (non-Javadoc)
     * Get the text value of an element.
     *
     * @param pElement the element
     * @param pChildTagName the child tag name
     * @return the string
     */
    private String mGetElementValue (final Element pElement, final String pChildTagName)
    {
        String sValue = null;
        Element childElement = null;

        try
        {
            childElement = pElement.getChild (pChildTagName);
            if (null != childElement)
            {
                sValue = childElement.getText ();
            }
        }
        finally
        {
            childElement = null;
        }

        return sValue;
    } // mGetElementValue()

    /**
     * (non-Javadoc)
     * Get a child element from a parent.
     *
     * @param pElement the element
     * @param pChildTagName the child tag name
     * @return the element
     */
    private Element mGetElement (final Element pElement, final String pChildTagName)
    {
        Element childElement = null;

        try
        {
            childElement = pElement.getChild (pChildTagName);
        }
        finally
        {
        }

        return childElement;
    } // mGetElementValue()

    /**
     * (non-Javadoc)
     * Set the text of an element after creating the element if necessary.
     *
     * @param pParentElement the parent element
     * @param pElementName the element name
     * @param pElementContent the element content
     */
    private void mSetElement (final Element pParentElement, final String pElementName, final String pElementContent)
    {
        Element element = null;

        try
        {
            element = pParentElement.getChild (pElementName);
            if (null == element)
            {
                element = new Element (pElementName);
                pParentElement.addContent (element);
            }
            element.setText (pElementContent);
        }
        finally
        {
            element = null;
        }
    } // mSetElement()

    /**
     * Translate the content of this class into an XML Element with the given tag name.
     * Sets the specified tag elements to the values held in the class attributes,
     * and copies any additional elements which may have been passed in via the constructor.
     * 
     * @param pElementName The element name.
     * @return The xml element.
     */
    public Element getXMLElement (final String pElementName)
    {

        Element element = null;
        final Element specificParametersElement = null;

        if (null == requestReportXMLElement)
        {
            element = new Element (pElementName);
        }
        else
        {
            element = (Element) requestReportXMLElement.clone ();
            element = (Element) element.detach ();
            element.setName (pElementName);
        }

        mSetElement (element, TAG_REPORTMODULE, ReportModule);
        mSetElement (element, TAG_PRINTJOBID, PrintJobId);
        mSetElement (element, TAG_JOBID, JobId);
        mSetElement (element, TAG_COURTCODE, CourtCode);
        mSetElement (element, TAG_COURTUSER, CourtUser);
        mSetElement (element, TAG_VIEW, "No");
        mSetElement (element, TAG_SERVICE, "Custom");
        mSetElement (element, TAG_REPORTMODULE_GROUP, reportModuleGroup);

        element.addContent ((Element) SpecificParameters.clone ());

        return element;
    } // getXMLElement()

    /**
     * Add a parameter to Specific Parameters.
     *
     * @param pName The parameter name.
     * @param pContent The parameter content.
     */
    public void addSpecificParameter (final String pName, final String pContent)
    {
        final Element paramElement = new Element ("Parameter");
        paramElement.setAttribute ("name", pName);
        paramElement.addContent (pContent);
        SpecificParameters.addContent (paramElement);
    }

    /**
     * Gets the court code.
     *
     * @return the court code
     */
    public String getCourtCode ()
    {
        return CourtCode;
    }

    /**
     * Sets the court code.
     *
     * @param courtCode the new court code
     */
    public void setCourtCode (final String courtCode)
    {
        CourtCode = courtCode;
    }

    /**
     * Gets the court user.
     *
     * @return the court user
     */
    public String getCourtUser ()
    {
        return CourtUser;
    }

    /**
     * Sets the court user.
     *
     * @param courtUser the new court user
     */
    public void setCourtUser (final String courtUser)
    {
        CourtUser = courtUser;
    }

    /**
     * Gets the job id.
     *
     * @return the job id
     */
    public String getJobId ()
    {
        return JobId;
    }

    /**
     * Sets the job id.
     *
     * @param jobId the new job id
     */
    public void setJobId (final String jobId)
    {
        JobId = jobId;
    }

    /**
     * Gets the prints the job id.
     *
     * @return the prints the job id
     */
    public String getPrintJobId ()
    {
        return PrintJobId;
    }

    /**
     * Sets the prints the job id.
     *
     * @param printJobId the new prints the job id
     */
    public void setPrintJobId (final String printJobId)
    {
        PrintJobId = printJobId;
    }

    /**
     * Gets the report module.
     *
     * @return the report module
     */
    public String getReportModule ()
    {
        return ReportModule;
    }

    /**
     * Sets the report module.
     *
     * @param reportModule the new report module
     */
    public void setReportModule (final String reportModule)
    {
        ReportModule = reportModule;
    }
} // class RequestReportXMLBuilder
