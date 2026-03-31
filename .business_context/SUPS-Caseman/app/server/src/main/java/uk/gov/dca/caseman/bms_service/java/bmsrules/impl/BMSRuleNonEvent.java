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
package uk.gov.dca.caseman.bms_service.java.bmsrules.impl;

import java.io.IOException;
import java.io.StringReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSRuleNonEvent;
import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 10-May-2005.
 *
 * @author Amjad Khan
 * 
 *         Change History:
 *         15-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * @author Amjad Khan
 */
public class BMSRuleNonEvent implements IBMSRuleNonEvent, Comparable<IBMSRuleNonEvent>
{
    
    /** The Constant BMSRULE_TAG. */
    private static final String BMSRULE_TAG = "BMSRule";
    
    /** The Constant SECTION_TAG. */
    private static final String SECTION_TAG = "Section";
    
    /** The Constant COUNT_TAG. */
    private static final String COUNT_TAG = "Count";
    
    /** The Constant PAYOUTTYPE_TAG. */
    private static final String PAYOUTTYPE_TAG = "PayoutType";
    
    /** The Constant PAYMENT_TYPE_TAG. */
    private static final String PAYMENT_TYPE_TAG = "PaymentType";
    
    /** The Constant RETURN_TYPE_TAG. */
    private static final String RETURN_TYPE_TAG = "ReturnType";
    
    /** The Constant RETURN_CODE_TAG. */
    private static final String RETURN_CODE_TAG = "ReturnCode";
    
    /** The Constant WARRANT_TYPE_TAG. */
    private static final String WARRANT_TYPE_TAG = "WarrantType";
    
    /** The Constant CASE_TYPE_TAG. */
    private static final String CASE_TYPE_TAG = "CaseType";
    
    /** The Constant ACTIONID_TAG. */
    private static final String ACTIONID_TAG = "ActionId";
    
    /** The Constant MANUALLY_CREATED_RETURN_TAG. */
    private static final String MANUALLY_CREATED_RETURN_TAG = "ManuallyCreatedReturn";
    
    /** The Constant WARRANT_ID_TAG. */
    private static final String WARRANT_ID_TAG = "WarrantId";
    
    /** The Constant TYPE_OF_WARRANT_TAG. */
    private static final String TYPE_OF_WARRANT_TAG = "TypeOfWarrant";
    
    /** The Constant RECEIPT_DATE_REQUIRED_TAG. */
    private static final String RECEIPT_DATE_REQUIRED_TAG = "ReceiptDateRequired";
    
    /** The Constant PROCESSING_DATE_REQUIRED_TAG. */
    private static final String PROCESSING_DATE_REQUIRED_TAG = "ProcessingDateRequired";
    
    /** The Constant REQUIRED_PARAMLIST_TAG. */
    private static final String REQUIRED_PARAMLIST_TAG = "RequiredParamList";
    
    /** The Constant MATCHING_PARAMLIST_TAG. */
    private static final String MATCHING_PARAMLIST_TAG = "MatchingParamNameList";
    
    /** The Constant ERROR_TAG. */
    private static final String ERROR_TAG = "Error";
    
    /** The Constant COURT_CODE_TAG. */
    private static final String COURT_CODE_TAG = "CourtCode";

    /** The Constant TASK_TAG. */
    private static final String TASK_TAG = "Task";
    
    /** The Constant BMSTYPE_TAG. */
    private static final String BMSTYPE_TAG = "BMSType";
    
    /** The Constant SLASH. */
    private static final String SLASH = "/";
    
    /** The Constant STARTTAG. */
    private static final String STARTTAG = "<";
    
    /** The Constant ENDTAG. */
    private static final String ENDTAG = ">";

    /** The out. */
    private final XMLOutputter out;

    /** The task. */
    private String task = "";
    
    /** The bms type. */
    private String bmsType = "";
    
    /** The required param list. */
    private ArrayList<String> requiredParamList;
    
    /** The matching param name list. */
    private ArrayList<String> matchingParamNameList;
    
    /** The payout type. */
    private String payoutType = "";
    
    /** The payment type. */
    private String paymentType = "";
    
