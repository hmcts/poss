<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100AE"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.4cm;">
			<xsl:choose xmlns="http://eds.com/supsfo">
				<!-- Only if the defendant is represented do we add the defendant part of the sentence -->
				<xsl:when test="$vdDefendantRepresentedBy = ''">
					An application was made on <xsl:value-of select="$vdApplicationDate"/> by <xsl:value-of select="$vdPartyApplying"/> for the claimant.				
				</xsl:when>
				<xsl:otherwise>
					An application was made on <xsl:value-of select="$vdApplicationDate"/> by <xsl:value-of select="$vdPartyApplying"/> for the claimant and was attended by <xsl:value-of select="normalize-space($vdDefendantRepresentedBy)"/> for the defendant.					
				</xsl:otherwise>
			</xsl:choose>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> approved the following terms of settlement and made them an Order of the Court.
		</div>
		<div style="margin-bottom: 0.4cm;">
			BY CONSENT IT IS ORDERED that:-
		</div>

		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdSatisfactionAmount) &gt; 0">
			<div xmlns="">
				The claimant may accept the sum of £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSatisfactionAmount"/> in satisfaction of the 
						<xsl:if xmlns="http://eds.com/supsfo" test="$vdMultipleClaims = 'Y'"> claims.</xsl:if>
						<xsl:if xmlns="http://eds.com/supsfo" test="$vdMultipleClaims = 'N' or $vdMultipleClaims = ''"> claim.</xsl:if>
			</div>
		</xsl:if>
		
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdOrderSubject = 'ACC'">
			<xsl:if test="$vdApportioned = 'Y'">
				<div xmlns="">
					The said sum of £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSumAmount"/> is apportioned as follows:-
				</div>
				
				<xsl:if test="$vdAct = 'LAW'">
					<div xmlns="" style="margin-left: 2cm;">
						a) under the Law Reform (Miscellaneous Provisions) Act 1934 the sum of £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdLawReformAmount"/>
					</div>
				</xsl:if>

				<xsl:if test="$vdAct = 'FATAL'">
					<div xmlns="" style="margin-left: 2cm;">
						a) under the Fatal Accidents Act 1976;
					</div>
					
					<xsl:if test="$vdFatalAccidentPayee = 'BOTH'">				
						<div xmlns="" style="margin-left: 4cm;">
							(i)  £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimantClaimAmount"/> to the personal claim of the claimant,
						</div>
						<div xmlns="" style="margin-left: 4cm;">
							(ii) £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdChildDependantAmount"/> to the personal claim of the child dependant
						</div>
						<div xmlns="" style="margin-left: 4cm;">
							<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdChildNames"/>
						</div>
					</xsl:if>

					<xsl:if test="$vdFatalAccidentPayee = 'CLM'">
						<div xmlns="" style="margin-left: 4cm;">
							(i) £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimantClaimAmount"/> to the personal claim of the claimant
						</div>
					</xsl:if>

					<xsl:if test="$vdFatalAccidentPayee = 'CHILD'">
						<div xmlns="" style="margin-left: 4cm;">
							(i)	£<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdChildDependantAmount"/> to the personal claim of the child dependant
						</div>
						<div xmlns="" style="margin-left: 4cm;">
							<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdChildNames"/>
						</div>						
					</xsl:if>
				</xsl:if>

				<xsl:if test="$vdAct = 'BOTH'">
					<div xmlns="" style="margin-left: 2cm;">
						a) under the Law Reform (Miscellaneous Provisions) Act 1934 the sum of £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdLawReformAmount"/>
					</div>
					<div xmlns="" style="margin-left: 2cm;">
						b) under the Fatal Accidents Act 1976;
					</div>

					<xsl:if test="$vdFatalAccidentPayee = 'BOTH'">					
						<div xmlns="" style="margin-left: 4cm;">
							(i)  £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimantClaimAmount"/> to the personal claim of the claimant,
						</div>
						<div xmlns="" style="margin-left: 4cm;">
							(ii) £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdChildDependantAmount"/> to the personal claim of the child dependant
						</div>
						<div xmlns="" style="margin-left: 4cm;">
							<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdChildNames"/>
						</div>
					</xsl:if>

					<xsl:if test="$vdFatalAccidentPayee = 'CLM'">					
						<div xmlns="" style="margin-left: 4cm;">
							(i) £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimantClaimAmount"/> to the personal claim of the claimant
						</div>
						<div xmlns="" style="margin-left: 4cm;">
							<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdChildNames"/>
						</div>
					</xsl:if>

					<xsl:if test="$vdFatalAccidentPayee = 'CHILD'">
						<div xmlns="" style="margin-left: 4cm;">
							(i) £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdChildDependantAmount"/> to the personal claim of the child dependant(s)
						</div>
						<div xmlns="" style="margin-left: 4cm;">
							<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdChildNames"/>
						</div>
					</xsl:if>
				</xsl:if>
			</xsl:if>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="/variabledata/order/settlement/paydirect = 'Y'">
			<div xmlns="" style="margin-top: 0.4cm;">
				<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDefendantPayDirect"/>
			</div>
		</xsl:if>		

		<xsl:if xmlns="http://eds.com/supsfo" test="$vdOrderSubject = 'ACC'">
			<!-- This is only relevant if the user chose 'Fatal accident' in the QA screen for the Claim/order in respect of question -->
			<div xmlns="" style="margin-top: 0.4cm;">
				The defendant pay the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDefendantInvest"/> on or before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPayDate2"/>
				<xsl:if xmlns="http://eds.com/supsfo" test="$vdFirstCharge1 = 'Y'"> subject to a first charge under section 16(6) of the Legal Aid Act 1988 </xsl:if>
				to be invested and accumulated in the Special Investment Account pending further order.
			</div>
		</xsl:if>
		<div style="margin-top: 0.4cm;">
			The claimant's solicitor attend a hearing for further investment directions on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate"/> at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/> at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>.
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdPaidMajority = 'Y'">		
			<div xmlns="" style="margin-top: 0.4cm;">
				The fund to be paid to the child on majority as <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdChildHeShe"/> may request.
			</div>
		</xsl:if>	
		<xsl:if xmlns="http://eds.com/supsfo" test="variabledata/order/settlement/receiverapplication= 'Y'">
			<div xmlns="" style="margin-top: 0.4cm;">
				<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdApplicationReceiver"/>
			</div>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdInterest = 'Y'">
			<div xmlns="" style="margin-top: 0.4cm;">
				Any interest accrued up to the date of this order on any money in court paid in by or on behalf of the dependant be paid
				out to the defendant's solicitors.
			</div>
		</xsl:if>
		
		<xsl:choose xmlns="http://eds.com/supsfo"> 		
			<xsl:when test="$vdRightsWording = 'Y'">
				<div xmlns="" style="margin-top: 0.4cm;">		
					The defendant pay the claimant's costs to be assessed with permission to request assessment to be dispensed with and the claimant's solicitor waiving any claim to further costs.
				</div>						
			</xsl:when>
			<xsl:otherwise>
				<div xmlns="" style="margin-top: 0.4cm;">						
					The defendant pay the claimant's costs to be assessed with permission to request assessment to be dispensed with.
				</div>											
			</xsl:otherwise>
		</xsl:choose>			
		
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdClaimantCosts = 'Y'">
			<div xmlns="" style="margin-top: 0.4cm;">
				The claimant's costs be assessed in accordance with Regulation 107 of the Civil Legal Aid (General) Regulations 1989.
			</div>
		</xsl:if>
		<div style="margin-top: 0.4cm;">
			Upon payment of the sum(s) and costs referred to above, the defendant be discharged from further liability in respect
			of all claims made by the claimant against him in these proceedings.
		</div>
		<div style="margin-top: 0.4cm;">
			All further proceedings be stayed except that either party has permission to apply to the court for the purpose of carrying
			this order into effect.
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>