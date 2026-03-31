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
package uk.gov.dca.caseman.co_service.java;

import org.jdom.Element;

/**
 * Class: CoUpdateOnEventCommitXMLBuilder.java
 * 
 * @author Chris hutt
 *         Created: 25-July-2005
 *         Description: This class is intended to provided assistance in creating the XML element
 *         structure that needs to be passed to the updateCoOnEventCommit() service method.
 *         The updateCoOnEventCommit() method requires the presence of a number of XML
 *         elements (tags), even if they are empty, otherwise it fall over.
 *         The getXMLElement() method will provide an XML Element structure with
 *         the set of Element required by the updateCoOnEventCommit() method.
 */
public class CoUpdateOnEventCommitXMLBuilder
{

    /**
     * co number element name.
     */
    public static final String TAG_CONUMBER = "CONumber";
    /**
     * AoN60 date element name.
     */
    public static final String TAG_AON60DATE = "AoN60date";
    /**
     * Attachment arrears date element name.
     */
    public static final String TAG_ATTACHMENTARREARSDATE = "AttachmentArrearsDate";
    /**
     * Attachment lapsed date element name.
     */
    public static final String TAG_ATTACHMENTLAPSEDDATE = "AttachmentLapsedDate";
    /**
     * Revoked discharged date element name.
     */
    public static final String TAG_REVOKEDDISCHARGEDDATE = "RevokedDischargedDate";
    /**
     * Order date element name.
     */
    public static final String TAG_ORDERDATE = "OrderDate";
    /**
     * co status element name.
     */
    public static final String TAG_COSTATUS = "COStatus";

    /** The co XML element. */
    private Element coXMLElement = null;

    /** The co number. */
    private String coNumber;
    
    /** The ao N 60 date. */
    private String aoN60Date;
    
    /** The attachment arrears date. */
    private String attachmentArrearsDate;
    
    /** The attachment lapsed date. */
    private String attachmentLapsedDate;
    
    /** The revoked discharged date. */
    private String revokedDischargedDate;
    
    /** The order date. */
    private String orderDate;
    
    /** The co status. */
    private String coStatus;

    /**
     * This version of the constructor allows the class to initialised by an existing
     * XML Element. Any additional elements will not be discarded.
     * 
     * @param pElement The parameters element.
     */
    public CoUpdateOnEventCommitXMLBuilder (final Element pElement)
    {
        // Take a copy of the input XML Element.
        // It may contain other elements that need to be passed on without manipulation.
        coXMLElement = (Element) pElement.clone ();

        coNumber = mGetElementValue (pElement, TAG_CONUMBER);
        aoN60Date = mGetElementValue (pElement, TAG_AON60DATE);
        attachmentArrearsDate = mGetElementValue (pElement, TAG_ATTACHMENTARREARSDATE);
        attachmentLapsedDate = mGetElementValue (pElement, TAG_ATTACHMENTLAPSEDDATE);
        revokedDischargedDate = mGetElementValue (pElement, TAG_REVOKEDDISCHARGEDDATE);
        orderDate = mGetElementValue (pElement, TAG_ORDERDATE);
        coStatus = mGetElementValue (pElement, TAG_COSTATUS);

    }

    /**
     * Constructor which takes the minimal amount of data required to update a consolidated order.
     * 
     * @param pCoNumber The co number.
     */
    public CoUpdateOnEventCommitXMLBuilder (final String pCoNumber)
    {

        coNumber = pCoNumber;
    }

    /**
     * This version of the constructor allows the class to be constructed purely with
     * scalar values.
     * 
     * @param pCoNumber The co number.
     * @param pAoN60Date The AoN60 date.
     * @param pAttachmentArrearsDate The attachment arrears date.
     * @param pAttachmentLapsedDate The attchment lapsed date.
     * @param pRevokedDischargedDate The revoked discharged date.
     * @param pOrderDate The order date.
     * @param pCoStatus The co status.
     */
    public CoUpdateOnEventCommitXMLBuilder (final String pCoNumber, final String pAoN60Date,
            final String pAttachmentArrearsDate, final String pAttachmentLapsedDate,
            final String pRevokedDischargedDate, final String pOrderDate, final String pCoStatus)
    {
        super ();

        coNumber = pCoNumber;
        aoN60Date = pAoN60Date;
        attachmentArrearsDate = pAttachmentArrearsDate;
        attachmentLapsedDate = pAttachmentLapsedDate;
        revokedDischargedDate = pRevokedDischargedDate;
        orderDate = pOrderDate;
        coStatus = pCoStatus;
    }

