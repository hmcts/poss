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

import uk.gov.dca.utils.common.AbstractBaseUtils;

/**
 * Utility class representing a new Standard Event to be created. Object can be created,
 * initialised and passed into a method that will interpret the setup and create the
 * event accordingly
 */
public class NewStandardEvent
{
    
    /** The event id. */
    // Private members representing the configuration items of the event
    private String eventId;
    
    /** The receipt date. */
    private String receiptDate;
    
    /** The event date. */
    private String eventDate;
    
    /** The subject party. */
    private String subjectParty;
    
    /** The instigator party. */
    private String instigatorParty;
    
    /** The issue stage. */
    private String issueStage;
    
    /** The service status. */
    private String serviceStatus;
    
    /** The bailiff id. */
    private String bailiffId;
    
    /** The event details. */
    private String eventDetails;
    
    /** The creditor. */
    private String creditor;
    
    /** The check notice. */
    private boolean checkNotice;
    
    /** The appointment date. */
    private String appointmentDate;
    
    /** The appointment time. */
    private String appointmentTime;
    
    /** The produce output. */
    private boolean produceOutput;
    
    /** The navigate obligations. */
    private boolean navigateObligations;
    
    /** The output final. */
    private boolean outputFinal;
    
    /** The bypass BMS. */
    private boolean bypassBMS;
    
    /** The cancel FCK. */
    private boolean cancelFCK;
    
    /** The obligation notes. */
    private String obligationNotes;
    
    /** The ccbc case. */
    private boolean ccbcCase;
    
    /** The force obligation exit. */
    private boolean forceObligationExit;

    /**
     * Constructor.
     *
     * @param pEventId String representing the id of the event
     */
    public NewStandardEvent (final String pEventId)
    {
        // Set the event id and the default values
        eventId = pEventId;
        receiptDate = ""; // Set receipt date to current date
        eventDate = ""; // Set event date to current date
        subjectParty = ""; // no subject
        instigatorParty = ""; // no instigator
        issueStage = ""; // no issue stage
        serviceStatus = ""; // no service status
        bailiffId = ""; // no bailiff Id
        eventDetails = "AUTOMATIC EVENT"; // event details
        creditor = ""; // no Creditor
        checkNotice = false; // do not check Notice checkbox
        appointmentDate = AbstractBaseUtils.now (); // Set appointment date to current date
        appointmentTime = "12:00"; // Set appointment time to midday
        produceOutput = true; // produce wp output
        navigateObligations = false; // do not navigate to obligations
        outputFinal = true; // mark output as final in FCK Editor
        bypassBMS = false; // By default do not bypass the BMS popup
        cancelFCK = false; // By default, do not click Cancel on the FCK Editor screen
        obligationNotes = "";
        ccbcCase = false; // By default, not a CCBC case
        forceObligationExit = false; // Force exit from Obligations screen
    }

    /**
     * Gets the event id.
     *
     * @return the event id
     */
    public String getEventId ()
    {
        return eventId;
    }

    /**
     * Gets the CO event id.
     *
     * @return the CO event id
     */
    public String getCOEventId ()
    {
        String returnValue = eventId;
        if (eventId.indexOf ("-") != -1)
        {
            // Event Id features a hyphen, extract only the event id
            returnValue = eventId.substring (eventId.indexOf ("-") + 1);
        }
        return returnValue;
    }

    /**
     * Gets the receipt date.
     *
     * @return the receipt date
     */
    public String getReceiptDate ()
    {
        return receiptDate;
    }

