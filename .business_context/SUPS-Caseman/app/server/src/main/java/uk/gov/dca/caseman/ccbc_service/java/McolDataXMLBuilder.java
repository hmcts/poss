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
 * Class: McolDataXMLBuilder.java
 * 
 * @author Chris hutt
 *         Created: 21 nov 2005
 *         Description: This class is intended to provided assistance in creating the XML element
 *         structure that needs to be passed to the insertMcolData() service method.
 *         The insertMcolData() method requires the presence of a number of XML
 *         elements (tags), even if they are empty, otherwise it fall over.
 *         The getXMLElement() method will provide an XML Element structure with
 *         the set of Element required by the insertMcolData() method.
 * 
 *         Change History:
 *         v1.1 Chris Hutt 8 may 06
 *         defect 3072: variable naming convention
 *         defect 3073: javadoc
 *         18/10/2013 Chris Vincent, Trac 4997. Added 8 new columns to MCOL_DATA table for CCBC SDT
 *         04/02/2015 Chris Vincent, Trac 5473. Added new MCOL_REFERENCE and JUDGMENT_REFERENCE columns to MCOL_DATA
 *         22/04/2015 Chris Vincent, Trac 5573. Added new PAID_DATE column to MCOL_DATA
 * 
 */
public class McolDataXMLBuilder
{

    /**
     * Claim number element name.
     */
    public static final String TAG_CLAIMNUMBER = "ClaimNumber";
    /**
     * Defendant case party number element name.
     */
    public static final String TAG_DEFENDANTCASEPARTYNO = "DefendantCasePartyNo";
    /**
     * Type element name.
     */
    public static final String TAG_TYPE = "Type";
    /**
     * Event date element name.
     */
    public static final String TAG_EVENTDATE = "EventDate";
    /**
     * Reject code element name.
     */
    public static final String TAG_REJECTCODE = "RejectCode";
    /**
     * Warrant number element name.
     */
    public static final String TAG_WARRANTNUMBER = "WarrantNumber";
    /**
     * Return code element name.
     */
    public static final String TAG_RETURNCODE = "ReturnCode";
    /**
     * Return info element name.
     */
    public static final String TAG_RETURNINFO = "ReturnInfo";
    /**
     * Address 1 element name.
     */
    public static final String TAG_ADDR1 = "Addr1";
    /**
     * Address 2 element name.
     */
    public static final String TAG_ADDR2 = "Addr2";
    /**
     * Address 3 element name.
     */
    public static final String TAG_ADDR3 = "Addr3";
    /**
     * Address 4 element name.
     */
    public static final String TAG_ADDR4 = "Addr4";
    /**
     * Address 5 element name.
     */
    public static final String TAG_ADDR5 = "Addr5";
    /**
     * Post code element name.
     */
    public static final String TAG_POSTCODE = "PostCode";
    /**
     * Date sent element name.
     */
    public static final String TAG_DATESENT = "DateSent";
    /**
     * Previous Creditor element name.
     */
    public static final String TAG_PREVCREDITOR = "PreviousCreditor";
    /**
     * New Creditor element name.
     */
    public static final String TAG_NEWCREDITOR = "NewCreditor";
    /**
     * Judgment Type element name.
     */
    public static final String TAG_JUDGTYPE = "JudgmentType";
    /**
     * Joint Judgment element name.
     */
    public static final String TAG_JOINTJUDG = "JointJudgment";
    /**
     * Judgment Total element name.
     */
    public static final String TAG_JUDGTOTAL = "Total";
    /**
     * Instalment Amount element name.
     */
    public static final String TAG_INSTALAMOUNT = "InstalmentAmount";
    /**
     * Instalment Frequency element name.
     */
    public static final String TAG_INSTALFREQUENCY = "Frequency";
    /**
     * First Payment Date element name.
     */
    public static final String TAG_FIRSTPAYMENTDATE = "FirstPaymentDate";
    /**
     * First MCOL Reference element name.
     */
    public static final String TAG_MCOLREFERENCE = "McolReference";
    /**
     * First Judgment Reference element name.
     */
    public static final String TAG_JUDGMENTREFERENCE = "JudgmentReference";
    /**
     * Paid In Full Date element name.
     */
    public static final String TAG_PAIDDATE = "PaidDate";

    /** The tmp rep XML element. */
    private Element tmpRepXMLElement = null;

    /** The claim number. */
    private String claimNumber;
    