    /** The return type. */
    private String returnType = "";
    
    /** The return code. */
    private String returnCode = "";
    
    /** The warrant type. */
    private String warrantType = "";
    
    /** The case type. */
    private String caseType = "";
    
    /** The action id. */
    private String actionId = "";
    
    /** The section. */
    private String section = "";
    
    /** The count. */
    private int count;
    
    /** The type of warrant. */
    private String typeOfWarrant = "";
    
    /** The manually created return. */
    private boolean manuallyCreatedReturn;
    
    /** The warrant id. */
    private String warrantId = "";
    
    /** The receipt date required. */
    private Date receiptDateRequired;
    
    /** The processing date required. */
    private Date processingDateRequired;
    
    /** The court code. */
    private String courtCode = "";

    /** The error. */
    // Special Case not use for Equal, HasCode or Comapre
    private boolean error;

    /**
     * Constructor.
     * 
     * <BMSRule>
     * <EventID>10</EventID>
     * <BmsSeq>
     * <CaseType>M</CaseType>
     * <ApplicantType/> <!-- ? -->
     * <HearingType/> <!-- ? -->
     * <HearingTypeFlag/> <!-- ? -->
     * <Issue/> <!-- ? -->
     * <ListingType/> <!-- ? -->
     * <EventType/> <!-- ? -->
     * <ApplicantResponse/> <!-- ? -->
     * <AEEventId/> <!-- ? -->
     * <Task/> <!-- ? -->
     * <BmsType/> <!-- ? -->
     * </BmsSeq>
     * </BMSRule>
     * 
     * @param section The section
     * @param courtCode The court code
     * @param typeOfWarrant The type of warrant
     * @param count The count
     * @param paymentType The payment type
     * @param payoutType The payout type
     * @param returnType The return type
     * @param returnCode The return code
     * @param warrantType The warrant type
     * @param actionId The action id
     * @param manuallyCreatedReturn The manually created return
     * @param warrantId The warrant id
     * @param receiptDateRequired The receipt date required
     * @param processingDateRequired The processing date required
     * @param task The task
     * @param bmsType The bms type
     */
    public BMSRuleNonEvent (final String section, final String courtCode, final String typeOfWarrant, final int count,
            final String paymentType, final String payoutType, final String returnType, final String returnCode,
            final String warrantType, final String actionId, final boolean manuallyCreatedReturn,
            final String warrantId, final Date receiptDateRequired, final Date processingDateRequired,
            final String task, final String bmsType)
    {
        setSection (section);
        setCourtCode (courtCode);
        setTypeOfWarrant (typeOfWarrant);
        setCountIncrement (count);
        setPaymentType (paymentType);
        setPayoutType (payoutType);
        setReturnType (returnType);
        setReturnCode (returnCode);
        setWarrantType (warrantType);
        setActionId (actionId);
        setManuallyCreatedReturn (manuallyCreatedReturn);
        setWarrantId (warrantId);
        setReceiptDateRequired (receiptDateRequired);
        setProcessingDateRequired (processingDateRequired);
        setTask (task);
        setBmsType (bmsType);
        out = new XMLOutputter (Format.getCompactFormat ());
    }

    /**
     * Constructor.
     */
    public BMSRuleNonEvent ()
    {
        out = new XMLOutputter (Format.getCompactFormat ());
        requiredParamList = new ArrayList<String>();
        matchingParamNameList = new ArrayList<String> ();
    }

    /**
     * Sets the count increment.
     *
     * @param count the new count increment
     */
    public void setCountIncrement (final int count)
    {
        this.count = count;
    }

    /**
     * Sets the payment type.
     *
     * @param paymentType the new payment type
     */
    public void setPaymentType (final String paymentType)
    {
        this.paymentType = paymentType;
    }

    /**
     * Sets the payout type.
     *
     * @param payoutType the new payout type
     */
    public void setPayoutType (final String payoutType)
    {
        this.payoutType = payoutType;
    }

