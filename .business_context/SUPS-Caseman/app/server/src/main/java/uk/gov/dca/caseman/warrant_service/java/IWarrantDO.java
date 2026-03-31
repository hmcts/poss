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
 * Created on 21-Oct-2005.
 *
 * @author gzyysf
 */
public interface IWarrantDO
{
    
    /**
     * Gets the additional notes.
     *
     * @return the additional notes
     */
    public abstract String getAdditionalNotes ();

    /**
     * Sets the additional notes.
     *
     * @param additionalNotes the new additional notes
     */
    public abstract void setAdditionalNotes (String additionalNotes);

    /**
     * Gets the amount of warrant.
     *
     * @return the amount of warrant
     */
    public abstract String getAmountOfWarrant ();

    /**
     * Sets the amount of warrant.
     *
     * @param amountOfWarrant the new amount of warrant
     */
    public abstract void setAmountOfWarrant (String amountOfWarrant);

    /**
     * Gets the amount of warrant currency.
     *
     * @return the amount of warrant currency
     */
    public abstract String getAmountOfWarrantCurrency ();

    /**
     * Sets the amount of warrant currency.
     *
     * @param amountOfWarrantCurrency the new amount of warrant currency
     */
    public abstract void setAmountOfWarrantCurrency (String amountOfWarrantCurrency);

    /**
     * Gets the bailiff area no.
     *
     * @return the bailiff area no
     */
    public abstract String getBailiffAreaNo ();

    /**
     * Sets the bailiff area no.
     *
     * @param bailiffAreaNo the new bailiff area no
     */
    public abstract void setBailiffAreaNo (String bailiffAreaNo);

    /**
     * Gets the balance after paid.
     *
     * @return the balance after paid
     */
    public abstract String getBalanceAfterPaid ();

    /**
     * Sets the balance after paid.
     *
     * @param balanceAfterPaid the new balance after paid
     */
    public abstract void setBalanceAfterPaid (String balanceAfterPaid);

    /**
     * Gets the balance after paid currency.
     *
     * @return the balance after paid currency
     */
    public abstract String getBalanceAfterPaidCurrency ();

    /**
     * Sets the balance after paid currency.
     *
     * @param balanceAfterPaidCurrency the new balance after paid currency
     */
    public abstract void setBalanceAfterPaidCurrency (String balanceAfterPaidCurrency);

    /**
     * Gets the balance of debt currency.
     *
     * @return the balance of debt currency
     */
    public abstract String getBalanceOfDebtCurrency ();

    /**
     * Sets the balance of debt currency.
     *
     * @param balanceOfDebtCurrency the new balance of debt currency
     */
    public abstract void setBalanceOfDebtCurrency (String balanceOfDebtCurrency);

    /**
     * Gets the balance of debt.
     *
     * @return the balance of debt
     */
    public abstract String getBalanceOfDebt ();

    /**
     * Sets the balance of debt.
     *
     * @param balanceOfDebt the new balance of debt
     */
    public abstract void setBalanceOfDebt (String balanceOfDebt);

    /**
     * Gets the case event seq.
     *
     * @return the case event seq
     */
    public abstract String getCaseEventSeq ();

    /**
     * Sets the case event seq.
     *
     * @param caseEventSeq the new case event seq
     */
    public abstract void setCaseEventSeq (String caseEventSeq);

    /**
     * Gets the case number.
     *
     * @return the case number
     */
    public abstract String getCaseNumber ();

    /**
     * Sets the case number.
     *
     * @param caseNumber the new case number
     */
    public abstract void setCaseNumber (String caseNumber);

    /**
     * Gets the CCBC warrant.
     *
     * @return the CCBC warrant
     */
    public abstract String getCCBCWarrant ();

    /**
     * Sets the CCBC warrant.
     *
     * @param warrant the new CCBC warrant
     */
    public abstract void setCCBCWarrant (String warrant);

    /**
     * Gets the claimant code.
     *
     * @return the claimant code
     */
    public abstract String getClaimantCode ();