    /** The defendant case party no. */
    private String defendantCasePartyNo;
    
    /** The type. */
    private String type;
    
    /** The event date. */
    private String eventDate;
    
    /** The reject code. */
    private String rejectCode;
    
    /** The warrant number. */
    private String warrantNumber;
    
    /** The return code. */
    private String returnCode;
    
    /** The return info. */
    private String returnInfo;
    
    /** The addr 1. */
    private String addr1;
    
    /** The addr 2. */
    private String addr2;
    
    /** The addr 3. */
    private String addr3;
    
    /** The addr 4. */
    private String addr4;
    
    /** The addr 5. */
    private String addr5;
    
    /** The post code. */
    private String postCode;
    
    /** The date sent. */
    private String dateSent;
    
    /** The previous creditor. */
    private String previousCreditor;
    
    /** The new creditor. */
    private String newCreditor;
    
    /** The judgment type. */
    private String judgmentType;
    
    /** The joint judgment. */
    private String jointJudgment;
    
    /** The total. */
    private String total;
    
    /** The instalment amount. */
    private String instalmentAmount;
    
    /** The frequency. */
    private String frequency;
    
    /** The first payment date. */
    private String firstPaymentDate;
    
    /** The mcol reference. */
    private String mcolReference;
    
    /** The judgment reference. */
    private String judgmentReference;
    
    /** The paid date. */
    private String paidDate;

    /**
     * This version of the constructor allows the class to initialised by an existing
     * XML Element. Any additional elements will not be discarded.
     *
     * @param pElement the element
     */
    public McolDataXMLBuilder (final Element pElement)
    {
        // Take a copy of the input XML Element.
        // It may contain other elements that need to be passed on without manipulation.
        tmpRepXMLElement = (Element) pElement.clone ();
        claimNumber = mGetElementValue (pElement, TAG_CLAIMNUMBER);
        defendantCasePartyNo = mGetElementValue (pElement, TAG_DEFENDANTCASEPARTYNO);
        type = mGetElementValue (pElement, TAG_TYPE);
        eventDate = mGetElementValue (pElement, TAG_EVENTDATE);
        rejectCode = mGetElementValue (pElement, TAG_REJECTCODE);
        warrantNumber = mGetElementValue (pElement, TAG_WARRANTNUMBER);
        returnCode = mGetElementValue (pElement, TAG_RETURNCODE);
        returnInfo = mGetElementValue (pElement, TAG_RETURNINFO);
        addr1 = mGetElementValue (pElement, TAG_ADDR1);
        addr2 = mGetElementValue (pElement, TAG_ADDR2);
        addr3 = mGetElementValue (pElement, TAG_ADDR3);
        addr4 = mGetElementValue (pElement, TAG_ADDR4);
        addr5 = mGetElementValue (pElement, TAG_ADDR5);
        postCode = mGetElementValue (pElement, TAG_POSTCODE);
        dateSent = mGetElementValue (pElement, TAG_DATESENT);
        previousCreditor = mGetElementValue (pElement, TAG_PREVCREDITOR);
        newCreditor = mGetElementValue (pElement, TAG_NEWCREDITOR);
        judgmentType = mGetElementValue (pElement, TAG_JUDGTYPE);
        jointJudgment = mGetElementValue (pElement, TAG_JOINTJUDG);
        total = mGetElementValue (pElement, TAG_JUDGTOTAL);
        instalmentAmount = mGetElementValue (pElement, TAG_INSTALAMOUNT);
        frequency = mGetElementValue (pElement, TAG_INSTALFREQUENCY);
        firstPaymentDate = mGetElementValue (pElement, TAG_FIRSTPAYMENTDATE);
        mcolReference = mGetElementValue (pElement, TAG_MCOLREFERENCE);
        judgmentReference = mGetElementValue (pElement, TAG_JUDGMENTREFERENCE);
        paidDate = mGetElementValue (pElement, TAG_PAIDDATE);
    } // McolDataXMLBuilder()

