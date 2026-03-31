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
package uk.gov.dca.caseman.ccbc_service.java;

import org.jdom.Element;

/**
 * Class: TmpRepXMLBuilder.java
 * 
 * @author Chris hutt
 *         Created: 21 nov 2005
 *         Description: This class is intended to provided assistance in creating the XML element
 *         structure that needs to be passed to the insertTmRep() service method.
 *         The insertTmRep() method requires the presence of a number of XML
 *         elements (tags), even if they are empty, otherwise it fall over.
 *         The getXMLElement() method will provide an XML Element structure with
 *         the set of Element required by the insertTmRep() method.
 * 
 *         Change History:
 *         v1.1 Chris Hutt 4 may 06
 *         defect 3070: variable naming convention
 *         defect 3071: javadoc
 * 
 */
public class TmpRepXMLBuilder
{

    /**
     * Report id element name.
     */
    public static final String TAG_REPORTID = "ReportId";
    /**
     * User name element name.
     */
    public static final String TAG_USERNAME = "UserName";
    /**
     * Parameter element name.
     */
    public static final String TAG_PARAMETER = "Parameter";
    /**
     * Value element name.
     */
    public static final String TAG_VALUE = "Value";
    /**
     * Job number element name.
     */
    public static final String TAG_JOBNUMBER = "JobNumber";
    /**
     * Time stamp element name.
     */
    public static final String TAG_TIMESTAMP = "TimeStamp";

    /** The tmp rep XML element. */
    private Element tmpRepXMLElement;
    
    /** The report id. */
    private String reportId;
    
    /** The user name. */
    private String userName;
    
    /** The parameter. */
    private String parameter;
    
    /** The value. */
    private String value;
    
    /** The job number. */
    private String jobNumber;
    
    /** The time stamp. */
    private String timeStamp;

    /**
     * This version of the constructor allows the class to initialised by an existing
     * XML Element. Any additional elements will not be discarded.
     *
     * @param pElement the element
     */
    public TmpRepXMLBuilder (final Element pElement)
    {
        // Take a copy of the input XML Element.
        // It may contain other elements that need to be passed on without manipulation.
        tmpRepXMLElement = (Element) pElement.clone ();

        reportId = mGetElementValue (pElement, TAG_REPORTID);
        userName = mGetElementValue (pElement, TAG_USERNAME);
        parameter = mGetElementValue (pElement, TAG_PARAMETER);
        value = mGetElementValue (pElement, TAG_VALUE);
        jobNumber = mGetElementValue (pElement, TAG_JOBNUMBER);
        timeStamp = mGetElementValue (pElement, TAG_TIMESTAMP);

    } // TmpRepXMLBuilder()

    /**
     * This version of the constructor allows the class to be constructed purely with scalar values.
     *
     * @param pReportId the report id
     * @param pUserName the user name
     * @param pParameter the parameter
     * @param pValue the value
     * @param pJobNumber the job number
     * @param pTimeStamp the time stamp
     */
    public TmpRepXMLBuilder (final String pReportId, final String pUserName, final String pParameter,
            final String pValue, final String pJobNumber, final String pTimeStamp)
    {
        super ();
        reportId = pReportId;
        userName = pUserName;
        parameter = pParameter;
        value = pValue;
        jobNumber = pJobNumber;
        timeStamp = pTimeStamp;
    }

    /**
     * (non-Javadoc)
     * Return the text content of an xml node, or return null if the node does not exist.
     * PJR
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
     * Set the text value of an xml node or create the node and set it's value if it does not exist.
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
     * @param pElementName Name of element to be returned
     * @return Contents of this class as an element
     */
    public Element getXMLElement (final String pElementName)
    {

        Element element = null;

        if (null == tmpRepXMLElement)
        {
            element = new Element (pElementName);
        }
        else
        {
            element = (Element) tmpRepXMLElement.clone ();
            element = (Element) element.detach ();
            element.setName (pElementName);
        }

        mSetElement (element, TAG_REPORTID, reportId);
        mSetElement (element, TAG_USERNAME, userName);
        mSetElement (element, TAG_PARAMETER, parameter);
        mSetElement (element, TAG_VALUE, value);
        mSetElement (element, TAG_JOBNUMBER, jobNumber);
        mSetElement (element, TAG_TIMESTAMP, timeStamp);

        return element;
    } // getXMLElement()

    /**
     * Gets the job number.
     *
     * @return the job number
     */
    public String getJobNumber ()
    {
        return jobNumber;
    }

    /**
     * Sets the job number.
     *
     * @param jobNumber the new job number
     */
    public void setJobNumber (final String jobNumber)
    {
        this.jobNumber = jobNumber;
    }

    /**
     * Gets the parameter.
     *
     * @return the parameter
     */
    public String getParameter ()
    {
        return parameter;
    }

    /**
     * Sets the parameter.
     *
     * @param parameter the new parameter
     */
    public void setParameter (final String parameter)
    {
        this.parameter = parameter;
    }

    /**
     * Gets the report id.
     *
     * @return the report id
     */
    public String getReportId ()
    {
        return reportId;
    }

    /**
     * Sets the report id.
     *
     * @param reportId the new report id
     */
    public void setReportId (final String reportId)
    {
        this.reportId = reportId;
    }

    /**
     * Gets the time stamp.
     *
     * @return the time stamp
     */
    public String getTimeStamp ()
    {
        return timeStamp;
    }

    /**
     * Sets the time stamp.
     *
     * @param timeStamp the new time stamp
     */
    public void setTimeStamp (final String timeStamp)
    {
        this.timeStamp = timeStamp;
    }

    /**
     * Gets the tmp rep XML element.
     *
     * @return the tmp rep XML element
     */
    public Element getTmpRepXMLElement ()
    {
        return tmpRepXMLElement;
    }

    /**
     * Sets the tmp rep XML element.
     *
     * @param tmpRepXMLElement the new tmp rep XML element
     */
    public void setTmpRepXMLElement (final Element tmpRepXMLElement)
    {
        this.tmpRepXMLElement = tmpRepXMLElement;
    }

    /**
     * Gets the user name.
     *
     * @return the user name
     */
    public String getUserName ()
    {
        return userName;
    }

    /**
     * Sets the user name.
     *
     * @param userName the new user name
     */
    public void setUserName (final String userName)
    {
        this.userName = userName;
    }

    /**
     * Gets the value.
     *
     * @return the value
     */
    public String getValue ()
    {
        return value;
    }

    /**
     * Sets the value.
     *
     * @param value the new value
     */
    public void setValue (final String value)
    {
        this.value = value;
    }
} // class TmpRepXMLBuilder