    /**
     * Sets the claimant code.
     *
     * @param claimantCode the new claimant code
     */
    public abstract void setClaimantCode (String claimantCode);

    /**
     * Gets the claimant name.
     *
     * @return the claimant name
     */
    public abstract String getClaimantName ();

    /**
     * Sets the claimant name.
     *
     * @param claimantName the new claimant name
     */
    public abstract void setClaimantName (String claimantName);

    /**
     * Gets the claimant representative.
     *
     * @return the claimant representative
     */
    public abstract String getClaimantRepresentative ();

    /**
     * Sets the claimant representative.
     *
     * @param claimantRepresentative the new claimant representative
     */
    public abstract void setClaimantRepresentative (String claimantRepresentative);

    /**
     * Gets the claimant representative address line 1.
     *
     * @return the claimant representative address line 1
     */
    public abstract String getClaimantRepresentativeAddressLine1 ();

    /**
     * Sets the claimant representative address line 1.
     *
     * @param claimantRepresentativeAddressLine1 the new claimant representative address line 1
     */
    public abstract void setClaimantRepresentativeAddressLine1 (String claimantRepresentativeAddressLine1);

    /**
     * Gets the claimant representative address line 2.
     *
     * @return the claimant representative address line 2
     */
    public abstract String getClaimantRepresentativeAddressLine2 ();

    /**
     * Sets the claimant representative address line 2.
     *
     * @param claimantRepresentativeAddressLine2 the new claimant representative address line 2
     */
    public abstract void setClaimantRepresentativeAddressLine2 (String claimantRepresentativeAddressLine2);

    /**
     * Gets the claimant representative address line 3.
     *
     * @return the claimant representative address line 3
     */
    public abstract String getClaimantRepresentativeAddressLine3 ();

    /**
     * Sets the claimant representative address line 3.
     *
     * @param claimantRepresentativeAddressLine3 the new claimant representative address line 3
     */
    public abstract void setClaimantRepresentativeAddressLine3 (String claimantRepresentativeAddressLine3);

    /**
     * Gets the claimant representative address line 4.
     *
     * @return the claimant representative address line 4
     */
    public abstract String getClaimantRepresentativeAddressLine4 ();

    /**
     * Sets the claimant representative address line 4.
     *
     * @param claimantRepresentativeAddressLine4 the new claimant representative address line 4
     */
    public abstract void setClaimantRepresentativeAddressLine4 (String claimantRepresentativeAddressLine4);

    /**
     * Gets the claimant representative address line 5.
     *
     * @return the claimant representative address line 5
     */
    public abstract String getClaimantRepresentativeAddressLine5 ();

    /**
     * Sets the claimant representative address line 5.
     *
     * @param claimantRepresentativeAddressLine5 the new claimant representative address line 5
     */
    public abstract void setClaimantRepresentativeAddressLine5 (String claimantRepresentativeAddressLine5);

    /**
     * Gets the claimant representative code.
     *
     * @return the claimant representative code
     */
    public abstract String getClaimantRepresentativeCode ();

    /**
     * Sets the claimant representative code.
     *
     * @param claimantRepresentativeCode the new claimant representative code
     */
    public abstract void setClaimantRepresentativeCode (String claimantRepresentativeCode);

    /**
     * Gets the claimant representative DX.
     *
     * @return the claimant representative DX
     */
    public abstract String getClaimantRepresentativeDX ();

    /**
     * Sets the claimant representative DX.
     *
     * @param claimantRepresentativeDX the new claimant representative DX
     */
    public abstract void setClaimantRepresentativeDX (String claimantRepresentativeDX);

    /**
     * Gets the claimant representative email address.
     *
     * @return the claimant representative email address
     */
    public abstract String getClaimantRepresentativeEmailAddress ();

    /**
     * Sets the claimant representative email address.
     *
     * @param claimantRepresentativeEmailAddress the new claimant representative email address
     */
    public abstract void setClaimantRepresentativeEmailAddress (String claimantRepresentativeEmailAddress);

