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

/**
 * Created on 27-Oct-2005.
 *
 * @author Anoop Sehdev
 */
public class HearingDO
{

    /** The court code. */
    private String courtCode = null;
    
    /** The court user. */
    private String courtUser = null;
    
    /** The venue. */
    private String venue = null;
    
    /** The hrg type. */
    private String hrgType = null;
    
    /** The hrg date. */
    private String hrgDate = null;
    
    /** The hrg time. */
    private String hrgTime = null;
    
    /** The address ID. */
    private String addressID;
    
    /** The case number. */
    private String caseNumber = null;
    
    /** The co number. */
    private String coNumber = null;

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

    /** The date of receipt. */
    private String dateOfReceipt = null;

    /**
     * Gets the address ID.
     *
     * @return the address ID
     */
    public String getAddressID ()
    {
        return addressID;
    }

    /**
     * Sets the address ID.
     *
     * @param addressID the new address ID
     */
    public void setAddressID (final String addressID)
    {
        this.addressID = addressID;
    }

    /**
     * Gets the case number.
     *
     * @return the case number
     */
    public String getCaseNumber ()
    {
        return caseNumber;
    }

    /**
     * Sets the case number.
     *
     * @param caseNumber the new case number
     */
    public void setCaseNumber (final String caseNumber)
    {
        this.caseNumber = caseNumber;
    }

    /**
     * Gets the court code.
     *
     * @return the court code
     */
    public String getCourtCode ()
    {
        return courtCode;
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
     * Gets the court user.
     *
     * @return the court user
     */
    public String getCourtUser ()
    {
        return courtUser;
    }

    /**
     * Sets the court user.
     *
     * @param courtUser the new court user
     */
    public void setCourtUser (final String courtUser)
    {
        this.courtUser = courtUser;
    }

    /**
     * Gets the hrg date.
     *
     * @return the hrg date
     */
    public String getHrgDate ()
    {
        return hrgDate;
    }

    /**
     * Sets the hrg date.
     *
     * @param hrgDate the new hrg date
     */
    public void setHrgDate (final String hrgDate)
    {
        this.hrgDate = hrgDate;
    }

    /**
     * Gets the hrg time.
     *
     * @return the hrg time
     */
    public String getHrgTime ()
    {
        return hrgTime;
    }

    /**
     * Sets the hrg time.
     *
     * @param hrgTime the new hrg time
     */
    public void setHrgTime (final String hrgTime)
    {
        this.hrgTime = hrgTime;
    }

    /**
     * Gets the hrg type.
     *
     * @return the hrg type
     */
    public String getHrgType ()
    {
        return hrgType;
    }

    /**
     * Sets the hrg type.
     *
     * @param hrgType the new hrg type
     */
    public void setHrgType (final String hrgType)
    {
        this.hrgType = hrgType;
    }

    /**
     * Gets the venue.
     *
     * @return the venue
     */
    public String getVenue ()
    {
        return venue;
    }

    /**
     * Sets the venue.
     *
     * @param venue the new venue
     */
    public void setVenue (final String venue)
    {
        this.venue = venue;
    }

    /**
     * Gets the date of receipt.
     *
     * @return the date of receipt
     */
    public String getDateOfReceipt ()
    {
        return dateOfReceipt;
    }

    /**
     * Sets the date of receipt.
     *
     * @param dateOfReceipt the new date of receipt
     */
    public void setDateOfReceipt (final String dateOfReceipt)
    {
        this.dateOfReceipt = dateOfReceipt;
    }
}