    /**
     * This version of the constructor allows the class to be constructed purely with
     * scalar values.
     *
     * @param pClaimNumber the claim number
     * @param pDefendantCasePartyNo the defendant case party no
     * @param pType the type
     * @param pEventDate the event date
     * @param pRejectCode the reject code
     * @param pWarrantNumber the warrant number
     * @param pReturnCode the return code
     * @param pReturnInfo the return info
     * @param pAddr1 the addr 1
     * @param pAddr2 the addr 2
     * @param pAddr3 the addr 3
     * @param pAddr4 the addr 4
     * @param pAddr5 the addr 5
     * @param pPostCode the post code
     * @param pDateSent the date sent
     * @param pPreviousCreditor the previous creditor
     * @param pNewCreditor the new creditor
     * @param pJudgmentType the judgment type
     * @param pJointJudgment the joint judgment
     * @param pTotal the total
     * @param pInstalmentAmount the instalment amount
     * @param pFrequency the frequency
     * @param pFirstPaymentDate the first payment date
     * @param pMcolReference the mcol reference
     * @param pJudgmentReference the judgment reference
     * @param pPaidDate the paid date
     */
    public McolDataXMLBuilder (final String pClaimNumber, final String pDefendantCasePartyNo, final String pType,
            final String pEventDate, final String pRejectCode, final String pWarrantNumber, final String pReturnCode,
            final String pReturnInfo, final String pAddr1, final String pAddr2, final String pAddr3,
            final String pAddr4, final String pAddr5, final String pPostCode, final String pDateSent,
            final String pPreviousCreditor, final String pNewCreditor, final String pJudgmentType,
            final String pJointJudgment, final String pTotal, final String pInstalmentAmount, final String pFrequency,
            final String pFirstPaymentDate, final String pMcolReference, final String pJudgmentReference,
            final String pPaidDate)
    {
        super ();
        claimNumber = pClaimNumber;
        defendantCasePartyNo = pDefendantCasePartyNo;
        type = pType;
        eventDate = pEventDate;
        rejectCode = pRejectCode;
        warrantNumber = pWarrantNumber;
        returnCode = pReturnCode;
        returnInfo = pReturnInfo;
        addr1 = pAddr1;
        addr2 = pAddr2;
        addr3 = pAddr3;
        addr4 = pAddr4;
        addr5 = pAddr5;
        postCode = pPostCode;
        dateSent = pDateSent;
        previousCreditor = pPreviousCreditor;
        newCreditor = pNewCreditor;
        judgmentType = pJudgmentType;
        jointJudgment = pJointJudgment;
        total = pTotal;
        instalmentAmount = pInstalmentAmount;
        frequency = pFrequency;
        firstPaymentDate = pFirstPaymentDate;
        mcolReference = pMcolReference;
        judgmentReference = pJudgmentReference;
        paidDate = pPaidDate;
    }

    /**
     * (non-Javadoc)
     * return the text of an xml node, or null if the node does not exist.
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
     * Set the text value of an xml node. Creates the node if it does not exst.
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

        mSetElement (element, TAG_CLAIMNUMBER, claimNumber);
        mSetElement (element, TAG_DEFENDANTCASEPARTYNO, defendantCasePartyNo);
        mSetElement (element, TAG_TYPE, type);
        mSetElement (element, TAG_EVENTDATE, eventDate);
        mSetElement (element, TAG_REJECTCODE, rejectCode);
        mSetElement (element, TAG_WARRANTNUMBER, warrantNumber);
        mSetElement (element, TAG_RETURNCODE, returnCode);
        mSetElement (element, TAG_RETURNINFO, returnInfo);
        mSetElement (element, TAG_ADDR1, addr1);
        mSetElement (element, TAG_ADDR2, addr2);
        mSetElement (element, TAG_ADDR3, addr3);
        mSetElement (element, TAG_ADDR4, addr4);
        mSetElement (element, TAG_ADDR5, addr5);
        mSetElement (element, TAG_POSTCODE, postCode);
        mSetElement (element, TAG_DATESENT, dateSent);
        mSetElement (element, TAG_PREVCREDITOR, previousCreditor);
        mSetElement (element, TAG_NEWCREDITOR, newCreditor);
        mSetElement (element, TAG_JUDGTYPE, judgmentType);
        mSetElement (element, TAG_JOINTJUDG, jointJudgment);
        mSetElement (element, TAG_JUDGTOTAL, total);
        mSetElement (element, TAG_INSTALAMOUNT, instalmentAmount);
        mSetElement (element, TAG_INSTALFREQUENCY, frequency);
        mSetElement (element, TAG_FIRSTPAYMENTDATE, firstPaymentDate);
        mSetElement (element, TAG_MCOLREFERENCE, mcolReference);
        mSetElement (element, TAG_JUDGMENTREFERENCE, judgmentReference);
        mSetElement (element, TAG_PAIDDATE, paidDate);

        return element;
    } // getXMLElement()

    /**
     * Gets the addr 1.
     *
     * @return the addr 1
     */
    public String getAddr1 ()
    {
        return addr1;
    }

