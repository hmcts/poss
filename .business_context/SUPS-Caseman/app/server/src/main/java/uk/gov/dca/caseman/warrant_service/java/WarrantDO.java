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
package uk.gov.dca.caseman.warrant_service.java;

/**
 * The Class WarrantDO.
 */
public class WarrantDO implements IWarrantDO
{

    /** The Warrant ID. */
    private String WarrantID;
    
    /** The Warrant number. */
    private String WarrantNumber;
    
    /** The Local number. */
    private String LocalNumber;
    
    /** The Original warrant number. */
    private String OriginalWarrantNumber;
    
    /** The Warrant type. */
    private String WarrantType;
    
    /** The Case number. */
    private String CaseNumber;
    
    /** The CO number. */
    private String CONumber;
    
    /** The Date request received. */
    private String DateRequestReceived;
    
    /** The Issued by. */
    private String IssuedBy;
    
    /** The Issue date. */
    private String IssueDate;
    
    /** The Owned by. */
    private String OwnedBy;
    
    /** The Home court issue date. */
    private String HomeCourtIssueDate;
    
    /** The Executing court code. */
    private String ExecutingCourtCode;
    
    /** The Bailiff area no. */
    private String BailiffAreaNo;
    
    /** The Additional notes. */
    private String AdditionalNotes;
    
    /** The Balance of debt. */
    private String BalanceOfDebt;
    
    /** The Balance of debt currency. */
    private String BalanceOfDebtCurrency;
    
    /** The Amount of warrant. */
    private String AmountOfWarrant;
    
    /** The Amount of warrant currency. */
    private String AmountOfWarrantCurrency;
    
    /** The Fee. */
    private String Fee;
    
    /** The Fee currency. */
    private String FeeCurrency;
    
    /** The Solicitors costs. */
    private String SolicitorsCosts;
    
    /** The Solicitors costs currency. */
    private String SolicitorsCostsCurrency;
    
    /** The Land registry fee. */
    private String LandRegistryFee;
    
    /** The Land registry fee currency. */
    private String LandRegistryFeeCurrency;
    
    /** The Balance after paid. */
    private String BalanceAfterPaid;
    
    /** The Balance after paid currency. */
    private String BalanceAfterPaidCurrency;
    
    /** The CCBC warrant. */
    private String CCBCWarrant;
    
    /** The Created by. */
    private String CreatedBy;
    
    /** The To transfer. */
    private String ToTransfer;
    
    /** The Transfer date. */
    private String TransferDate;
    
    /** The Case event seq. */
    private String CaseEventSeq;

    /** The Claimant name. */
    private String ClaimantName;
    
    /** The Claimant code. */
    private String ClaimantCode;
    
    /** The Claimant representative. */
    private String ClaimantRepresentative;
    
    /** The Claimant representative number. */
    private String ClaimantRepresentativeNumber;
    
    /** The Claimant representative party type. */
    private String ClaimantRepresentativePartyType;
    
    /** The Claimant representative name. */
    private String ClaimantRepresentativeName;
    
    /** The Claimant representative code. */
    private String ClaimantRepresentativeCode;
    
    /** The Claimant representative address line 1. */
    private String ClaimantRepresentativeAddressLine1;
    
    /** The Claimant representative address line 2. */
    private String ClaimantRepresentativeAddressLine2;
    
    /** The Claimant representative address line 3. */
    private String ClaimantRepresentativeAddressLine3;
    
    /** The Claimant representative address line 4. */
    private String ClaimantRepresentativeAddressLine4;
    
    /** The Claimant representative address line 5. */
    private String ClaimantRepresentativeAddressLine5;
    
    /** The Claimant representative post code. */
    private String ClaimantRepresentativePostCode;
    
    /** The Claimant representative DX. */
    private String ClaimantRepresentativeDX;
    
    /** The Claimant representative telephone number. */
    private String ClaimantRepresentativeTelephoneNumber;
    
    /** The Claimant representative fax number. */
    private String ClaimantRepresentativeFaxNumber;
    