    /**
     * (non-Javadoc)
     * Returns an elements text value or null if the element does not exist.
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
     * Sets an elements text and creates the element if necessary.
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

        if (null == coXMLElement)
        {
            element = new Element (pElementName);
        }
        else
        {
            element = (Element) coXMLElement.clone ();
            element = (Element) element.detach ();
            element.setName (pElementName);
        }

        mSetElement (element, TAG_CONUMBER, coNumber);
        mSetElement (element, TAG_AON60DATE, aoN60Date);
        mSetElement (element, TAG_ATTACHMENTARREARSDATE, attachmentArrearsDate);
        mSetElement (element, TAG_ATTACHMENTLAPSEDDATE, attachmentLapsedDate);
        mSetElement (element, TAG_REVOKEDDISCHARGEDDATE, revokedDischargedDate);
        mSetElement (element, TAG_ORDERDATE, orderDate);
        mSetElement (element, TAG_COSTATUS, coStatus);

        return element;
    } // getXMLElement()

    /**
     * Gets the ao N 60 date.
     *
     * @return the ao N 60 date
     */
    public String getAoN60Date ()
    {
        return aoN60Date;
    }

    /**
     * Sets the ao N 60 date.
     *
     * @param aoN60Date the new ao N 60 date
     */
    public void setAoN60Date (final String aoN60Date)
    {
        this.aoN60Date = aoN60Date;
    }

    /**
     * Gets the attachment arrears date.
     *
     * @return the attachment arrears date
     */
    public String getAttachmentArrearsDate ()
    {
        return attachmentArrearsDate;
    }

    /**
     * Sets the attachment arrears date.
     *
     * @param attachmentArrearsDate the new attachment arrears date
     */
    public void setAttachmentArrearsDate (final String attachmentArrearsDate)
    {
        this.attachmentArrearsDate = attachmentArrearsDate;
    }

    /**
     * Gets the attachment lapsed date.
     *
     * @return the attachment lapsed date
     */
    public String getAttachmentLapsedDate ()
    {
        return attachmentLapsedDate;
    }

    /**
     * Sets the attachment lapsed date.
     *
     * @param attachmentLapsedDate the new attachment lapsed date
     */
    public void setAttachmentLapsedDate (final String attachmentLapsedDate)
    {
        this.attachmentLapsedDate = attachmentLapsedDate;
    }

    /**
     * Gets the co number.
     *
     * @return the co number
     */
    public String getCoNumber ()
    {
        return coNumber;
    }

    /**
     * Sets the co number.
     *
     * @param coNumber the new co number
     */
    public void setCoNumber (final String coNumber)
    {
        this.coNumber = coNumber;
    }

    /**
     * Gets the co status.
     *
     * @return the co status
     */
    public String getCoStatus ()
    {
        return coStatus;
    }

    /**
     * Sets the co status.
     *
     * @param coStatus the new co status
     */
    public void setCoStatus (final String coStatus)
    {
        this.coStatus = coStatus;
    }

    /**
     * Gets the co XML element.
     *
     * @return the co XML element
     */
    public Element getCoXMLElement ()
    {
        return coXMLElement;
    }

    /**
     * Sets the co XML element.
     *
     * @param coXMLElement the new co XML element
     */
    public void setCoXMLElement (final Element coXMLElement)
    {
        this.coXMLElement = coXMLElement;
    }

    /**
     * Gets the order date.
     *
     * @return the order date
     */
    public String getOrderDate ()
    {
        return orderDate;
    }

    /**
     * Sets the order date.
     *
     * @param orderDate the new order date
     */
    public void setOrderDate (final String orderDate)
    {
        this.orderDate = orderDate;
    }

    /**
     * Gets the revoked discharged date.
     *
     * @return the revoked discharged date
     */
    public String getRevokedDischargedDate ()
    {
        return revokedDischargedDate;
    }

    /**
     * Sets the revoked discharged date.
     *
     * @param revokedDischargedDate the new revoked discharged date
     */
    public void setRevokedDischargedDate (final String revokedDischargedDate)
    {
        this.revokedDischargedDate = revokedDischargedDate;
    }
} // class CoUpdateOnEventCommitXMLBuilder