<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10095"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> has considered the statements of case and allocation questionnaires filed and allocated the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAllocation"/> to <span style="font-weight: bold;">the small claims track.</span>
		</div>
				
		<div style="margin-bottom: 0.4cm;">
			The hearing of the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAllocation"/> will take place
			<xsl:if xmlns="http://eds.com/supsfo" test="$vdHearingTime != $emptyTime"> at <xsl:value-of select="$vdHearingTime"/></xsl:if>
			<xsl:if xmlns="http://eds.com/supsfo" test="$vdHearingDate1 != $emptyDate"> on the <xsl:value-of select="$vdHearingDate1"/></xsl:if>
			<xsl:if xmlns="http://eds.com/supsfo" test="$vdHearingDate1 = $emptyDate"> on a date to be fixed</xsl:if>
			at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/> and should take no longer than <xsl:value-of xmlns="http://eds.com/supsfo" select="normalize-space($vdHearingDuration)"/>.
			<xsl:if xmlns="http://eds.com/supsfo" test="$vdIsHearingDate = 'Y'">
				<div xmlns="">
				A hearing fee of £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdLQHearingFee"/> is payable by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdLQPayableByDate"/> by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingWhoIsToPay"/> unless you make an application for a fee concession.  
				Failure to pay the fee will result in the hearing being removed from the list.
				</div>	
			</xsl:if>
		</div>
			
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSmallClaimFormA4"/>
		</div>
			
		<xsl:choose xmlns="http://eds.com/supsfo"><xsl:when test="$vdIsHearingDate = 'Y'">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				The hearing fee will be refunded in full if the court receives notice in writing at least 7 days before the hearing date, that the case is settled or discontinued.
			</div>
		</xsl:when></xsl:choose>	
			
		<xsl:choose xmlns="http://eds.com/supsfo">
			<xsl:when test="$vdAllocationReasonGiven = 'Y' and string-length($vdAllocationReason) &gt;0">
				<div xmlns="" style="margin-bottom: 0.4cm;">The reasons the judge has given for allocation to this track are that <xsl:call-template xmlns="http://eds.com/supsfo" name="formatTextAreaText">
					<xsl:with-param name="text"><xsl:copy-of select="$vdAllocationReason"/>
					</xsl:with-param></xsl:call-template>.
				</div>
			</xsl:when>
			<xsl:when test="$vdAllocationReasonGiven != 'Y' and string-length($vdAllocationReason) &gt;0">
				<div xmlns="" style="margin-bottom: 0.4cm;">The reason the judge has given for allocation to this track is that <xsl:call-template xmlns="http://eds.com/supsfo" name="formatTextAreaText">
					<xsl:with-param name="text"><xsl:copy-of select="$vdAllocationReason"/>
					</xsl:with-param></xsl:call-template>.
				</div>
			</xsl:when>
		</xsl:choose>

		<xsl:choose xmlns="http://eds.com/supsfo">
			<xsl:when test="$vdSmallClaimTypeDirections = 'RTA'">
				<div xmlns="" style="margin-bottom: 0.4cm;">
						Each party shall deliver to every other party and to the court office copies of all documents on which he intends to rely at the hearing. These may include:
				</div>
				<div xmlns="" style="margin-bottom: 0.4cm;">
						<div><table width="100%"><colgroup><col width="20" align="center" valign="top"/><col/></colgroup><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.4cm;">
									experts' reports (including medical report where damages for personal injury are claimed),
								</div></td></tr><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.4cm;">
									witness statements,
								</div></td></tr><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.4cm;">
									invoices and estimates for repairs,
								</div></td></tr><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.4cm;">
									documents which relate to other losses, such as loss of earnings,
								</div></td></tr><tr><td style="width: 12;">•</td><td><div>
									sketch plans and photographs.
								</div></td></tr></table></div>
				</div>
			</xsl:when>
			<xsl:when test="$vdSmallClaimTypeDirections = 'BDCON'">
				<div xmlns="" style="margin-bottom: 0.4cm;">
						Each party shall deliver to every other party and to the court office copies of all documents on which he intends to rely at the hearing. These may include:
				</div>
				<div xmlns="" style="margin-bottom: 0.4cm;">
						<div><table width="100%"><colgroup><col width="20" align="center" valign="top"/><col/></colgroup><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.4cm;">
									the contract,
								</div></td></tr><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.4cm;">
									witness statements,
								</div></td></tr><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.4cm;">
									experts' reports,
								</div></td></tr><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.4cm;">
									photographs,
								</div></td></tr><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.4cm;">
									invoices for work done or goods supplied,
								</div></td></tr><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.4cm;">
									estimates for work to be done.
								</div></td></tr></table></div>
				</div>
			</xsl:when>
			<xsl:when test="$vdSmallClaimTypeDirections = 'RDDT'">
				<div xmlns="" style="margin-bottom: 0.4cm;">
						Each party shall deliver to every other party and to the court office copies of all documents on which he intends to rely at the hearing. These may include:
				</div>
				<div xmlns="" style="margin-bottom: 0.4cm;">
						<div><table width="100%"><colgroup><col width="20" align="center" valign="top"/><col/></colgroup><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.4cm;">
									the tenancy agreement and any inventory,
								</div></td></tr><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.4cm;">
									the rent book or other evidence of rent and other payments made by the tenant to the landlord,
								</div></td></tr><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.4cm;">
									photographs,
								</div></td></tr><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.4cm;">
									witness statements,
								</div></td></tr><tr><td style="width: 12;">•</td><td><div>
									invoices or estimates for work and goods.
								</div></td></tr></table></div>
				</div>
			</xsl:when>
			<xsl:when test="$vdSmallClaimTypeDirections = 'HW'">
				<div xmlns="" style="margin-bottom: 0.4cm;">
						Each party shall deliver to every other party and to the court office copies of all documents on which he intends to rely at the hearing. These may include:
				</div>
				<div xmlns="" style="margin-bottom: 0.4cm;">
						<div><table width="100%"><colgroup><col width="20" align="center" valign="top"/><col/></colgroup><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.4cm;">
									any written contract, brochure or booking form,
								</div></td></tr><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.4cm;">
									photographs,
								</div></td></tr><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.4cm;">
									documents showing payments made,
								</div></td></tr><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.4cm;">
									witness statements,
								</div></td></tr><tr><td style="width: 12;">•</td><td><div>
									letters.
								</div></td></tr></table></div>
				</div>
			</xsl:when>
		</xsl:choose>

		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdSmallClaimFormA1) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSmallClaimFormA1"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdSmallClaimOriginalDocuments) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSmallClaimOriginalDocuments"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdSmallClaimFormB4) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSmallClaimFormB4"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdSmallClaimFormC4) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSmallClaimFormC4"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdSmallClaimFormC5) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSmallClaimFormC5"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdSmallClaimFormD4) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSmallClaimFormD4"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdSmallClaimFormD5) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSmallClaimFormD5"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdSmallClaimFormC6) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSmallClaimFormC6"/></div></xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdSmallClaimFormB5) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSmallClaimFormB5"/></div></xsl:if>
		
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdSmallClaimFormB6 ='Y'">
			<div xmlns="" style="margin-bottom: 0.4cm;">
					The parties should note that:
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
					(a)	In deciding the case the court will find it very helpful to have a sketch plan and photographs of the place where the accident happened,
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
					(b)	The court may decide not to take into account a document or the evidence of a witness if no copy of that document or no copy of a statement or report by that witness has been supplied to the other parties.
			</div>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdSmallClaimFormC8 ='Y'">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				The parties should note that:
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
				(a)	In deciding the case the judge may find it helpful to have photographs showing the work in question,
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
				(b)	The judge may decide not to take into account a document or the evidence of a witness if no copy of that document or no copy of a statement or report by that witness has been supplied to the other parties.
			</div>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdSmallClaimFormD7 ='Y'">
			<div xmlns="" style="margin-bottom: 0.4cm;">
					The parties should note that:
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
					(a)	In deciding the case the judge may find it helpful to have photographs showing the condition of the property,
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
					(b)	The judge may decide to take into account a document or the evidence of a witness if no copy of that document or no copy of a statement or report by that witness has been supplied to the other parties.
			</div>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdSmallClaimFormE5 ='Y'">
			<div xmlns="" style="margin-bottom: 0.4cm;">
					If either party intends to show a video as evidence he must:
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
					(a)	Contact the court at once to make arrangements for him to do so, because the court may not have the necessary equipment, and
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
					(b)	provide the other party with a copy of the video or the opportunity to see it ( if he asks) at least 2 weeks before the hearing.
			</div>
		</xsl:if>


		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdSmallClaimFormE6) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSmallClaimFormE6"/></div></xsl:if>

		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdSmallClaimFormF1) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSmallClaimFormF1"/></div></xsl:if>
		
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdSmallClaimFormF7A) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSmallClaimFormF7A"/></div></xsl:if>

		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdSmallClaimFormF2) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSmallClaimFormF2"/></div></xsl:if>

		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdSmallClaimFormF7B) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSmallClaimFormF7B"/></div></xsl:if>

		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdSmallClaimFormF4) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSmallClaimFormF4"/></div></xsl:if>

		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdSmallClaimFormF7C) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSmallClaimFormF7C"/></div></xsl:if>

		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdSmallClaimFormF5) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSmallClaimFormF5"/></div></xsl:if>

		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdSmallClaimFormF6) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSmallClaimFormF6"/></div></xsl:if>

		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdSmallClaimFormF8) &gt; 0"><div xmlns="" style="margin-bottom: 0.4cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSmallClaimFormF8"/></div></xsl:if>

		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdSmallClaimFormF9) &gt; 0">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				If either party intends to show a video as evidence he must
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
				(a)	contact the court at once to make arrangements for him to do so, because the court may not have the necessary equipment, and
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
				(b)	provide the other party with a copy of the video or the opportunity to see it at least <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSmallClaimFormF9"/> before the hearing.
			</div>
		</xsl:if>

		<div>
			<span style="font-weight: bold;">Date:</span> <xsl:value-of xmlns="http://eds.com/supsfo" select="$datetoday"/>
		</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>