    /**
     * Sets the receipt date.
     *
     * @param pReceiptDate the new receipt date
     */
    public void setReceiptDate (final String pReceiptDate)
    {
        receiptDate = pReceiptDate;
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
     * @param pEventDate the new event date
     */
    public void setEventDate (final String pEventDate)
    {
        eventDate = pEventDate;
    }

    /**
     * Gets the warrant return code.
     *
     * @return the warrant return code
     */
    public String getWarrantReturnCode ()
    {
        return eventId.substring (eventId.indexOf ("-") + 1);
    }

    /**
     * Gets the subject party.
     *
     * @return the subject party
     */
    public String getSubjectParty ()
    {
        return subjectParty;
    }

    /**
     * Sets the subject party.
     *
     * @param pSubjectParty the new subject party
     */
    public void setSubjectParty (final String pSubjectParty)
    {
        subjectParty = pSubjectParty;
    }

    /**
     * Gets the instigator party.
     *
     * @return the instigator party
     */
    public String getInstigatorParty ()
    {
        return instigatorParty;
    }

    /**
     * Sets the instigator party.
     *
     * @param pInstigatorParty the new instigator party
     */
    public void setInstigatorParty (final String pInstigatorParty)
    {
        instigatorParty = pInstigatorParty;
    }

    /**
     * Gets the issue stage.
     *
     * @return the issue stage
     */
    public String getIssueStage ()
    {
        return issueStage;
    }

    /**
     * Sets the issue stage.
     *
     * @param pIssueStage the new issue stage
     */
    public void setIssueStage (final String pIssueStage)
    {
        issueStage = pIssueStage;
    }

    /**
     * Gets the service status.
     *
     * @return the service status
     */
    public String getServiceStatus ()
    {
        return serviceStatus;
    }

    /**
     * Sets the service status.
     *
     * @param pServiceStatus the new service status
     */
    public void setServiceStatus (final String pServiceStatus)
    {
        serviceStatus = pServiceStatus;
    }

    /**
     * Gets the bailiff id.
     *
     * @return the bailiff id
     */
    public String getBailiffId ()
    {
        return bailiffId;
    }

    /**
     * Sets the bailiff id.
     *
     * @param pBailiffId the new bailiff id
     */
    public void setBailiffId (final String pBailiffId)
    {
        bailiffId = pBailiffId;
    }

    /**
     * Gets the event details.
     *
     * @return the event details
     */
    public String getEventDetails ()
    {
        return eventDetails;
    }

    /**
     * Sets the event details.
     *
     * @param pEventDetails the new event details
     */
    public void setEventDetails (final String pEventDetails)
    {
        eventDetails = pEventDetails;
    }

    /**
     * Gets the creditor.
     *
     * @return the creditor
     */
    public String getCreditor ()
    {
        return creditor;
    }

    /**
     * Sets the creditor.
     *
     * @param pCreditor the new creditor
     */
    public void setCreditor (final String pCreditor)
    {
        creditor = pCreditor;
    }

    /**
     * Gets the check notice.
     *
     * @return the check notice
     */
    public boolean getCheckNotice ()
    {
        return checkNotice;
    }

    /**
     * Sets the check notice.
     *
     * @param pCheckNotice the new check notice
     */
    public void setCheckNotice (final boolean pCheckNotice)
    {
        checkNotice = pCheckNotice;
    }

    /**
     * Gets the appointment date.
     *
     * @return the appointment date
     */
    public String getAppointmentDate ()
    {
        return appointmentDate;
    }

    /**
     * Sets the appointment date.
     *
     * @param pAppointmentDate the new appointment date
     */
    public void setAppointmentDate (final String pAppointmentDate)
    {
        appointmentDate = pAppointmentDate;
    }

    /**
     * Gets the appointment time.
     *
     * @return the appointment time
     */
    public String getAppointmentTime ()
    {
        return appointmentTime;
    }

    /**
     * Sets the appointment time.
     *
     * @param pAppointmentTime the new appointment time
     */
    public void setAppointmentTime (final String pAppointmentTime)
    {
        appointmentTime = pAppointmentTime;
    }

    /**
     * Gets the produce output flag.
     *
     * @return the produce output flag
     */
    public boolean getProduceOutputFlag ()
    {
        return produceOutput;
    }

    /**
     * Sets the produce output flag.
     *
     * @param pProduceOutput the new produce output flag
     */
    public void setProduceOutputFlag (final boolean pProduceOutput)
    {
        produceOutput = pProduceOutput;
    }

    /**
     * Gets the navigate obligations.
     *
     * @return the navigate obligations
     */
    public boolean getNavigateObligations ()
    {
        return navigateObligations;
    }

    /**
     * Sets the navigate obligations.
     *
     * @param pNavigateObligations the new navigate obligations
     */
    public void setNavigateObligations (final boolean pNavigateObligations)
    {
        navigateObligations = pNavigateObligations;
    }

    /**
     * Gets the output final.
     *
     * @return the output final
     */
    public boolean getOutputFinal ()
    {
        return outputFinal;
    }

    /**
     * Sets the output final.
     *
     * @param pOutputFinal the new output final
     */
    public void setOutputFinal (final boolean pOutputFinal)
    {
        outputFinal = pOutputFinal;
    }

    /**
     * Gets the bypass BMS popup.
     *
     * @return the bypass BMS popup
     */
    public boolean getBypassBMSPopup ()
    {
        return bypassBMS;
    }

    /**
     * Sets the bypass BMS popup.
     *
     * @param pBypassBMS the new bypass BMS popup
     */
    public void setBypassBMSPopup (final boolean pBypassBMS)
    {
        bypassBMS = pBypassBMS;
    }

    /**
     * Gets the cancel FCK.
     *
     * @return the cancel FCK
     */
    public boolean getCancelFCK ()
    {
        return cancelFCK;
    }

    /**
     * Sets the cancel FCK.
     *
     * @param pCancelFCK the new cancel FCK
     */
    public void setCancelFCK (final boolean pCancelFCK)
    {
        cancelFCK = pCancelFCK;
    }

    /**
     * Gets the obligation notes.
     *
     * @return the obligation notes
     */
    public String getObligationNotes ()
    {
        return obligationNotes;
    }

    /**
     * Sets the obligation notes.
     *
     * @param pNotes the new obligation notes
     */
    public void setObligationNotes (final String pNotes)
    {
        obligationNotes = pNotes;
    }

    /**
     * Gets the CCBC case.
     *
     * @return the CCBC case
     */
    public boolean getCCBCCase ()
    {
        return ccbcCase;
    }

    /**
     * Sets the CCBC case.
     *
     * @param pCCBC the new CCBC case
     */
    public void setCCBCCase (final boolean pCCBC)
    {
        ccbcCase = pCCBC;
    }

    /**
     * Gets the force obligation exit.
     *
     * @return the force obligation exit
     */
    public boolean getForceObligationExit ()
    {
        return forceObligationExit;
    }

    /**
     * Sets the force obligation exit.
     *
     * @param pExit the new force obligation exit
     */
    public void setForceObligationExit (final boolean pExit)
    {
        forceObligationExit = pExit;
    }

}