    /** The Claimant representative email address. */
    private String ClaimantRepresentativeEmailAddress;
    
    /** The Claimant representative reference. */
    private String ClaimantRepresentativeReference;

    /** The Defendant 1 name. */
    private String Defendant1Name;
    
    /** The Defendant 1 number. */
    private String Defendant1Number;
    
    /** The Defendant 1 party type. */
    private String Defendant1PartyType;
    
    /** The Defendant 1 address line 1. */
    private String Defendant1AddressLine1;
    
    /** The Defendant 1 address line 2. */
    private String Defendant1AddressLine2;
    
    /** The Defendant 1 address line 3. */
    private String Defendant1AddressLine3;
    
    /** The Defendant 1 address line 4. */
    private String Defendant1AddressLine4;
    
    /** The Defendant 1 address line 5. */
    private String Defendant1AddressLine5;
    
    /** The Defendant 1 post code. */
    private String Defendant1PostCode;
    
    /** The Defendant 1 judgment ID. */
    private String Defendant1JudgmentID;

    /** The Defendant 2 name. */
    private String Defendant2Name;
    
    /** The Defendant 2 number. */
    private String Defendant2Number;
    
    /** The Defendant 2 party type. */
    private String Defendant2PartyType;
    
    /** The Defendant 2 address line 1. */
    private String Defendant2AddressLine1;
    
    /** The Defendant 2 address line 2. */
    private String Defendant2AddressLine2;
    
    /** The Defendant 2 address line 3. */
    private String Defendant2AddressLine3;
    
    /** The Defendant 2 address line 4. */
    private String Defendant2AddressLine4;
    
    /** The Defendant 2 address line 5. */
    private String Defendant2AddressLine5;
    
    /** The Defendant 2 post code. */
    private String Defendant2PostCode;
    
    /** The Defendant 2 judgment ID. */
    private String Defendant2JudgmentID;

    /**
     * Instantiates a new warrant DO.
     */
    public WarrantDO ()
    {

        WarrantID = "";
        WarrantNumber = "";
        LocalNumber = "";
        OriginalWarrantNumber = "";
        WarrantType = "";
        CaseNumber = "";
        CONumber = "";
        DateRequestReceived = "";
        IssuedBy = "";
        IssueDate = "";
        OwnedBy = "";
        HomeCourtIssueDate = "";
        ExecutingCourtCode = "";
        BailiffAreaNo = "";
        AdditionalNotes = "";
        BalanceOfDebt = "";
        AmountOfWarrant = "";
        AmountOfWarrantCurrency = "";
        Fee = "";
        FeeCurrency = "";
        SolicitorsCosts = "";
        SolicitorsCostsCurrency = "";
        LandRegistryFee = "";
        LandRegistryFeeCurrency = "";
        BalanceAfterPaid = "";
        BalanceAfterPaidCurrency = "";
        CCBCWarrant = "";
        CreatedBy = "";
        ToTransfer = "";
        TransferDate = "";
        CaseEventSeq = "";

        ClaimantName = "";
        ClaimantCode = "";
        ClaimantRepresentative = "";
        ClaimantRepresentativeNumber = "";
        ClaimantRepresentativePartyType = "";
        ClaimantRepresentativeName = "";
        ClaimantRepresentativeCode = "";
        ClaimantRepresentativeAddressLine1 = "";
        ClaimantRepresentativeAddressLine2 = "";
        ClaimantRepresentativeAddressLine3 = "";
        ClaimantRepresentativeAddressLine4 = "";
        ClaimantRepresentativeAddressLine5 = "";
        ClaimantRepresentativePostCode = "";
        ClaimantRepresentativeDX = "";
        ClaimantRepresentativeTelephoneNumber = "";
        ClaimantRepresentativeFaxNumber = "";
        ClaimantRepresentativeEmailAddress = "";
        ClaimantRepresentativeReference = "";

        Defendant1Name = "";
        Defendant1Number = "";
        Defendant1PartyType = "";
        Defendant1AddressLine1 = "";
        Defendant1AddressLine2 = "";
        Defendant1AddressLine3 = "";
        Defendant1AddressLine4 = "";
        Defendant1AddressLine5 = "";
        Defendant1PostCode = "";
        Defendant1JudgmentID = "";

        Defendant2Name = "";
        Defendant2Number = "";
        Defendant2PartyType = "";
        Defendant2AddressLine1 = "";
        Defendant2AddressLine2 = "";
        Defendant2AddressLine3 = "";
        Defendant2AddressLine4 = "";
        Defendant2AddressLine5 = "";
        Defendant2PostCode = "";
        Defendant2JudgmentID = "";

    }

