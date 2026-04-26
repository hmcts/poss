<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><xsl:if test="$vdIsNewN79AsReqd = 'Y'"><div class="EDITME" id="N100C7"><div><font size="2" face="Times New Roman">
				<div style="margin-top: 1.0cm; margin-bottom: 0.6cm;">
					<span style="font-weight: bold;">On </span> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtDate"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
				</div>
				<div>
					sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
				</div>
				<div style="margin-bottom: 0.6cm;">
					read the order made on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdQuestioningDate"/>,
					<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdAffidavitServedBy) &gt; 0"> the certificate dated <xsl:value-of select="$vdDisobedienceServiceDate"/> of the bailiff,</xsl:if>
					the affidavit<xsl:if xmlns="http://eds.com/supsfo" test="$vdAffidavitServiceDate != $emptyDate ">s</xsl:if> of 
					<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdAffidavitServedBy) &gt; 0"> <xsl:value-of select="$vdAffidavitServedBy"/> sworn on <xsl:value-of select="$vdAffidavitServiceDate"/> and  </xsl:if>
					<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAffidavitExpenseBy"/> sworn on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAffidavitExpenseDate"/> 
					<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdAffidavitServedBy) &gt; 0"> respectively as to service of the order and </xsl:if>
					as to the provision of travelling expenses and the certificate dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdNonAttendanceDate"/> of 
					<xsl:if xmlns="http://eds.com/supsfo" test="$vdCertifiedNonAttendance = 'J'"><xsl:value-of select="$vdCertifiedNonAttendanceJudge"/></xsl:if>
					<xsl:if xmlns="http://eds.com/supsfo" test="$vdCertifiedNonAttendance != 'J'">the Court Officer</xsl:if>.
				</div>
				<div style="margin-bottom: 0.6cm;">
					<span style="font-weight: bold;">and the court is satisfied</span> that
				</div>
				<div style="margin-bottom: 0.6cm;">
					1. <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWhoIs"/> was ordered to attend court on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDisobedienceHearingDate"/> to be questioned.
				</div>
				<div style="margin-bottom: 0.6cm;">
					2. the order to attend was served on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWhoIs"/> on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDisobedienceServiceDate"/>.
				</div>
				<xsl:if xmlns="http://eds.com/supsfo" test="$vdExpensesPaidDate != $emptyDate">
					<div xmlns="" style="margin-bottom: 0.6cm;">3. on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdExpensesPaidDate"/> the judgment creditor paid <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWhoIs"/> a sufficient sum for travelling expenses.</div>
				</xsl:if>
				<xsl:if xmlns="http://eds.com/supsfo" test="$vdExpensesPaidDate = $emptyDate">
					<div xmlns="" style="margin-bottom: 0.6cm;">3. <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWhoIs"/> did not within seven days of the service of the order request from the judgment creditor payment of a sufficient sum for travelling expenses.</div>
				</xsl:if>
				<div style="margin-bottom: 0.6cm;">
					4. <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWhoIs"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDisobedienceSuspendedReason"/>
					<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdSpecificQuestionDetail) &gt; 0"> <xsl:value-of select="$vdSpecificQuestionDetail"/></xsl:if>
				</div>
				<div style="margin-bottom: 0.6cm;">
					And that <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWhoIs"/> has been guilty of contempt of court by disobeying the order of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdQuestioningDate"/>
				</div>
				<div style="margin-bottom: 0.6cm;">
					<span style="margin-bottom: 0.4cm; font-weight: bold;">and the court orders</span> that <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWhoIs"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWhereIs"/> be committed to Her Majesty's Prison <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDisobedienceArrestPrisonName"/> for a period of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDisobedienceArrestCommittalDays"/> days
				</div>
				<div style="margin-bottom: 0.6cm;">
					<span style="margin-bottom: 0.4cm; font-weight: bold;">1.</span> this order shall be suspended so long as <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWhoIs"/> attends court at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/> on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate1"/> at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/> and complies with the order made on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdQuestioningDate"/>
					<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdComplianceDetails) &gt; 0"> and <xsl:value-of select="$vdComplianceDetails"/></xsl:if>.
				</div>
				<div style="margin-bottom: 0.6cm;">
					<span style="margin-bottom: 0.4cm; font-weight: bold;">2.</span> if <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWhoIs"/> does not comply with these terms, a warrant of arrest shall be issued and <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWhoIs"/> shall, when arrested, be brought before a judge to consider whether the committal order should be discharged.
				</div>
				<div style="margin-bottom: 0.6cm;">
					<xsl:if xmlns="http://eds.com/supsfo" test="$vdOrderForCosts = 'Y'"><span xmlns="" style="font-weight: bold;">3.</span> and that <xsl:value-of select="$vdWhoIs"/> pay the judgment creditors costs of attending of 
					£<xsl:value-of select="$vdDisobedienceSuspendedCostsAmount"/>, on or before <xsl:value-of select="$vdCostPaymentDate"/>
					</xsl:if>
				</div>
		</font></div></div></xsl:if><div class="EDITME" id="N10235"><div><font size="4" face="Arial">
				<div style="font-size: 10pt; margin-top: 0.8cm; margin-bottom: 0.4cm;">Dear Sirs</div>
				<div style="font-size: 10pt; margin-bottom: 0.4cm;">
					Re: Case number <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimNumber"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstigatorName"/> -v- <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectName"/>
				</div>
				<xsl:if xmlns="http://eds.com/supsfo" test="$vdEventId = '32'">
					<div xmlns="" style="font-size: 10pt; margin-bottom: 0.4cm;">
						Please note that the order for the debtor's <xsl:if xmlns="http://eds.com/supsfo" test="$vdDisobedienceSuspendedServedBy = 'B'">(or officer's)</xsl:if> committal to prison has today been reissued.  
						The order has been suspended so long as the debtor attends court to be <xsl:if xmlns="http://eds.com/supsfo" test="$vdDisobedienceSuspendedServedBy = 'B'">questioned.</xsl:if><xsl:if xmlns="http://eds.com/supsfo" test="$vdDisobedienceSuspendedServedBy != 'B'">questioned (on a new date).</xsl:if>						
					</div>
				</xsl:if>
				<xsl:if xmlns="http://eds.com/supsfo" test="$vdEventId != '32'">
					<div xmlns="" style="font-size: 10pt; margin-bottom: 0.4cm;">
						<xsl:if xmlns="http://eds.com/supsfo" test="$vdDisobedienceSuspendedServedBy != 'B'">Please note that an order for the debtor's committal to prison has today been issued because the debtor failed to comply with an order to attend court for questioning.  The order has been suspended so long as the debtor attends court to be questioned (on a new date).</xsl:if>
						<xsl:if xmlns="http://eds.com/supsfo" test="$vdDisobedienceSuspendedServedBy = 'B'">Please note, the judgment debtor (or officer of the debtor company) has failed to comply with an order to attend court for questioning.  An order for the debtor's (or officer's) committal to prison has today been issued.  The order has been suspended so long as the debtor attends court to be questioned.</xsl:if>						
					</div>					
				</xsl:if>
				<div style="font-size: 10pt; margin-bottom: 0.4cm;">
					<xsl:if xmlns="http://eds.com/supsfo" test="$vdEventId ='32'">A new</xsl:if><xsl:if xmlns="http://eds.com/supsfo" test="$vdEventId !='32'">An</xsl:if> appointment has been made for:
				</div>
				<div style="font-size: 10pt; margin-bottom: 0.4cm;">
					the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate1"/> at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/>
				</div>
				<div style="font-size: 10pt; margin-bottom: 0.4cm;">
					at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>
				</div>
				<div style="font-size: 10pt; font-weight: bold; margin-bottom: 0.4cm;">
					Please note the address where the questioning will take place.  This may not be at the same court that issued your application.  Unless a judge has consented to conduct the debtor's
					questioning, you need not attend.
				</div>
				<xsl:if xmlns="http://eds.com/supsfo" test="$vdDisobedienceSuspendedServedBy != 'B'">
					<div xmlns="" style="font-size: 10pt; margin-bottom: 0.4cm;">
						Two copies of Form N79A (suspended committal order) are enclosed with this letter. One copy of the order must be served on the judgment debtor (or officer) personally no less than 14 days before the date for questioning.
						<span style="font-weight: bold;">Serving an order personally means handing it to the judgment debtor (or officer).  Please note, it cannot be left with another person or simply posted through a letterbox.</span>
					</div>
					<div xmlns="" style="font-size: 10pt; margin-bottom: 0.4cm;">
						The second copy of the order must be attached (exhibited) to an affidavit of service and the affidavit filed with the court <span style="font-weight: bold;">where the questioning is to take place</span> no later than 2 days before the date for questioning.
						A blank form of affidavit (Form EX550) is available from any county court.  If you are unable to serve the debtor in time, you must return the orders to the court where the questioning is to take place no later than 7 days before the date and ask for a new one.
					</div>
				</xsl:if>
				<xsl:if xmlns="http://eds.com/supsfo" test="$vdDisobedienceSuspendedServedBy = 'B'">
					<div xmlns="" style="font-size: 10pt; margin-bottom: 0.4cm;">
						The county court bailiff will serve the order on the debtor.  If the bailiff is unable to serve the debtor in time, you will be told and a new date will be given.
					</div>
				</xsl:if>
				<div style="font-size: 10pt; margin-bottom: 1.5cm;">Yours sincerely,</div>
				<div style="font-size: 10pt;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdName"/></div>
				<div style="font-size: 10pt;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSection"/> Section</div>
				<div style="font-size: 10pt;">Ext <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdExtension"/></div>
			</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>