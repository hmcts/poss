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

/**
 * Utility class representing a standard event configuration.
 */
public class EventConfig
{
    
    /** The event id. */
    private String eventId;
    
    /** The has subject. */
    private boolean hasSubject;
    
    /** The has instigator. */
    private boolean hasInstigator;
    
    /** The has issue stage. */
    private boolean hasIssueStage;
    
    /** The details mandatory. */
    private boolean detailsMandatory;
    
    /** The has creditor. */
    private boolean hasCreditor;
    
    /** The has notice. */
    private boolean hasNotice;
    
    /** The has appointment. */
    private boolean hasAppointment;
    
    /** The produce output enabled. */
    private boolean produceOutputEnabled;
    
    /** The lov on save. */
    private boolean lovOnSave;
    
    /** The nav WFT. */
    private boolean navWFT;
    
    private boolean navHearings;
    
    /** The obligations option. */
    private String obligationsOption;
    
    /** The produce output. */
    private boolean produceOutput;
    
    /** The produce OR output. */
    private boolean produceOROutput;
    
    /** The variable data screen. */
    private boolean variableDataScreen;
    
    /** The variable data screen title. */
    private String variableDataScreenTitle;
    
    /** The fck editor. */
    private boolean fckEditor;
    
    /** The ccbc transfer. */
    private boolean ccbcTransfer;
    
    /** The detailsofclaim. */
    private boolean detailsofclaim;
    
    /** The ccbc no fck. */
    private boolean ccbcNoFck;