    /**
     * Gets the claimant representative fax number.
     *
     * @return the claimant representative fax number
     */
    public abstract String getClaimantRepresentativeFaxNumber ();

    /**
     * Sets the claimant representative fax number.
     *
     * @param claimantRepresentativeFaxNumber the new claimant representative fax number
     */
    public abstract void setClaimantRepresentativeFaxNumber (String claimantRepresentativeFaxNumber);

    /**
     * Gets the claimant representative name.
     *
     * @return the claimant representative name
     */
    public abstract String getClaimantRepresentativeName ();

    /**
     * Sets the claimant representative name.
     *
     * @param claimantRepresentativeName the new claimant representative name
     */
    public abstract void setClaimantRepresentativeName (String claimantRepresentativeName);

    /**
     * Gets the claimant representative number.
     *
     * @return the claimant representative number
     */
    public abstract String getClaimantRepresentativeNumber ();

    /**
     * Sets the claimant representative number.
     *
     * @param claimantRepresentativeNumber the new claimant representative number
     */
    public abstract void setClaimantRepresentativeNumber (String claimantRepresentativeNumber);

    /**
     * Gets the claimant representative party type.
     *
     * @return the claimant representative party type
     */
    public abstract String getClaimantRepresentativePartyType ();

    /**
     * Sets the claimant representative party type.
     *
     * @param claimantRepresentativePartyType the new claimant representative party type
     */
    public abstract void setClaimantRepresentativePartyType (String claimantRepresentativePartyType);

    /**
     * Gets the claimant representative post code.
     *
     * @return the claimant representative post code
     */
    public abstract String getClaimantRepresentativePostCode ();

    /**
     * Sets the claimant representative post code.
     *
     * @param claimantRepresentativePostCode the new claimant representative post code
     */
    public abstract void setClaimantRepresentativePostCode (String claimantRepresentativePostCode);

    /**
     * Gets the claimant representative reference.
     *
     * @return the claimant representative reference
     */
    public abstract String getClaimantRepresentativeReference ();

    /**
     * Sets the claimant representative reference.
     *
     * @param claimantRepresentativeReference the new claimant representative reference
     */
    public abstract void setClaimantRepresentativeReference (String claimantRepresentativeReference);

    /**
     * Gets the claimant representative telephone number.
     *
     * @return the claimant representative telephone number
     */
    public abstract String getClaimantRepresentativeTelephoneNumber ();

    /**
     * Sets the claimant representative telephone number.
     *
     * @param claimantRepresentativeTelephoneNumber the new claimant representative telephone number
     */
    public abstract void setClaimantRepresentativeTelephoneNumber (String claimantRepresentativeTelephoneNumber);

    /**
     * Gets the CO number.
     *
     * @return the CO number
     */
    public abstract String getCONumber ();

    /**
     * Sets the CO number.
     *
     * @param number the new CO number
     */
    public abstract void setCONumber (String number);

    /**
     * Gets the created by.
     *
     * @return the created by
     */
    public abstract String getCreatedBy ();

    /**
     * Sets the created by.
     *
     * @param createdBy the new created by
     */
    public abstract void setCreatedBy (String createdBy);

    /**
     * Gets the date request received.
     *
     * @return the date request received
     */
    public abstract String getDateRequestReceived ();

    /**
     * Sets the date request received.
     *
     * @param dateRequestReceived the new date request received
     */
    public abstract void setDateRequestReceived (String dateRequestReceived);

    /**
     * Gets the defendant 1 address line 1.
     *
     * @return the defendant 1 address line 1
     */
    public abstract String getDefendant1AddressLine1 ();

    /**
     * Sets the defendant 1 address line 1.
     *
     * @param defendant1AddressLine1 the new defendant 1 address line 1
     */
    public abstract void setDefendant1AddressLine1 (String defendant1AddressLine1);

    /**
     * Gets the defendant 1 address line 2.
     *
     * @return the defendant 1 address line 2
     */
    public abstract String getDefendant1AddressLine2 ();