    /**
     * {@inheritDoc}
     */
    public String getAdditionalNotes ()
    {
        return AdditionalNotes;
    }

    /**
     * {@inheritDoc}
     */

    public void setAdditionalNotes (final String additionalNotes)
    {
        AdditionalNotes = additionalNotes;
    }

    /**
     * {@inheritDoc}
     */

    public String getAmountOfWarrant ()
    {
        return AmountOfWarrant;
    }

    /**
     * {@inheritDoc}
     */

    public void setAmountOfWarrant (final String amountOfWarrant)
    {
        AmountOfWarrant = amountOfWarrant;
    }

    /**
     * {@inheritDoc}
     */

    public String getAmountOfWarrantCurrency ()
    {
        return AmountOfWarrantCurrency;
    }

    /**
     * {@inheritDoc}
     */

    public void setAmountOfWarrantCurrency (final String amountOfWarrantCurrency)
    {
        AmountOfWarrantCurrency = amountOfWarrantCurrency;
    }

    /**
     * {@inheritDoc}
     */

    public String getBailiffAreaNo ()
    {
        return BailiffAreaNo;
    }

    /**
     * {@inheritDoc}
     */

    public void setBailiffAreaNo (final String bailiffAreaNo)
    {
        BailiffAreaNo = bailiffAreaNo;
    }

    /**
     * {@inheritDoc}
     */

    public String getBalanceAfterPaid ()
    {
        return BalanceAfterPaid;
    }

    /**
     * {@inheritDoc}
     */

    public void setBalanceAfterPaid (final String balanceAfterPaid)
    {
        BalanceAfterPaid = balanceAfterPaid;
    }

    /**
     * {@inheritDoc}
     */

    public String getBalanceAfterPaidCurrency ()
    {
        return BalanceAfterPaidCurrency;
    }

    /**
     * {@inheritDoc}
     */

    public void setBalanceAfterPaidCurrency (final String balanceAfterPaidCurrency)
    {
        BalanceAfterPaidCurrency = balanceAfterPaidCurrency;
    }

    /**
     * {@inheritDoc}
     */

    public String getBalanceOfDebt ()
    {
        return BalanceOfDebt;
    }

    /**
     * {@inheritDoc}
     */

    public void setBalanceOfDebt (final String balanceOfDebt)
    {
        BalanceOfDebt = balanceOfDebt;
    }

    /**
     * {@inheritDoc}
     */

    public String getBalanceOfDebtCurrency ()
    {
        return BalanceOfDebtCurrency;
    }

    /**
     * {@inheritDoc}
     */

    public void setBalanceOfDebtCurrency (final String balanceOfDebtCurrency)
    {
        BalanceOfDebtCurrency = balanceOfDebtCurrency;
    }

    /**
     * {@inheritDoc}
     */

    public String getCaseEventSeq ()
    {
        return CaseEventSeq;
    }

    /**
     * {@inheritDoc}
     */

    public void setCaseEventSeq (final String caseEventSeq)
    {
        CaseEventSeq = caseEventSeq;
    }

    /**
     * {@inheritDoc}
     */

    public String getCaseNumber ()
    {
        return CaseNumber;
    }

    /**
     * {@inheritDoc}
     */

    public void setCaseNumber (final String caseNumber)
    {
        CaseNumber = caseNumber;
    }

    /**
     * {@inheritDoc}
     */