    /**
     * Constructor.
     */
    public EventConfig ()
    {
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
     * Sets the event id.
     *
     * @param pEventId the new event id
     */
    public void setEventId (final String pEventId)
    {
        eventId = pEventId;
    }

    /**
     * Gets the has subject.
     *
     * @return the has subject
     */
    public boolean getHasSubject ()
    {
        return hasSubject;
    }

    /**
     * Sets the has subject.
     *
     * @param pHasSubject the new has subject
     */
    public void setHasSubject (final boolean pHasSubject)
    {
        hasSubject = pHasSubject;
    }

    /**
     * Gets the has instigator.
     *
     * @return the has instigator
     */
    public boolean getHasInstigator ()
    {
        return hasInstigator;
    }

    /**
     * Sets the has instigator.
     *
     * @param pHasInstigator the new has instigator
     */
    public void setHasInstigator (final boolean pHasInstigator)
    {
        hasInstigator = pHasInstigator;
    }

    /**
     * Gets the has issue stage.
     *
     * @return the has issue stage
     */
    public boolean getHasIssueStage ()
    {
        return hasIssueStage;
    }

    /**
     * Sets the has issue stage.
     *
     * @param pHasIssueStage the new has issue stage
     */
    public void setHasIssueStage (final boolean pHasIssueStage)
    {
        hasIssueStage = pHasIssueStage;
    }

    /**
     * Gets the details mandatory.
     *
     * @return the details mandatory
     */
    public boolean getDetailsMandatory ()
    {
        return detailsMandatory;
    }

    /**
     * Sets the details mandatory.
     *
     * @param pDetailsMandatory the new details mandatory
     */
    public void setDetailsMandatory (final boolean pDetailsMandatory)
    {
        detailsMandatory = pDetailsMandatory;
    }

    /**
     * Gets the has notice.
     *
     * @return the has notice
     */
    public boolean getHasNotice ()
    {
        return hasNotice;
    }

    /**
     * Sets the has notice.
     *
     * @param pHasNotice the new has notice
     */
    public void setHasNotice (final boolean pHasNotice)
    {
        hasNotice = pHasNotice;
    }

    /**
     * Gets the has appointment.
     *
     * @return the has appointment
     */
    public boolean getHasAppointment ()
    {
        return hasAppointment;
    }

    /**
     * Sets the has appointment.
     *
     * @param pHasAppointment the new has appointment
     */
    public void setHasAppointment (final boolean pHasAppointment)
    {
        hasAppointment = pHasAppointment;
    }

    /**
     * Gets the has creditor.
     *
     * @return the has creditor
     */
    public boolean getHasCreditor ()
    {
        return hasCreditor;
    }

    /**
     * Sets the has creditor.
     *
     * @param pHasCreditor the new has creditor
     */
    public void setHasCreditor (final boolean pHasCreditor)
    {
        hasCreditor = pHasCreditor;
    }

    /**
     * Gets the produce output enabled.
     *
     * @return the produce output enabled
     */
    public boolean getProduceOutputEnabled ()
    {
        return produceOutputEnabled;
    }

    /**
     * Sets the produce output enabled.
     *
     * @param pProduceOutputEnabled the new produce output enabled
     */
    public void setProduceOutputEnabled (final boolean pProduceOutputEnabled)
    {
        produceOutputEnabled = pProduceOutputEnabled;
    }

    /**
     * Gets the lov on save.
     *
     * @return the lov on save
     */
    public boolean getLovOnSave ()
    {
        return lovOnSave;
    }

    /**
     * Sets the lov on save.
     *
     * @param pLovOnSave the new lov on save
     */
    public void setLovOnSave (final boolean pLovOnSave)
    {
        lovOnSave = pLovOnSave;
    }

    /**
     * Gets the nav WFT.
     *
     * @return the nav WFT
     */
    public boolean getNavWFT ()
    {
        return navWFT;
    }

    /**
     * Sets the nav WFT.
     *
     * @param pNavWFT the new nav WFT
     */
    public void setNavWFT (final boolean pNavWFT)
    {
        navWFT = pNavWFT;
    }
    
    /**
     * Indicates whether the event will navigate to the Hearings screen
     * @return The value of the navHearings variable
     */
    public boolean getNavHearings()
    {
        return navHearings;
    }
    
    /**
     * Sets the navHearings variable
     * @param pNavHearings  The new value for the navHearings variable
     */
    public void setNavHearings(final boolean pNavHearings)
    {
        navHearings = pNavHearings;
    }
    
    /**
     * Gets the obligations option.
     *
     * @return the obligations option
     */
    public String getObligationsOption ()
    {
        return obligationsOption;
    }

    /**
     * Sets the obligations option.
     *
     * @param pObligationsOption the new obligations option
     */
    public void setObligationsOption (final String pObligationsOption)
    {
        obligationsOption = pObligationsOption;
    }

    /**
     * Gets the output produced.
     *
     * @return the output produced
     */
    public boolean getOutputProduced ()
    {
        return produceOutput;
    }

    /**
     * Sets the output produced.
     *
     * @param pOutputProduced the new output produced
     */
    public void setOutputProduced (final boolean pOutputProduced)
    {
        produceOutput = pOutputProduced;
    }

    /**
     * Gets the output OR produced.
     *
     * @return the output OR produced
     */
    public boolean getOutputORProduced ()
    {
        return produceOROutput;
    }

    /**
     * Sets the OR output produced.
     *
     * @param pOutputProduced the new OR output produced
     */
    public void setOROutputProduced (final boolean pOutputProduced)
    {
        produceOROutput = pOutputProduced;
    }

    /**
     * Gets the variable data screen.
     *
     * @return the variable data screen
     */
    public boolean getVariableDataScreen ()
    {
        return variableDataScreen;
    }

    /**
     * Sets the variable data screen.
     *
     * @param pVariableDataScreen the new variable data screen
     */
    public void setVariableDataScreen (final boolean pVariableDataScreen)
    {
        variableDataScreen = pVariableDataScreen;
    }

    /**
     * Gets the variable data screen title.
     *
     * @return the variable data screen title
     */
    public String getVariableDataScreenTitle ()
    {
        return variableDataScreenTitle;
    }

    /**
     * Sets the variable data screen title.
     *
     * @param pVariableDataScreenTitle the new variable data screen title
     */
    public void setVariableDataScreenTitle (final String pVariableDataScreenTitle)
    {
        variableDataScreenTitle = pVariableDataScreenTitle;
    }

    /**
     * Gets the fck editor.
     *
     * @return the fck editor
     */
    public boolean getFckEditor ()
    {
        return fckEditor;
    }

    /**
     * Sets the fck editor.
     *
     * @param pFCKEditor the new fck editor
     */
    public void setFckEditor (final boolean pFCKEditor)
    {
        fckEditor = pFCKEditor;
    }

    /**
     * Gets the CCBC transfer.
     *
     * @return the CCBC transfer
     */
    public boolean getCCBCTransfer ()
    {
        return ccbcTransfer;
    }

    /**
     * Sets the CCBC transfer.
     *
     * @param pCCBCTransfer the new CCBC transfer
     */
    public void setCCBCTransfer (final boolean pCCBCTransfer)
    {
        ccbcTransfer = pCCBCTransfer;
    }

    /**
     * Gets the details of claim.
     *
     * @return the details of claim
     */
    public boolean getDetailsOfClaim ()
    {
        return detailsofclaim;
    }

    /**
     * Sets the details of claim.
     *
     * @param pDetsOfClaim the new details of claim
     */
    public void setDetailsOfClaim (final boolean pDetsOfClaim)
    {
        detailsofclaim = pDetsOfClaim;
    }

    /**
     * Gets the CCBC no fck editor.
     *
     * @return the CCBC no fck editor
     */
    public boolean getCCBCNoFckEditor ()
    {
        return ccbcNoFck;
    }

    /**
     * Sets the CCBC no fck editor.
     *
     * @param pNoFck the new CCBC no fck editor
     */
    public void setCCBCNoFckEditor (final boolean pNoFck)
    {
        ccbcNoFck = pNoFck;
    }

}