    /**
     * Sets the addr 1.
     *
     * @param addr1 the new addr 1
     */
    public void setAddr1 (final String addr1)
    {
        this.addr1 = addr1;
    }

    /**
     * Gets the addr 2.
     *
     * @return the addr 2
     */
    public String getAddr2 ()
    {
        return addr2;
    }

    /**
     * Sets the addr 2.
     *
     * @param addr2 the new addr 2
     */
    public void setAddr2 (final String addr2)
    {
        this.addr2 = addr2;
    }

    /**
     * Gets the addr 3.
     *
     * @return the addr 3
     */
    public String getAddr3 ()
    {
        return addr3;
    }

    /**
     * Sets the addr 3.
     *
     * @param addr3 the new addr 3
     */
    public void setAddr3 (final String addr3)
    {
        this.addr3 = addr3;
    }

    /**
     * Gets the addr 4.
     *
     * @return the addr 4
     */
    public String getAddr4 ()
    {
        return addr4;
    }

    /**
     * Sets the addr 4.
     *
     * @param addr4 the new addr 4
     */
    public void setAddr4 (final String addr4)
    {
        this.addr4 = addr4;
    }

    /**
     * Gets the addr 5.
     *
     * @return the addr 5
     */
    public String getAddr5 ()
    {
        return addr5;
    }

    /**
     * Sets the addr 5.
     *
     * @param addr5 the new addr 5
     */
    public void setAddr5 (final String addr5)
    {
        this.addr5 = addr5;
    }

    /**
     * Gets the claim number.
     *
     * @return the claim number
     */
    public String getClaimNumber ()
    {
        return claimNumber;
    }

    /**
     * Sets the claim number.
     *
     * @param claimNumber the new claim number
     */
    public void setClaimNumber (final String claimNumber)
    {
        this.claimNumber = claimNumber;
    }

    /**
     * Gets the date sent.
     *
     * @return the date sent
     */
    public String getDateSent ()
    {
        return dateSent;
    }

    /**
     * Sets the date sent.
     *
     * @param dateSent the new date sent
     */
    public void setDateSent (final String dateSent)
    {
        this.dateSent = dateSent;
    }

    /**
     * Gets the defendant case party no.
     *
     * @return the defendant case party no
     */
    public String getDefendantCasePartyNo ()
    {
        return defendantCasePartyNo;
    }

    /**
     * Sets the defendant case party no.
     *
     * @param defendantCasePartyNo the new defendant case party no
     */
    public void setDefendantCasePartyNo (final String defendantCasePartyNo)
    {
        this.defendantCasePartyNo = defendantCasePartyNo;
    }

    /**
     * Gets the event date.
     *
     * @return the event date
     */
    public String getEventDate ()
    {
        return eventDate;
    }

    /**
     * Sets the event date.
     *
     * @param eventDate the new event date
     */
    public void setEventDate (final String eventDate)
    {
        this.eventDate = eventDate;
    }

    /**
     * Gets the post code.
     *
     * @return the post code
     */
    public String getPostCode ()
    {
        return postCode;
    }

    /**
     * Sets the post code.
     *
     * @param postCode the new post code
     */
    public void setPostCode (final String postCode)
    {
        this.postCode = postCode;
    }

    /**
     * Gets the reject code.
     *
     * @return the reject code
     */
    public String getRejectCode ()
    {
        return rejectCode;
    }

    /**
     * Sets the reject code.
     *
     * @param rejectCode the new reject code
     */
    public void setRejectCode (final String rejectCode)
    {
        this.rejectCode = rejectCode;
    }

    /**
     * Gets the return code.
     *
     * @return the return code
     */
    public String getReturnCode ()
    {
        return returnCode;
    }

    /**
     * Sets the return code.
     *
     * @param returnCode the new return code
     */
    public void setReturnCode (final String returnCode)
    {
        this.returnCode = returnCode;
    }

    /**
     * Gets the return info.
     *
     * @return the return info
     */
    public String getReturnInfo ()
    {
        return returnInfo;
    }