    public String getCCBCWarrant ()
    {
        return CCBCWarrant;
    }

    /**
     * {@inheritDoc}
     */

    public void setCCBCWarrant (final String warrant)
    {
        CCBCWarrant = warrant;
    }

    /**
     * {@inheritDoc}
     */

    public String getClaimantCode ()
    {
        return ClaimantCode;
    }

    /**
     * {@inheritDoc}
     */

    public void setClaimantCode (final String claimantCode)
    {
        ClaimantCode = claimantCode;
    }

    /**
     * {@inheritDoc}
     */

    public String getClaimantName ()
    {
        return ClaimantName;
    }

    /**
     * {@inheritDoc}
     */

    public void setClaimantName (final String claimantName)
    {
        ClaimantName = claimantName;
    }

    /**
     * {@inheritDoc}
     */

    public String getClaimantRepresentative ()
    {
        return ClaimantRepresentative;
    }

    /**
     * {@inheritDoc}
     */

    public void setClaimantRepresentative (final String claimantRepresentative)
    {
        ClaimantRepresentative = claimantRepresentative;
    }

    /**
     * {@inheritDoc}
     */

    public String getClaimantRepresentativeAddressLine1 ()
    {
        return ClaimantRepresentativeAddressLine1;
    }

    /**
     * {@inheritDoc}
     */

    public void setClaimantRepresentativeAddressLine1 (final String claimantRepresentativeAddressLine1)
    {
        ClaimantRepresentativeAddressLine1 = claimantRepresentativeAddressLine1;
    }

    /**
     * {@inheritDoc}
     */

    public String getClaimantRepresentativeAddressLine2 ()
    {
        return ClaimantRepresentativeAddressLine2;
    }

    /**
     * {@inheritDoc}
     */

    public void setClaimantRepresentativeAddressLine2 (final String claimantRepresentativeAddressLine2)
    {
        ClaimantRepresentativeAddressLine2 = claimantRepresentativeAddressLine2;
    }

    /**
     * {@inheritDoc}
     */

    public String getClaimantRepresentativeAddressLine3 ()
    {
        return ClaimantRepresentativeAddressLine3;
    }

    /**
     * {@inheritDoc}
     */

    public void setClaimantRepresentativeAddressLine3 (final String claimantRepresentativeAddressLine3)
    {
        ClaimantRepresentativeAddressLine3 = claimantRepresentativeAddressLine3;
    }

    /**
     * {@inheritDoc}
     */

    public String getClaimantRepresentativeAddressLine4 ()
    {
        return ClaimantRepresentativeAddressLine4;
    }

    /**
     * {@inheritDoc}
     */

    public void setClaimantRepresentativeAddressLine4 (final String claimantRepresentativeAddressLine4)
    {
        ClaimantRepresentativeAddressLine4 = claimantRepresentativeAddressLine4;
    }

    /**
     * {@inheritDoc}
     */

    public String getClaimantRepresentativeAddressLine5 ()
    {
        return ClaimantRepresentativeAddressLine5;
    }

    /**
     * {@inheritDoc}
     */

    public void setClaimantRepresentativeAddressLine5 (final String claimantRepresentativeAddressLine5)
    {
        ClaimantRepresentativeAddressLine5 = claimantRepresentativeAddressLine5;
    }

    /**
     * {@inheritDoc}
     */

    public String getClaimantRepresentativeCode ()
    {
        return ClaimantRepresentativeCode;
    }

    /**
     * {@inheritDoc}
     */

    public void setClaimantRepresentativeCode (final String claimantRepresentativeCode)
    {
        ClaimantRepresentativeCode = claimantRepresentativeCode;
    }

    /**
     * {@inheritDoc}
     */

    public String getClaimantRepresentativeDX ()
    {
        return ClaimantRepresentativeDX;
    }

    /**
     * {@inheritDoc}
     */

    public void setClaimantRepresentativeDX (final String claimantRepresentativeDX)
    {
        ClaimantRepresentativeDX = claimantRepresentativeDX;
    }

