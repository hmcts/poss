<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><xsl:if test="$vdEventId = '450' or $vdQuestioningRequired ='Y'"><div class="EDITME" id="N100B4"><div><font size="2" face="Times New Roman">
				<div style="margin-bottom: 0.4cm;">
					<span style="font-weight: bold;">On </span> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/>,
					<xsl:choose xmlns="http://eds.com/supsfo">
						<xsl:when test="$vdWhoConsideredApplication = 'J'"><xsl:value-of select="$vdJudge"/></xsl:when>
						<xsl:when test="$vdWhoConsideredApplication = 'C'">the court</xsl:when>
					</xsl:choose>
				</div>
				<div style="margin-bottom: 0.4cm;">
					<xsl:if xmlns="http://eds.com/supsfo" test="$vdHasHearingAt = 'Y'">sitting at <xsl:value-of select="$vdHearingAtCourtName"/> <xsl:value-of select="$vdCourtOrDistrict"/>, <xsl:value-of select="$vdHearingAtCourtAddress"/></xsl:if>
				</div>
				<div style="margin-bottom: 0.4cm;">
					considered the application of the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentCreditor"/> ('the judgment creditor'), which shows that: a judgment or order given on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInterimChargingOrderDate2"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentOtherCourt"/> ordered <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdQuestioningName"/> ('the judgment debtor') to <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgeAmount"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdQuestioningNonMoney"/>
				</div>
				<div style="margin-bottom: 0.4cm;">
					<span style="font-weight: bold;">and the court orders</span> that
				</div>
				<div>
					1. <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdQuestioningWhoIs"/><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/> on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate1"/> before a <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdQuestioningAttendenceBeforeWhom"/> at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/> to provide information about the judgment debtor's means and any other information needed to enforce the judgment or order.
				</div>
				<div>
					<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdQuestioningBeforeJudge"/>
				</div>
				<div style="margin-top: 0.4cm; margin-bottom: 0.4cm;">
					2. <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdQuestioning2"/>
				</div>
				<div style="margin-bottom: 0.4cm;">
					3. <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdQuestioning3"/>
				</div>
				<div style="margin-bottom: 0.4cm;">
					4. The court where the questioning is to take place may make an order for payment of the costs of the application and of the hearing.
				</div>
				<div style="font-size: 11pt; font-weight: bold;">
					To <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdQuestioningName"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdQuestioningWhereIs"/>
				</div>
				<div style="margin-bottom: 0.4cm; font-size: 11pt; font-weight: bold;">
					You must obey this order. If you do not, you may be sent to prison for contempt of court.
				</div>
				<div style="font-size: 11pt; font-weight: bold; margin-bottom: 0.4cm;">
					Amount owing
				</div>
				<div style="text-align: left; margin-bottom: 0.4cm;">
					<table>
						<col width="378"/>
						<col width="132.29999999999998"/>
						<tbody>
							<tr>
								<td style="padding-right: 0.2cm;">
									<div style="margin-bottom: 0.4cm;">
										The application shows that the amount owing under the judgment or order (including any costs and interest) is
									</div>
								</td>
								<td>
									<div style="text-align: right; margin-bottom: 0.4cm;">
										£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
										<xsl:with-param name="value"><xsl:value-of select="$vdAmountOutstanding"/></xsl:with-param>
										</xsl:call-template>	
									</div>
								</td>
							</tr>
							<tr>
								<td style="padding-right: 0.2cm;">
									<div style="margin-bottom: 0.4cm;">
										The judgment creditor has paid a court fee of
									</div>
								</td>
								<td>
									<div style="text-align: right; margin-bottom: 0.4cm;">
										£<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdApplicationFee"/>
									</div>
								</td>
							</tr>
							<tr>
								<td style="padding-right: 0.2cm;">
									<div style="margin-bottom: 0.4cm;">
										Total
									</div>
								</td>
								<td style="border-top-style: solid; border-top-width: 0.03cm; border-bottom-style: solid; border-bottom-width: 0.03cm;">
									<div style="text-align: right; margin-bottom: 0.4cm;">
										£<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdQuestioningTotalOwing"/>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div>
					If the total amount owing is paid (together with any further interest falling due), the judgment creditor may agree that the questioning need not take place (but may ask for an order for costs).
				</div>
				</font></div></div></xsl:if><div class="EDITME" id="N102B3"><div><font size="4" face="Arial">
				<div style="margin-bottom: 0.4cm; font-size: 10pt;">Dear Sirs</div>
				<div style="margin-bottom: 0.4cm; font-size: 10pt;">
					Re: Case number: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimNumber"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstigatorName"/> -v- <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectName"/>
				</div>
				<div style="margin-bottom: 0.4cm; font-size: 10pt;">
					Your application for the judgment debtor (or an officer of the debtor company) to attend court to be questioned has today been 
					<xsl:if xmlns="http://eds.com/supsfo" test="$vdEventId = '31'">reissued.</xsl:if>
					<xsl:if xmlns="http://eds.com/supsfo" test="$vdEventId != '31'">issued.</xsl:if>
				</div>
				<div style="margin-bottom: 0.4cm; font-size: 10pt;">
					<xsl:if xmlns="http://eds.com/supsfo" test="$vdEventId = '31'">A new</xsl:if>
					<xsl:if xmlns="http://eds.com/supsfo" test="$vdEventId != '31'">An</xsl:if>
					appointment has been made for:
				</div>
				<div style="margin-bottom: 0.4cm; font-size: 10pt;">
					the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate1"/> at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/>
				</div>
				<div style="margin-bottom: 0.4cm; font-size: 10pt;">
					at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>
				</div>
				<div style="margin-bottom: 0.4cm; font-size: 10pt; font-weight: bold;">
					Please note the address where the questioning will take place since this may not be at this court. Unless a judge has consented to conduct the debtor's
					questioning, you need not attend.
				</div>
				<xsl:choose xmlns="http://eds.com/supsfo">
					<xsl:when test="$vdN39Served = 'B'">
						<div xmlns="" style="margin-bottom: 0.4cm; font-size: 10pt;">
							Two copies of the Form N39 (Order to attend court for questioning) have been passed to the county court bailiff for service.  If the bailiff is unable to
							serve a copy of the order on the judgment debtor (or officer) no less than 14 days before the questioning is to take place, you will be told and a new date will be set.
						</div>
						<div xmlns="" style="margin-bottom: 0.4cm; font-size: 10pt;">
							You must, no less than 2 days before the date for questioning, confirm by affidavit that the debt, or part of it, remains unpaid and indicate whether or not the debtor has
							approached you to ask for travelling expenses.  A blank form of affidavit (Form EX550) is available from any county court.
						</div>
					</xsl:when>
					<xsl:otherwise>
						<div xmlns="" style="margin-bottom: 0.4cm; font-size: 10pt;">
							Two copies of Form N39 (Order to attend for questioning) are enclosed with this letter.  One copy of the order must be served on the judgment debtor (or officer) personally no
							less than 14 days before the date for questioning.  Serving an order personally means handing it to the judgment debtor (or officer). Please note, it cannot be left with another
							person or simply posted through a letterbox.
						</div>
						<div xmlns="" style="margin-bottom: 0.4cm; font-size: 10pt;">
							The second copy of the order must be attached (exhibited) to an affidavit of service and the affidavit filed with the court where the questioning is to take place no later than
							2 days before the date for questioning.  A blank form of affidavit (Form EX550) is available from any county court.  You must also confirm by affidavit that the amount of money you
							are claiming, or part of it, remains unpaid, and indicate whether or not the judgment debtor has approached you and asked for travelling expenses.
						</div>
						<div xmlns="" style="margin-bottom: 0.4cm; font-size: 10pt;">
							If you are unable to serve the debtor in time, you must return the orders to the court where the questioning is to take place no later than 7 days before the date set and ask for a new one.
						</div>
					</xsl:otherwise>
				</xsl:choose>
				<div style="margin-bottom: 0.8cm; font-size: 10pt;">
					An information leaflet is also available which explains more about what you have to do and by when - 'Orders to obtain information from a person who owes me money - how do I apply for an order?'
				</div>
				<div style="font-size: 10pt; margin-bottom: 1.3cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdLetterEnding"/>,</div>
				<div style="font-size: 10pt;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdName"/></div>
				<div style="font-size: 10pt;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSection"/> Section</div>
				<div style="font-size: 10pt;">Ext <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdExtension"/></div>
			</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>