    /**
     * Sets the defendant 1 address line 2.
     *
     * @param defendant1AddressLine2 the new defendant 1 address line 2
     */
    public abstract void setDefendant1AddressLine2 (String defendant1AddressLine2);

    /**
     * Gets the defendant 1 address line 3.
     *
     * @return the defendant 1 address line 3
     */
    public abstract String getDefendant1AddressLine3 ();

    /**
     * Sets the defendant 1 address line 3.
     *
     * @param defendant1AddressLine3 the new defendant 1 address line 3
     */
    public abstract void setDefendant1AddressLine3 (String defendant1AddressLine3);

    /**
     * Gets the defendant 1 address line 4.
     *
     * @return the defendant 1 address line 4
     */
    public abstract String getDefendant1AddressLine4 ();

    /**
     * Sets the defendant 1 address line 4.
     *
     * @param defendant1AddressLine4 the new defendant 1 address line 4
     */
    public abstract void setDefendant1AddressLine4 (String defendant1AddressLine4);

    /**
     * Gets the defendant 1 address line 5.
     *
     * @return the defendant 1 address line 5
     */
    public abstract String getDefendant1AddressLine5 ();

    /**
     * Sets the defendant 1 address line 5.
     *
     * @param defendant1AddressLine5 the new defendant 1 address line 5
     */
    public abstract void setDefendant1AddressLine5 (String defendant1AddressLine5);

    /**
     * Gets the defendant 1 judgment ID.
     *
     * @return the defendant 1 judgment ID
     */
    public abstract String getDefendant1JudgmentID ();

    /**
     * Sets the defendant 1 judgment ID.
     *
     * @param defendant1JudgmentID the new defendant 1 judgment ID
     */
    public abstract void setDefendant1JudgmentID (String defendant1JudgmentID);

    /**
     * Gets the defendant 1 name.
     *
     * @return the defendant 1 name
     */
    public abstract String getDefendant1Name ();

    /**
     * Sets the defendant 1 name.
     *
     * @param defendant1Name the new defendant 1 name
     */
    public abstract void setDefendant1Name (String defendant1Name);

    /**
     * Gets the defendant 1 number.
     *
     * @return the defendant 1 number
     */
    public abstract String getDefendant1Number ();

    /**
     * Sets the defendant 1 number.
     *
     * @param defendant1Number the new defendant 1 number
     */
    public abstract void setDefendant1Number (String defendant1Number);

    /**
     * Gets the defendant 1 party type.
     *
     * @return the defendant 1 party type
     */
    public abstract String getDefendant1PartyType ();

    /**
     * Sets the defendant 1 party type.
     *
     * @param defendant1PartyType the new defendant 1 party type
     */
    public abstract void setDefendant1PartyType (String defendant1PartyType);

    /**
     * Gets the defendant 1 post code.
     *
     * @return the defendant 1 post code
     */
    public abstract String getDefendant1PostCode ();

    /**
     * Sets the defendant 1 post code.
     *
     * @param defendant1PostCode the new defendant 1 post code
     */
    public abstract void setDefendant1PostCode (String defendant1PostCode);

    /**
     * Gets the defendant 2 address line 1.
     *
     * @return the defendant 2 address line 1
     */
    public abstract String getDefendant2AddressLine1 ();

    /**
     * Sets the defendant 2 address line 1.
     *
     * @param defendant2AddressLine1 the new defendant 2 address line 1
     */
    public abstract void setDefendant2AddressLine1 (String defendant2AddressLine1);

    /**
     * Gets the defendant 2 address line 2.
     *
     * @return the defendant 2 address line 2
     */
    public abstract String getDefendant2AddressLine2 ();

    /**
     * Sets the defendant 2 address line 2.
     *
     * @param defendant2AddressLine2 the new defendant 2 address line 2
     */
    public abstract void setDefendant2AddressLine2 (String defendant2AddressLine2);

    /**
     * Gets the defendant 2 address line 3.
     *
     * @return the defendant 2 address line 3
     */
    public abstract String getDefendant2AddressLine3 ();