    /**
     * {@inheritDoc}
     */

    public String getClaimantRepresentativeEmailAddress ()
    {
        return ClaimantRepresentativeEmailAddress;
    }

    /**
     * {@inheritDoc}
     */

    public void setClaimantRepresentativeEmailAddress (final String claimantRepresentativeEmailAddress)
    {
        ClaimantRepresentativeEmailAddress = claimantRepresentativeEmailAddress;
    }

    /**
     * {@inheritDoc}
     */

    public String getClaimantRepresentativeFaxNumber ()
    {
        return ClaimantRepresentativeFaxNumber;
    }

    /**
     * {@inheritDoc}
     */

    public void setClaimantRepresentativeFaxNumber (final String claimantRepresentativeFaxNumber)
    {
        ClaimantRepresentativeFaxNumber = claimantRepresentativeFaxNumber;
    }

    /**
     * {@inheritDoc}
     */

    public String getClaimantRepresentativeName ()
    {
        return ClaimantRepresentativeName;
    }

    /**
     * {@inheritDoc}
     */

    public void setClaimantRepresentativeName (final String claimantRepresentativeName)
    {
        ClaimantRepresentativeName = claimantRepresentativeName;
    }

    /**
     * {@inheritDoc}
     */

    public String getClaimantRepresentativeNumber ()
    {
        return ClaimantRepresentativeNumber;
    }

    /**
     * {@inheritDoc}
     */

    public void setClaimantRepresentativeNumber (final String claimantRepresentativeNumber)
    {
        ClaimantRepresentativeNumber = claimantRepresentativeNumber;
    }

    /**
     * {@inheritDoc}
     */

    public String getClaimantRepresentativePartyType ()
    {
        return ClaimantRepresentativePartyType;
    }

    /**
     * {@inheritDoc}
     */

    public void setClaimantRepresentativePartyType (final String claimantRepresentativePartyType)
    {
        ClaimantRepresentativePartyType = claimantRepresentativePartyType;
    }

    /**
     * {@inheritDoc}
     */

    public String getClaimantRepresentativePostCode ()
    {
        return ClaimantRepresentativePostCode;
    }

    /**
     * {@inheritDoc}
     */

    public void setClaimantRepresentativePostCode (final String claimantRepresentativePostCode)
    {
        ClaimantRepresentativePostCode = claimantRepresentativePostCode;
    }

    /**
     * {@inheritDoc}
     */

    public String getClaimantRepresentativeReference ()
    {
        return ClaimantRepresentativeReference;
    }

    /**
     * {@inheritDoc}
     */

    public void setClaimantRepresentativeReference (final String claimantRepresentativeReference)
    {
        ClaimantRepresentativeReference = claimantRepresentativeReference;
    }

    /**
     * {@inheritDoc}
     */

    public String getClaimantRepresentativeTelephoneNumber ()
    {
        return ClaimantRepresentativeTelephoneNumber;
    }

    /**
     * {@inheritDoc}
     */

    public void setClaimantRepresentativeTelephoneNumber (final String claimantRepresentativeTelephoneNumber)
    {
        ClaimantRepresentativeTelephoneNumber = claimantRepresentativeTelephoneNumber;
    }

    /**
     * {@inheritDoc}
     */

    public String getCONumber ()
    {
        return CONumber;
    }

    /**
     * {@inheritDoc}
     */

    public void setCONumber (final String number)
    {
        CONumber = number;
    }

    /**
     * {@inheritDoc}
     */

    public String getCreatedBy ()
    {
        return CreatedBy;
    }

    /**
     * {@inheritDoc}
     */

    public void setCreatedBy (final String createdBy)
    {
        CreatedBy = createdBy;
    }

    /**
     * {@inheritDoc}
     */

    public String getDateRequestReceived ()
    {
        return DateRequestReceived;
    }

    /**
     * {@inheritDoc}
     */

    public void setDateRequestReceived (final String dateRequestReceived)
    {
        DateRequestReceived = dateRequestReceived;
    }