    /**
     * Sets the return info.
     *
     * @param returnInfo the new return info
     */
    public void setReturnInfo (final String returnInfo)
    {
        this.returnInfo = returnInfo;
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
     * Gets the type.
     *
     * @return the type
     */
    public String getType ()
    {
        return type;
    }

    /**
     * Sets the type.
     *
     * @param type the new type
     */
    public void setType (final String type)
    {
        this.type = type;
    }

    /**
     * Gets the warrant number.
     *
     * @return the warrant number
     */
    public String getWarrantNumber ()
    {
        return warrantNumber;
    }

    /**
     * Sets the warrant number.
     *
     * @param warrantNumber the new warrant number
     */
    public void setWarrantNumber (final String warrantNumber)
    {
        this.warrantNumber = warrantNumber;
    }

    /**
     * Gets the previous creditor.
     *
     * @return the previous creditor
     */
    public String getPreviousCreditor ()
    {
        return previousCreditor;
    }

    /**
     * Sets the previous creditor.
     *
     * @param previousCreditor the new previous creditor
     */
    public void setPreviousCreditor (final String previousCreditor)
    {
        this.previousCreditor = previousCreditor;
    }

    /**
     * Gets the new creditor.
     *
     * @return the new creditor
     */
    public String getNewCreditor ()
    {
        return newCreditor;
    }

    /**
     * Sets the new creditor.
     *
     * @param newCreditor the new new creditor
     */
    public void setNewCreditor (final String newCreditor)
    {
        this.newCreditor = newCreditor;
    }

    /**
     * Gets the judgment type.
     *
     * @return the judgment type
     */
    public String getJudgmentType ()
    {
        return judgmentType;
    }

    /**
     * Sets the judgment type.
     *
     * @param judgmentType the new judgment type
     */
    public void setJudgmentType (final String judgmentType)
    {
        this.judgmentType = judgmentType;
    }

    /**
     * Gets the joint judgment.
     *
     * @return the joint judgment
     */
    public String getJointJudgment ()
    {
        return jointJudgment;
    }

    /**
     * Sets the joint judgment.
     *
     * @param jointJudgment the new joint judgment
     */
    public void setJointJudgment (final String jointJudgment)
    {
        this.jointJudgment = jointJudgment;
    }

    /**
     * Gets the total.
     *
     * @return the total
     */
    public String getTotal ()
    {
        return total;
    }

    /**
     * Sets the total.
     *
     * @param total the new total
     */
    public void setTotal (final String total)
    {
        this.total = total;
    }

    /**
     * Gets the instalment amount.
     *
     * @return the instalment amount
     */
    public String getInstalmentAmount ()
    {
        return instalmentAmount;
    }

    /**
     * Sets the instalment amount.
     *
     * @param instalmentAmount the new instalment amount
     */
    public void setInstalmentAmount (final String instalmentAmount)
    {
        this.instalmentAmount = instalmentAmount;
    }

    /**
     * Gets the frequency.
     *
     * @return the frequency
     */
    public String getFrequency ()
    {
        return frequency;
    }

    /**
     * Sets the frequency.
     *
     * @param frequency the new frequency
     */
    public void setFrequency (final String frequency)
    {
        this.frequency = frequency;
    }

    /**
     * Gets the first payment date.
     *
     * @return the first payment date
     */
    public String getFirstPaymentDate ()
    {
        return firstPaymentDate;
    }

    /**
     * Sets the first payment date.
     *
     * @param firstPaymentDate the new first payment date
     */
    public void setFirstPaymentDate (final String firstPaymentDate)
    {
        this.firstPaymentDate = firstPaymentDate;
    }

    /**
     * Gets the MCOL reference.
     *
     * @return the MCOL reference
     */
    public String getMCOLReference ()
    {
        return mcolReference;
    }

    /**
     * Sets the MCOL reference.
     *
     * @param mcolReference the new MCOL reference
     */
    public void setMCOLReference (final String mcolReference)
    {
        this.mcolReference = mcolReference;
    }

    /**
     * Gets the judgment reference.
     *
     * @return the judgment reference
     */
    public String getJudgmentReference ()
    {
        return judgmentReference;
    }

    /**
     * Sets the judgment reference.
     *
     * @param judgReference the new judgment reference
     */
    public void setJudgmentReference (final String judgReference)
    {
        this.judgmentReference = judgReference;
    }

    /**
     * Gets the paid date.
     *
     * @return the paid date
     */
    public String getPaidDate ()
    {
        return paidDate;
    }

    /**
     * Sets the paid date.
     *
     * @param paidDate the new paid date
     */
    public void setPaidDate (final String paidDate)
    {
        this.paidDate = paidDate;
    }
} // class McolDataXMLBuilder