    /**
     * Sets the defendant 2 address line 3.
     *
     * @param defendant2AddressLine3 the new defendant 2 address line 3
     */
    public abstract void setDefendant2AddressLine3 (String defendant2AddressLine3);

    /**
     * Gets the defendant 2 address line 4.
     *
     * @return the defendant 2 address line 4
     */
    public abstract String getDefendant2AddressLine4 ();

    /**
     * Sets the defendant 2 address line 4.
     *
     * @param defendant2AddressLine4 the new defendant 2 address line 4
     */
    public abstract void setDefendant2AddressLine4 (String defendant2AddressLine4);

    /**
     * Gets the defendant 2 address line 5.
     *
     * @return the defendant 2 address line 5
     */
    public abstract String getDefendant2AddressLine5 ();

    /**
     * Sets the defendant 2 address line 5.
     *
     * @param defendant2AddressLine5 the new defendant 2 address line 5
     */
    public abstract void setDefendant2AddressLine5 (String defendant2AddressLine5);

    /**
     * Gets the defendant 2 judgment ID.
     *
     * @return the defendant 2 judgment ID
     */
    public abstract String getDefendant2JudgmentID ();

    /**
     * Sets the defendant 2 judgment ID.
     *
     * @param defendant2JudgmentID the new defendant 2 judgment ID
     */
    public abstract void setDefendant2JudgmentID (String defendant2JudgmentID);

    /**
     * Gets the defendant 2 name.
     *
     * @return the defendant 2 name
     */
    public abstract String getDefendant2Name ();

    /**
     * Sets the defendant 2 name.
     *
     * @param defendant2Name the new defendant 2 name
     */
    public abstract void setDefendant2Name (String defendant2Name);

    /**
     * Gets the defendant 2 number.
     *
     * @return the defendant 2 number
     */
    public abstract String getDefendant2Number ();

    /**
     * Sets the defendant 2 number.
     *
     * @param defendant2Number the new defendant 2 number
     */
    public abstract void setDefendant2Number (String defendant2Number);

    /**
     * Gets the defendant 2 party type.
     *
     * @return the defendant 2 party type
     */
    public abstract String getDefendant2PartyType ();

    /**
     * Sets the defendant 2 party type.
     *
     * @param defendant2PartyType the new defendant 2 party type
     */
    public abstract void setDefendant2PartyType (String defendant2PartyType);

    /**
     * Gets the defendant 2 post code.
     *
     * @return the defendant 2 post code
     */
    public abstract String getDefendant2PostCode ();

    /**
     * Sets the defendant 2 post code.
     *
     * @param defendant2PostCode the new defendant 2 post code
     */
    public abstract void setDefendant2PostCode (String defendant2PostCode);

    /**
     * Gets the executing court code.
     *
     * @return the executing court code
     */
    public abstract String getExecutingCourtCode ();

    /**
     * Sets the executing court code.
     *
     * @param executingCourtCode the new executing court code
     */
    public abstract void setExecutingCourtCode (String executingCourtCode);

    /**
     * Gets the fee.
     *
     * @return the fee
     */
    public abstract String getFee ();

    /**
     * Sets the fee.
     *
     * @param fee the new fee
     */
    public abstract void setFee (String fee);

    /**
     * Gets the fee currency.
     *
     * @return the fee currency
     */
    public abstract String getFeeCurrency ();

    /**
     * Sets the fee currency.
     *
     * @param feeCurrency the new fee currency
     */
    public abstract void setFeeCurrency (String feeCurrency);

    /**
     * Gets the home court issue date.
     *
     * @return the home court issue date
     */
    public abstract String getHomeCourtIssueDate ();

    /**
     * Sets the home court issue date.
     *
     * @param homeCourtIssueDate the new home court issue date
     */
    public abstract void setHomeCourtIssueDate (String homeCourtIssueDate);

    /**
     * Gets the issue date.
     *
     * @return the issue date
     */
    public abstract String getIssueDate ();