    /**
     * {@inheritDoc}
     */

    public String getDefendant1AddressLine1 ()
    {
        return Defendant1AddressLine1;
    }

    /**
     * {@inheritDoc}
     */

    public void setDefendant1AddressLine1 (final String defendant1AddressLine1)
    {
        Defendant1AddressLine1 = defendant1AddressLine1;
    }

    /**
     * {@inheritDoc}
     */

    public String getDefendant1AddressLine2 ()
    {
        return Defendant1AddressLine2;
    }

    /**
     * {@inheritDoc}
     */

    public void setDefendant1AddressLine2 (final String defendant1AddressLine2)
    {
        Defendant1AddressLine2 = defendant1AddressLine2;
    }

    /**
     * {@inheritDoc}
     */

    public String getDefendant1AddressLine3 ()
    {
        return Defendant1AddressLine3;
    }

    /**
     * {@inheritDoc}
     */

    public void setDefendant1AddressLine3 (final String defendant1AddressLine3)
    {
        Defendant1AddressLine3 = defendant1AddressLine3;
    }

    /**
     * {@inheritDoc}
     */

    public String getDefendant1AddressLine4 ()
    {
        return Defendant1AddressLine4;
    }

    /**
     * {@inheritDoc}
     */

    public void setDefendant1AddressLine4 (final String defendant1AddressLine4)
    {
        Defendant1AddressLine4 = defendant1AddressLine4;
    }

    /**
     * {@inheritDoc}
     */

    public String getDefendant1AddressLine5 ()
    {
        return Defendant1AddressLine5;
    }

    /**
     * {@inheritDoc}
     */

    public void setDefendant1AddressLine5 (final String defendant1AddressLine5)
    {
        Defendant1AddressLine5 = defendant1AddressLine5;
    }

    /**
     * {@inheritDoc}
     */

    public String getDefendant1JudgmentID ()
    {
        return Defendant1JudgmentID;
    }

    /**
     * {@inheritDoc}
     */

    public void setDefendant1JudgmentID (final String defendant1JudgmentID)
    {
        Defendant1JudgmentID = defendant1JudgmentID;
    }

    /**
     * {@inheritDoc}
     */

    public String getDefendant1Name ()
    {
        return Defendant1Name;
    }

    /**
     * {@inheritDoc}
     */

    public void setDefendant1Name (final String defendant1Name)
    {
        Defendant1Name = defendant1Name;
    }

    /**
     * {@inheritDoc}
     */

    public String getDefendant1Number ()
    {
        return Defendant1Number;
    }

    /**
     * {@inheritDoc}
     */

    public void setDefendant1Number (final String defendant1Number)
    {
        Defendant1Number = defendant1Number;
    }

    /**
     * {@inheritDoc}
     */

    public String getDefendant1PartyType ()
    {
        return Defendant1PartyType;
    }

    /**
     * {@inheritDoc}
     */

    public void setDefendant1PartyType (final String defendant1PartyType)
    {
        Defendant1PartyType = defendant1PartyType;
    }

    /**
     * {@inheritDoc}
     */

    public String getDefendant1PostCode ()
    {
        return Defendant1PostCode;
    }

    /**
     * {@inheritDoc}
     */

    public void setDefendant1PostCode (final String defendant1PostCode)
    {
        Defendant1PostCode = defendant1PostCode;
    }

    /**
     * {@inheritDoc}
     */

    public String getDefendant2AddressLine1 ()
    {
        return Defendant2AddressLine1;
    }

    /**
     * {@inheritDoc}
     */

    public void setDefendant2AddressLine1 (final String defendant2AddressLine1)
    {
        Defendant2AddressLine1 = defendant2AddressLine1;
    }

    /**
     * {@inheritDoc}
     */

    public String getDefendant2AddressLine2 ()
    {
        return Defendant2AddressLine2;
    }

    /**
     * {@inheritDoc}
     */

    public void setDefendant2AddressLine2 (final String defendant2AddressLine2)
    {
        Defendant2AddressLine2 = defendant2AddressLine2;
    }