    /**
     * Sets the return type.
     *
     * @param returnType the new return type
     */
    public void setReturnType (final String returnType)
    {
        this.returnType = returnType;
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
     * Sets the warrant type.
     *
     * @param warrantType the new warrant type
     */
    public void setWarrantType (final String warrantType)
    {
        this.warrantType = warrantType;
    }

    /**
     * Sets the case type.
     *
     * @param caseType the new case type
     */
    public void setCaseType (final String caseType)
    {
        this.caseType = caseType;
    }

    /**
     * Sets the action id.
     *
     * @param actionId the new action id
     */
    public void setActionId (final String actionId)
    {
        this.actionId = actionId;
    }

    /**
     * Sets the section.
     *
     * @param section the new section
     */
    public void setSection (final String section)
    {
        this.section = section;
    }

    /**
     * Sets the type of warrant.
     *
     * @param typeOfWarrant the new type of warrant
     */
    public void setTypeOfWarrant (final String typeOfWarrant)
    {
        this.typeOfWarrant = typeOfWarrant;
    }

    /**
     * Sets the manually created return.
     *
     * @param manuallyCreatedReturn the new manually created return
     */
    public void setManuallyCreatedReturn (final boolean manuallyCreatedReturn)
    {
        this.manuallyCreatedReturn = manuallyCreatedReturn;
    }

    /**
     * Sets the warrant id.
     *
     * @param warrantId the new warrant id
     */
    public void setWarrantId (final String warrantId)
    {
        this.warrantId = warrantId;
    }

    /**
     * Sets the receipt date required.
     *
     * @param receiptDateRequired the new receipt date required
     */
    public void setReceiptDateRequired (final Date receiptDateRequired)
    {
        this.receiptDateRequired = receiptDateRequired;
    }

    /**
     * Sets the processing date required.
     *
     * @param processingDateRequired the new processing date required
     */
    public void setProcessingDateRequired (final Date processingDateRequired)
    {
        this.processingDateRequired = processingDateRequired;
    }

    /**
     * Sets the task.
     *
     * @param task the new task
     */
    public void setTask (final String task)
    {
        this.task = task;
    }

    /**
     * Sets the error.
     *
     * @param error the new error
     */
    public void setError (final boolean error)
    {
        this.error = error;
    }

    /**
     * Sets the court code.
     *
     * @param courtCode the new court code
     */
    public void setCourtCode (final String courtCode)
    {
        this.courtCode = courtCode;
    }

    /**
     * Sets the bms type.
     *
     * @param bmsType the new bms type
     */
    public void setBmsType (final String bmsType)
    {
        this.bmsType = bmsType;
    }

    /**
     * {@inheritDoc}
     */
    public String getCountIncrement ()
    {
        return Integer.toString (count);
    }

    /**
     * {@inheritDoc}
     */
    public String getPaymentType ()
    {
        return paymentType;
    }

    /**
     * {@inheritDoc}
     */
    public String getPayoutType ()
    {
        return payoutType;
    }

    /**
     * {@inheritDoc}
     */
    public String getReturnType ()
    {
        return returnType;
    }

    /**
     * {@inheritDoc}
     */
    public String getReturnCode ()
    {
        return returnCode;
    }

    /**
     * {@inheritDoc}
     */
    public String getWarrantType ()
    {
        return warrantType;
    }

    /**
     * {@inheritDoc}
     */
    public String getCaseType ()
    {
        return caseType;
    }

    /**
     * {@inheritDoc}
     */
    public String getActionId ()
    {
        return actionId;
    }

    /**
     * {@inheritDoc}
     */
    public String getSection ()
    {
        return section;
    }

    /**
     * {@inheritDoc}
     */
    public String getTypeOfWarrant ()
    {
        return typeOfWarrant;
    }

    /**
     * {@inheritDoc}
     */
    public String getManuallyCreatedReturn ()
    {
        return new Boolean (manuallyCreatedReturn).toString ();
    }

    /**
     * {@inheritDoc}
     */
    public String getWarrantId ()
    {
        return warrantId;
    }

    /**
     * {@inheritDoc}
     */
    public String getReceiptDateRequired ()
    {
        return receiptDateRequired != null ? formatDate (receiptDateRequired) : "";
    }

    /**
     * {@inheritDoc}
     */
    public String getProcessingDateRequired ()
    {
        return processingDateRequired != null ? formatDate (processingDateRequired) : "";
    }

    /**
     * {@inheritDoc}
     */
    public String getTask ()
    {
        return task;
    }

    /**
     * {@inheritDoc}
     */
    public String getBmsType ()
    {
        return bmsType;
    }

    /**
     * Gets the error.
     *
     * @return the error
     */
    public boolean getError ()
    {
        return error;
    }

    /**
     * {@inheritDoc}
     */
    public String getCourtCode ()
    {
        return courtCode;
    }

    /**
     * (non-Javadoc).
     *
     * @param obj the obj
     * @return true, if successful
     * @see java.lang.Object#equals(java.lang.Object)
     */
    public boolean equals (final Object obj)
    {
        if (obj == this)
        {
            return true;
        }
        else if ( !(obj instanceof BMSRuleNonEvent))
        {
            return false;
        }

        final BMSRuleNonEvent objRule = (BMSRuleNonEvent) obj;
        if (section != null && objRule.section != null && !section.equals (objRule.section))
        {
            return false;
        }
        if (courtCode != null && objRule.courtCode != null && !courtCode.equals (objRule.courtCode))
        {
            return false;
        }
        if (typeOfWarrant != null && objRule.typeOfWarrant != null && !typeOfWarrant.equals (objRule.typeOfWarrant))
        {
            return false;
        }
        if (count != objRule.count)
        {
            return false;
        }
        if (paymentType != null && objRule.paymentType != null && !paymentType.equals (objRule.paymentType))
        {
            return false;
        }
        if (payoutType != null && objRule.payoutType != null && !payoutType.equals (objRule.payoutType))
        {
            return false;
        }
        if (returnType != null && objRule.returnType != null && !returnType.equals (objRule.returnType))
        {
            return false;
        }
        if (returnCode != null && objRule.returnCode != null && !returnCode.equals (objRule.returnCode))
        {
            return false;
        }
        if (warrantType != null && objRule.warrantType != null && !warrantType.equals (objRule.warrantType))
        {
            return false;
        }
        if (caseType != null && objRule.caseType != null && !caseType.equals (objRule.caseType))
        {
            return false;
        }
        if (actionId != null && objRule.actionId != null && !actionId.equals (objRule.actionId))
        {
            return false;
        }
        if (manuallyCreatedReturn != objRule.manuallyCreatedReturn)
        {
            return false;
        }
        if (warrantId != null && objRule.warrantId != null && !warrantId.equals (objRule.warrantId))
        {
            return false;
        }
        if (receiptDateRequired != null && objRule.section != null &&
                !receiptDateRequired.equals (objRule.receiptDateRequired))
        {
            return false;
        }
        if (processingDateRequired != null && objRule.receiptDateRequired != null &&
                !processingDateRequired.equals (objRule.processingDateRequired))
        {
            return false;
        }
        if (bmsType != null && objRule.bmsType != null && !bmsType.equals (objRule.bmsType))
        {
            return false;
        }
        if (task != null && objRule.task != null && !task.equals (objRule.task))
        {
            return false;
        }
        if (requiredParamList != null && objRule.requiredParamList != null &&
                !requiredParamList.equals (objRule.requiredParamList))
        {
            return false;
        }
        if (matchingParamNameList != null && objRule.matchingParamNameList != null &&
                !matchingParamNameList.equals (objRule.matchingParamNameList))
        {
            return false;
        }

        return true;
    }

    /**
     * (non-Javadoc).
     *
     * @param o1 the o 1
     * @return the int
     * @see java.lang.Comparable#compareTo(java.lang.Object)
     */
    public int compareTo (final IBMSRuleNonEvent o1)
    {
        if ( !(o1 instanceof BMSRuleNonEvent))
        {
            throw new ClassCastException ("Object is not of type BMSRuleNonEvent");
        }
        final BMSRuleNonEvent bms = (BMSRuleNonEvent) o1;
        if (section != null && bms.section != null && section.compareTo (bms.section) != 0)
        {
            return section.compareTo (bms.section);
        }
        else if (courtCode != null && bms.courtCode != null && courtCode.compareTo (bms.courtCode) != 0)
        {
            return courtCode.compareTo (bms.courtCode);
        }
        else if (typeOfWarrant != null && bms.typeOfWarrant != null && typeOfWarrant.compareTo (bms.typeOfWarrant) != 0)
        {
            return typeOfWarrant.compareTo (bms.typeOfWarrant);
        }
        else if (count != bms.count)
        {
            return bms.count < count ? -1 : 1;
        }
        else if (paymentType != null && bms.paymentType != null && paymentType.compareTo (bms.paymentType) != 0)
        {
            return bms.paymentType.compareTo (paymentType);
        }
        else if (payoutType != null && bms.payoutType != null && payoutType.compareTo (bms.payoutType) != 0)
        {
            return bms.payoutType.compareTo (payoutType);
        }
        else if (returnType != null && bms.returnType != null && returnType.compareTo (bms.returnType) != 0)
        {
            return bms.returnType.compareTo (returnType);
        }
        else if (returnCode != null && bms.returnCode != null && returnCode.compareTo (bms.returnCode) != 0)
        {
            return bms.returnCode.compareTo (returnCode);
        }
        else if (warrantType != null && bms.warrantType != null && warrantType.compareTo (bms.warrantType) != 0)
        {
            return bms.warrantType.compareTo (warrantType);
        }
        else if (caseType != null && bms.caseType != null && caseType.compareTo (bms.caseType) != 0)
        {
            return bms.caseType.compareTo (caseType);
        }
        else if (actionId != null && bms.actionId != null && actionId.compareTo (bms.actionId) != 0)
        {
            return bms.actionId.compareTo (actionId);
        }
        else if (manuallyCreatedReturn != bms.manuallyCreatedReturn)
        {
            return bms.manuallyCreatedReturn == false ? -1 : 1;
        }
        else if (warrantId != null && bms.warrantId != null && warrantId.compareTo (bms.warrantId) != 0)
        {
            return bms.warrantId.compareTo (warrantId);
        }
        else if (receiptDateRequired != null && bms.receiptDateRequired != null &&
                receiptDateRequired.compareTo (bms.receiptDateRequired) != 0)
        {
            return bms.receiptDateRequired.compareTo (receiptDateRequired);
        }
        else if (processingDateRequired != null && bms.processingDateRequired != null &&
                processingDateRequired.compareTo (bms.processingDateRequired) != 0)
        {
            return bms.processingDateRequired.compareTo (processingDateRequired);
        }
        else if (bmsType != null && bms.bmsType != null && bmsType.compareTo (bms.bmsType) != 0)
        {
            return bms.bmsType.compareTo (bmsType);
        }
        else if (task != null && bms.task != null && task.compareTo (bms.task) != 0)
        {
            return task.compareTo (bms.task);
        }
        else if (requiredParamList != null && bms.requiredParamList != null &&
                !requiredParamList.equals (bms.requiredParamList))
        {
            final Iterator<String> it = requiredParamList.iterator ();
            int matchCount = 0;
            if (requiredParamList.size () == bms.requiredParamList.size ())
            {
                while (it.hasNext ())
                {
                    final String comp = (String) it.next ();
                    final Iterator<String> itCompare = bms.requiredParamList.iterator ();
                    while (itCompare.hasNext ())
                    {
                        final String compStr = (String) itCompare.next ();
                        if (comp.equals (compStr))
                        {
                            matchCount++;
                        }
                    }
                }
                if (matchCount != bms.requiredParamList.size ())
                {
                    return bms.requiredParamList.size () < matchCount ? -1 : 1;
                }
            }
            else
            {
                return bms.requiredParamList.size () < requiredParamList.size () ? -1 : 1;
            }
        }
        else if (matchingParamNameList != null && bms.matchingParamNameList != null &&
                !matchingParamNameList.equals (bms.matchingParamNameList))
        {
            final Iterator<String> it = requiredParamList.iterator ();
            int matchCount = 0;

            if (matchingParamNameList.size () == bms.matchingParamNameList.size ())
            {
                while (it.hasNext ())
                {
                    final String comp = (String) it.next ();
                    final Iterator<String> itCompare = bms.matchingParamNameList.iterator ();
                    while (itCompare.hasNext ())
                    {
                        final String compStr = (String) itCompare.next ();
                        if (comp.equals (compStr))
                        {
                            matchCount++;
                        }
                    }
                }

                if (matchCount != bms.matchingParamNameList.size ())
                {
                    return bms.matchingParamNameList.size () < matchCount ? -1 : 1;
                }
            }
            else
            {
                return bms.matchingParamNameList.size () < matchingParamNameList.size () ? -1 : 1;
            }
        }
        return 0;
    }

    /**
     * (non-Javadoc).
     *
     * @return the int
     * @see java.lang.Object#hashCode()
     */
    public int hashCode ()
    {
        int result = 17;
        if (section != null)
        {
            result = 37 * result + section.hashCode ();
        }
        if (courtCode != null)
        {
            result = 37 * result + courtCode.hashCode ();
        }
        if (typeOfWarrant != null)
        {
            result = 37 * result + typeOfWarrant.hashCode ();
        }
        result = 37 * result + +count;
        if (paymentType != null)
        {
            result = 37 * result + paymentType.hashCode ();
        }
        if (payoutType != null)
        {
            result = 37 * result + payoutType.hashCode ();
        }
        if (returnType != null)
        {
            result = 37 * result + returnType.hashCode ();
        }
        if (returnCode != null)
        {
            result = 37 * result + returnCode.hashCode ();
        }
        if (warrantType != null)
        {
            result = 37 * result + warrantType.hashCode ();
        }
        if (caseType != null)
        {
            result = 37 * result + caseType.hashCode ();
        }
        if (actionId != null)
        {
            result = 37 * result + actionId.hashCode ();
        }
        result = 37 * result + new Boolean (manuallyCreatedReturn).hashCode ();
        if (warrantId != null)
        {
            result = 37 * result + warrantId.hashCode ();
        }
        if (receiptDateRequired != null)
        {
            result = 37 * result + receiptDateRequired.hashCode ();
        }
        if (processingDateRequired != null)
        {
            result = 37 * result + processingDateRequired.hashCode ();
        }
        if (task != null)
        {
            result = 37 * result + task.hashCode ();
        }
        if (bmsType != null)
        {
            result = 37 * result + bmsType.hashCode ();
        }
        if (requiredParamList != null)
        {
            result = 37 * result + requiredParamList.hashCode ();
        }
        if (matchingParamNameList != null)
        {
            result = 37 * result + matchingParamNameList.hashCode ();
        }
        return result;
    }

    /**
     * (non-Javadoc).
     *
     * @return the string
     * @throws SystemException the system exception
     * @see uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSRuleNonEvent#toXML()
     */
    public String toXML () throws SystemException
    {
        final StringBuffer strBuf = new StringBuffer ();
        addXMLTag (strBuf, BMSRULE_TAG, false);
        addXMLTagValues (strBuf, section, SECTION_TAG);
        addXMLTagValues (strBuf, courtCode, COURT_CODE_TAG);
        addXMLTagValues (strBuf, typeOfWarrant, TYPE_OF_WARRANT_TAG);
        addXMLTagValues (strBuf, Integer.toString (count), COUNT_TAG);
        addXMLTagValues (strBuf, paymentType, PAYMENT_TYPE_TAG);
        addXMLTagValues (strBuf, payoutType, PAYOUTTYPE_TAG);
        addXMLTagValues (strBuf, returnType, RETURN_TYPE_TAG);
        addXMLTagValues (strBuf, returnCode, RETURN_CODE_TAG);
        addXMLTagValues (strBuf, warrantType, WARRANT_TYPE_TAG);
        addXMLTagValues (strBuf, caseType, CASE_TYPE_TAG);
        addXMLTagValues (strBuf, actionId, ACTIONID_TAG);
        addXMLTagValues (strBuf, Boolean.toString (manuallyCreatedReturn), MANUALLY_CREATED_RETURN_TAG);
        addXMLTagValues (strBuf, warrantId, WARRANT_ID_TAG);
        addXMLTagValues (strBuf, receiptDateRequired.toString (), RECEIPT_DATE_REQUIRED_TAG);
        addXMLTagValues (strBuf, processingDateRequired.toString (), PROCESSING_DATE_REQUIRED_TAG);
        addXMLTagValues (strBuf, task, TASK_TAG);
        addXMLTagValues (strBuf, bmsType, BMSTYPE_TAG);
        addXMLTag (strBuf, BMSRULE_TAG, true);
        final SAXBuilder builder = new SAXBuilder ();
        try
        {
            return out.outputString (builder.build (new StringReader (strBuf.toString ())).getRootElement ());
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * (non-Javadoc).
     *
     * @return the string
     * @see java.lang.Object#toString()
     */
    public String toString ()
    {
        return "\n[ <-- " + BMSRULE_TAG + " OBJECT = \n" + SECTION_TAG + " = " + section + ", " + COURT_CODE_TAG +
                " = " + courtCode + ", " + TYPE_OF_WARRANT_TAG + " = " + typeOfWarrant + ", " + COUNT_TAG + " = " +
                count + ", " + PAYMENT_TYPE_TAG + " = " + paymentType + ", " + PAYOUTTYPE_TAG + " = " + payoutType +
                ", " + RETURN_TYPE_TAG + " = " + returnType + ", " + RETURN_CODE_TAG + " = " + returnCode + ", " +
                WARRANT_TYPE_TAG + " = " + warrantType + ", " + CASE_TYPE_TAG + " = " + caseType + ", " + ACTIONID_TAG +
                " = " + actionId + ", " + MANUALLY_CREATED_RETURN_TAG + " = " + manuallyCreatedReturn + ", " +
                WARRANT_ID_TAG + " = " + warrantId + ", " + RECEIPT_DATE_REQUIRED_TAG + " = " + receiptDateRequired +
                ", " + PROCESSING_DATE_REQUIRED_TAG + " = " + processingDateRequired + "," + TASK_TAG + " = " + task +
                ", " + BMSTYPE_TAG + " = " + bmsType + " \n" + ERROR_TAG + " = " + error + " \n" +
                REQUIRED_PARAMLIST_TAG + " = " + requiredParamList.toString () + "\n" + MATCHING_PARAMLIST_TAG + " = " +
                matchingParamNameList.toString () + " --> ]";
    }

    /**
     * Adds the XML tag values.
     *
     * @param strBuf the str buf
     * @param val the val
     * @param constant the constant
     */
    private void addXMLTagValues (final StringBuffer strBuf, final String val, final String constant)
    {
        addXMLTag (strBuf, constant, false);
        strBuf.append (val);
        addXMLTag (strBuf, constant, true);
    }

    /**
     * Adds the XML tag.
     *
     * @param strBuf the str buf
     * @param constant the constant
     * @param endTag the end tag
     */
    private void addXMLTag (final StringBuffer strBuf, final String constant, final boolean endTag)
    {
        strBuf.append (STARTTAG);
        if (endTag)
        {
            strBuf.append (SLASH);
        }
        strBuf.append (constant);
        strBuf.append (ENDTAG);
    }

    /**
     * (non-Javadoc).
     *
     * @param methodName the method name
     * @see uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSRuleNonEvent#addMethodToCompare(java.lang.String)
     */
    public void addMethodToCompare (final String methodName)
    {
        matchingParamNameList.add (methodName);
    }

    /**
     * (non-Javadoc).
     *
     * @param param the param
     * @see uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSRuleNonEvent#addRequiredParamToList(java.lang.String)
     */
    public void addRequiredParamToList (final String param)
    {
        requiredParamList.add (param);
    }

    /**
     * {@inheritDoc}
     */
    public List<String> getComparableValues ()
    {
        return matchingParamNameList;
    }

    /**
     * {@inheritDoc}
     */
    public List<String> getRequiredParamValues ()
    {
        return requiredParamList;
    }

    /**
     * Format date.
     *
     * @param pDate the date
     * @return the string
     */
    private String formatDate (final Date pDate)
    {
        SimpleDateFormat dateFormat = null;
        dateFormat = new SimpleDateFormat ("yyyy-MM-dd");
        dateFormat.applyPattern ("yyyy-MM-dd");
        return dateFormat.format (pDate);
    }
}