    /**
     * Sets the issue date.
     *
     * @param issueDate the new issue date
     */
    public abstract void setIssueDate (String issueDate);

    /**
     * Gets the issued by.
     *
     * @return the issued by
     */
    public abstract String getIssuedBy ();

    /**
     * Sets the issued by.
     *
     * @param issuedBy the new issued by
     */
    public abstract void setIssuedBy (String issuedBy);

    /**
     * Gets the land registry fee.
     *
     * @return the land registry fee
     */
    public abstract String getLandRegistryFee ();

    /**
     * Sets the land registry fee.
     *
     * @param landRegistryFee the new land registry fee
     */
    public abstract void setLandRegistryFee (String landRegistryFee);

    /**
     * Gets the land registry fee currency.
     *
     * @return the land registry fee currency
     */
    public abstract String getLandRegistryFeeCurrency ();

    /**
     * Sets the land registry fee currency.
     *
     * @param landRegistryFeeCurrency the new land registry fee currency
     */
    public abstract void setLandRegistryFeeCurrency (String landRegistryFeeCurrency);

    /**
     * Gets the local number.
     *
     * @return the local number
     */
    public abstract String getLocalNumber ();

    /**
     * Sets the local number.
     *
     * @param localNumber the new local number
     */
    public abstract void setLocalNumber (String localNumber);

    /**
     * Gets the original warrant number.
     *
     * @return the original warrant number
     */
    public abstract String getOriginalWarrantNumber ();

    /**
     * Sets the original warrant number.
     *
     * @param originalWarrantNumber the new original warrant number
     */
    public abstract void setOriginalWarrantNumber (String originalWarrantNumber);

    /**
     * Gets the owned by.
     *
     * @return the owned by
     */
    public abstract String getOwnedBy ();

    /**
     * Sets the owned by.
     *
     * @param ownedBy the new owned by
     */
    public abstract void setOwnedBy (String ownedBy);

    /**
     * Gets the solicitors costs.
     *
     * @return the solicitors costs
     */
    public abstract String getSolicitorsCosts ();

    /**
     * Sets the solicitors costs.
     *
     * @param solicitorsCosts the new solicitors costs
     */
    public abstract void setSolicitorsCosts (String solicitorsCosts);

    /**
     * Gets the solicitors costs currency.
     *
     * @return the solicitors costs currency
     */
    public abstract String getSolicitorsCostsCurrency ();

    /**
     * Sets the solicitors costs currency.
     *
     * @param solicitorsCostsCurrency the new solicitors costs currency
     */
    public abstract void setSolicitorsCostsCurrency (String solicitorsCostsCurrency);

    /**
     * Gets the to transfer.
     *
     * @return the to transfer
     */
    public abstract String getToTransfer ();

    /**
     * Sets the to transfer.
     *
     * @param toTransfer the new to transfer
     */
    public abstract void setToTransfer (String toTransfer);

    /**
     * Gets the transfer date.
     *
     * @return the transfer date
     */
    public abstract String getTransferDate ();

    /**
     * Sets the transfer date.
     *
     * @param transferDate the new transfer date
     */
    public abstract void setTransferDate (String transferDate);

    /**
     * Gets the warrant ID.
     *
     * @return the warrant ID
     */
    public abstract String getWarrantID ();

    /**
     * Sets the warrant ID.
     *
     * @param warrantID the new warrant ID
     */
    public abstract void setWarrantID (String warrantID);

    /**
     * Gets the warrant number.
     *
     * @return the warrant number
     */
    public abstract String getWarrantNumber ();

    /**
     * Sets the warrant number.
     *
     * @param warrantNumber the new warrant number
     */
    public abstract void setWarrantNumber (String warrantNumber);

    /**
     * Gets the warrant type.
     *
     * @return the warrant type
     */
    public abstract String getWarrantType ();

    /**
     * Sets the warrant type.
     *
     * @param warrantType the new warrant type
     */
    public abstract void setWarrantType (String warrantType);
}