    /**
     * {@inheritDoc}
     */

    public String getDefendant2AddressLine3 ()
    {
        return Defendant2AddressLine3;
    }

    /**
     * {@inheritDoc}
     */

    public void setDefendant2AddressLine3 (final String defendant2AddressLine3)
    {
        Defendant2AddressLine3 = defendant2AddressLine3;
    }

    /**
     * {@inheritDoc}
     */

    public String getDefendant2AddressLine4 ()
    {
        return Defendant2AddressLine4;
    }

    /**
     * {@inheritDoc}
     */

    public void setDefendant2AddressLine4 (final String defendant2AddressLine4)
    {
        Defendant2AddressLine4 = defendant2AddressLine4;
    }

    /**
     * {@inheritDoc}
     */

    public String getDefendant2AddressLine5 ()
    {
        return Defendant2AddressLine5;
    }

    /**
     * {@inheritDoc}
     */

    public void setDefendant2AddressLine5 (final String defendant2AddressLine5)
    {
        Defendant2AddressLine5 = defendant2AddressLine5;
    }

    /**
     * {@inheritDoc}
     */

    public String getDefendant2JudgmentID ()
    {
        return Defendant2JudgmentID;
    }

    /**
     * {@inheritDoc}
     */

    public void setDefendant2JudgmentID (final String defendant2JudgmentID)
    {
        Defendant2JudgmentID = defendant2JudgmentID;
    }

    /**
     * {@inheritDoc}
     */

    public String getDefendant2Name ()
    {
        return Defendant2Name;
    }

    /**
     * {@inheritDoc}
     */

    public void setDefendant2Name (final String defendant2Name)
    {
        Defendant2Name = defendant2Name;
    }

    /**
     * {@inheritDoc}
     */

    public String getDefendant2Number ()
    {
        return Defendant2Number;
    }

    /**
     * {@inheritDoc}
     */

    public void setDefendant2Number (final String defendant2Number)
    {
        Defendant2Number = defendant2Number;
    }

    /**
     * {@inheritDoc}
     */

    public String getDefendant2PartyType ()
    {
        return Defendant2PartyType;
    }

    /**
     * {@inheritDoc}
     */

    public void setDefendant2PartyType (final String defendant2PartyType)
    {
        Defendant2PartyType = defendant2PartyType;
    }

    /**
     * {@inheritDoc}
     */

    public String getDefendant2PostCode ()
    {
        return Defendant2PostCode;
    }

    /**
     * {@inheritDoc}
     */

    public void setDefendant2PostCode (final String defendant2PostCode)
    {
        Defendant2PostCode = defendant2PostCode;
    }

    /**
     * {@inheritDoc}
     */

    public String getExecutingCourtCode ()
    {
        return ExecutingCourtCode;
    }

    /**
     * {@inheritDoc}
     */

    public void setExecutingCourtCode (final String executingCourtCode)
    {
        ExecutingCourtCode = executingCourtCode;
    }

    /**
     * {@inheritDoc}
     */

    public String getFee ()
    {
        return Fee;
    }

    /**
     * {@inheritDoc}
     */

    public void setFee (final String fee)
    {
        Fee = fee;
    }

    /**
     * {@inheritDoc}
     */

    public String getFeeCurrency ()
    {
        return FeeCurrency;
    }

    /**
     * {@inheritDoc}
     */

    public void setFeeCurrency (final String feeCurrency)
    {
        FeeCurrency = feeCurrency;
    }

    /**
     * {@inheritDoc}
     */

    public String getHomeCourtIssueDate ()
    {
        return HomeCourtIssueDate;
    }

    /**
     * {@inheritDoc}
     */

    public void setHomeCourtIssueDate (final String homeCourtIssueDate)
    {
        HomeCourtIssueDate = homeCourtIssueDate;
    }

    /**
     * {@inheritDoc}
     */

    public String getIssueDate ()
    {
        return IssueDate;
    }

    /**
     * {@inheritDoc}
     */

