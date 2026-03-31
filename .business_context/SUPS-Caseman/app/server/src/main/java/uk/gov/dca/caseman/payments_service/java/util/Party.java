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
package uk.gov.dca.caseman.payments_service.java.util;

import java.util.ArrayList;
import java.util.List;

/**
 * The Class Party.
 *
 * @author Steve Blair
 */
public class Party
{

    /** The name. */
    private String name;
    
    /** The party role code. */
    private String partyRoleCode = "";
    
    /** The case party number. */
    private String casePartyNumber = "";
    
    /** The coded party code. */
    private String codedPartyCode = "";
    
    /** The dx number. */
    private String dxNumber = "";
    
    /** The party id. */
    private String partyId = "";
    
    /** The address. */
    private Address address = new Address ();

    /**
     * Instantiates a new party.
     *
     * @param name the name
     */
    public Party (final String name)
    {
        this.name = name;
    }

    /**
     * Gets the name.
     *
     * @return the name
     */
    public String getName ()
    {
        return name;
    }

    /**
     * Sets the name.
     *
     * @param name the new name
     */
    public void setName (final String name)
    {
        this.name = name;
    }

    /**
     * Gets the party role code.
     *
     * @return the party role code
     */
    public String getPartyRoleCode ()
    {
        return partyRoleCode;
    }

    /**
     * Sets the party role code.
     *
     * @param partyRoleCode the new party role code
     */
    public void setPartyRoleCode (final String partyRoleCode)
    {
        this.partyRoleCode = partyRoleCode;
    }

    /**
     * Gets the case party number.
     *
     * @return the case party number
     */
    public String getCasePartyNumber ()
    {
        return casePartyNumber;
    }

    /**
     * Sets the case party number.
     *
     * @param casePartyNumber the new case party number
     */
    public void setCasePartyNumber (final String casePartyNumber)
    {
        this.casePartyNumber = casePartyNumber;
    }

    /**
     * Gets the address line.
     *
     * @param lineNumber the line number
     * @return the address line
     */
    public String getAddressLine (final int lineNumber)
    {
        return address.getAddressLine (lineNumber);
    }

    /**
     * Sets the address line.
     *
     * @param lineNumber the line number
     * @param addressLine the address line
     */
    public void setAddressLine (final int lineNumber, final String addressLine)
    {
        address.updateAddressLine (lineNumber, addressLine);
    }

    /**
     * Gets the address post code.
     *
     * @return the address post code
     */
    public String getAddressPostCode ()
    {
        return address.getPostCode ();
    }

    /**
     * Sets the address post code.
     *
     * @param postCode the new address post code
     */
    public void setAddressPostCode (final String postCode)
    {
        address.setPostCode (postCode);
    }

    /**
     * Gets the address reference.
     *
     * @return the address reference
     */
    public String getAddressReference ()
    {
        return address.getReference ();
    }

    /**
     * Sets the address reference.
     *
     * @param reference the new address reference
     */
    public void setAddressReference (final String reference)
    {
        address.setReference (reference);
    }

    /**
     * Gets the number allowed address lines.
     *
     * @return the number allowed address lines
     */
    public int getNumberAllowedAddressLines ()
    {
        return address.getNumberAllowedAddressLines ();
    }

    /**
     * Sets the coded party code.
     *
     * @param codedPartyCode the new coded party code
     */
    public void setCodedPartyCode (final String codedPartyCode)
    {
        this.codedPartyCode = codedPartyCode;
    }

    /**
     * Gets the coded party code.
     *
     * @return the coded party code
     */
    public String getCodedPartyCode ()
    {
        return codedPartyCode;
    }

    /**
     * Sets the dx number.
     *
     * @param dxNumber the new dx number
     */
    public void setDxNumber (final String dxNumber)
    {
        this.dxNumber = dxNumber;
    }

    /**
     * Gets the dx number.
     *
     * @return the dx number
     */
    public String getDxNumber ()
    {
        return dxNumber;
    }

    /**
     * Sets the party id.
     *
     * @param partyId the new party id
     */
    public void setPartyId (final String partyId)
    {
        this.partyId = partyId;
    }

    /**
     * Gets the party id.
     *
     * @return the party id
     */
    public String getPartyId ()
    {
        return partyId;
    }

}

/**
 * The Class Address.
 */
class Address
{

    private static final int NUMBER_ADDRESS_LINES = 5;

    private String postCode = "";

    private String reference = "";

    private List<String> address = new ArrayList<> (NUMBER_ADDRESS_LINES);

    /**
     * Constructor.
     */
    public Address ()
    {
        for (int i = 0; i < NUMBER_ADDRESS_LINES; ++i)
        {
            address.add ("");
        }
    }

    /**
     * Get address.
     * 
     * @param lineNumber the line number.
     * @return the line in the address.
     */
    public String getAddressLine (final int lineNumber)
    {
        final String line = (String) address.get (lineNumber);

        if (line == null)
        {
            return "";
        }

        return line;
    }

    /**
     * Update address line.
     * 
     * @param lineNumber the line to update.
     * @param addressLine the undated address line.
     */
    public void updateAddressLine (final int lineNumber, final String addressLine)
    {
        address.set (lineNumber, addressLine);
    }

    /**
     * Get the postcode.
     * 
     * @return the postcode.
     */
    public String getPostCode ()
    {
        return postCode;
    }

    /**
     * Set the postcode.
     * 
     * @param postCode the new postcode.
     */
    public void setPostCode (final String postCode)
    {
        this.postCode = postCode;
    }

    /**
     * Get the reference.
     * 
     * @return the reference.
     */
    public String getReference ()
    {
        return reference;
    }

    /**
     * Set the reference.
     * 
     * @param reference the new reference.
     */
    public void setReference (final String reference)
    {
        this.reference = reference;
    }

    /**
     * Get the number of allowed addres lines.
     * 
     * @return number of allowed address lines.
     */
    public int getNumberAllowedAddressLines ()
    {
        return NUMBER_ADDRESS_LINES;
    }

}