    public void setIssueDate (final String issueDate)
    {
        IssueDate = issueDate;
    }

    /**
     * {@inheritDoc}
     */

    public String getIssuedBy ()
    {
        return IssuedBy;
    }

    /**
     * {@inheritDoc}
     */

    public void setIssuedBy (final String issuedBy)
    {
        IssuedBy = issuedBy;
    }

    /**
     * {@inheritDoc}
     */

    public String getLandRegistryFee ()
    {
        return LandRegistryFee;
    }

    /**
     * {@inheritDoc}
     */

    public void setLandRegistryFee (final String landRegistryFee)
    {
        LandRegistryFee = landRegistryFee;
    }

    /**
     * {@inheritDoc}
     */

    public String getLandRegistryFeeCurrency ()
    {
        return LandRegistryFeeCurrency;
    }

    /**
     * {@inheritDoc}
     */

    public void setLandRegistryFeeCurrency (final String landRegistryFeeCurrency)
    {
        LandRegistryFeeCurrency = landRegistryFeeCurrency;
    }

    /**
     * {@inheritDoc}
     */

    public String getLocalNumber ()
    {
        return LocalNumber;
    }

    /**
     * {@inheritDoc}
     */

    public void setLocalNumber (final String localNumber)
    {
        LocalNumber = localNumber;
    }

    /**
     * {@inheritDoc}
     */

    public String getOriginalWarrantNumber ()
    {
        return OriginalWarrantNumber;
    }

    /**
     * {@inheritDoc}
     */

    public void setOriginalWarrantNumber (final String originalWarrantNumber)
    {
        OriginalWarrantNumber = originalWarrantNumber;
    }

    /**
     * {@inheritDoc}
     */

    public String getOwnedBy ()
    {
        return OwnedBy;
    }

    /**
     * {@inheritDoc}
     */

    public void setOwnedBy (final String ownedBy)
    {
        OwnedBy = ownedBy;
    }

    /**
     * {@inheritDoc}
     */

    public String getSolicitorsCosts ()
    {
        return SolicitorsCosts;
    }

    /**
     * {@inheritDoc}
     */

    public void setSolicitorsCosts (final String solicitorsCosts)
    {
        SolicitorsCosts = solicitorsCosts;
    }

    /**
     * {@inheritDoc}
     */

    public String getSolicitorsCostsCurrency ()
    {
        return SolicitorsCostsCurrency;
    }

    /**
     * {@inheritDoc}
     */

    public void setSolicitorsCostsCurrency (final String solicitorsCostsCurrency)
    {
        SolicitorsCostsCurrency = solicitorsCostsCurrency;
    }

    /**
     * {@inheritDoc}
     */

    public String getToTransfer ()
    {
        return ToTransfer;
    }

    /**
     * {@inheritDoc}
     */

    public void setToTransfer (final String toTransfer)
    {
        ToTransfer = toTransfer;
    }

    /**
     * {@inheritDoc}
     */

    public String getTransferDate ()
    {
        return TransferDate;
    }

    /**
     * {@inheritDoc}
     */

    public void setTransferDate (final String transferDate)
    {
        TransferDate = transferDate;
    }

    /**
     * {@inheritDoc}
     */

    public String getWarrantID ()
    {
        return WarrantID;
    }

    /**
     * {@inheritDoc}
     */

    public void setWarrantID (final String warrantID)
    {
        WarrantID = warrantID;
    }

    /**
     * {@inheritDoc}
     */

    public String getWarrantNumber ()
    {
        return WarrantNumber;
    }

    /**
     * {@inheritDoc}
     */

    public void setWarrantNumber (final String warrantNumber)
    {
        WarrantNumber = warrantNumber;
    }

    /**
     * {@inheritDoc}
     */

    public String getWarrantType ()
    {
        return WarrantType;
    }

    /**
     * {@inheritDoc}
     */

    public void setWarrantType (final String warrantType)
    {
        WarrantType = warrantType;
    }
} // class WarrantMapDO
