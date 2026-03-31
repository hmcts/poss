<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10096"><div><font size="4" face="Times New Roman">
		<div style="font-weight: bold; margin-bottom: 0.4cm; font-size: 12pt;">
			In Bankruptcy
		</div>
		<div style="margin-bottom: 0.4cm;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			Upon the petition of the above named debtor which was presented on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPetitionDate"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/>
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdPractitionerName) &gt; 0">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				And on considering the report of  <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPractitionerName"/> appointed under section 273(2) of the Insolvency Act 1986
			</div>
		</xsl:if>
		<div style="margin-bottom: 0.4cm;">
			And upon reading the petition and Statement of Affairs
		</div>
		<div>
			It is ordered that <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectName"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdDescription"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			be adjudged bankrupt
		</div>
		
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdECRegulation != 'Y'">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				And the court is satisfied that the EC Regulation does not apply in relation to these proceedings
			</div>
		</xsl:if>
		
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdECRegulation = 'Y'">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				And the court being satisfied that the EC Regulation does apply and that these proceedings are <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdECProceedingType"/> proceedings as defined in Article 3 of the regulation
			</div>
		</xsl:if>
		 		
 		<div style="margin-bottom: 0.4cm;">
			Date: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/>  
 		</div>
		<div style="margin-bottom: 0.4cm;">		
			Time: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/>
 		</div>
		
		<footnote xmlns="http://eds.com/supsfo" noteextent="8.3"> 		
		<div xmlns="" style="font-size: 10pt; font-family: Times;">
		<div style="margin-bottom: 0.4cm; text-decoration: underline;">
			Important Notice to Bankrupt
		</div>
		<div style="margin-bottom: 0.4cm;">
			The Official Receiver attached to the Court is by virtue of this Order receiver and manager of the bankrupt's estate.
			You are required to attend upon the Official Receiver of the Court at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdReceiverAddress"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOfficialReceiverPartyTelephone"/>
			immediately after you have received this order
		</div>
		<div style="margin-bottom: 0.4cm; font-style: italic;">
			The Official Receiver's offices are open Monday to Friday (except on holidays) from 10.00 am to 4.00 pm
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdJudgmentDebtorHasSolicitor= 'Y'">
			<div xmlns="" style="margin-bottom: 0.1cm;">
				<table>
					<col width="718.1999999999999"/>
					<tbody>
						<tr>
							<td style="padding-left: 0.2cm; padding-right: 0.2cm; border-style: solid; border-width: 0.02cm;">
								<div style="font-weight: bold; margin-top: 0.2cm; margin-bottom: 0.4cm;">Endorsement on Order</div>
								<div style="margin-bottom: 0.4cm;">The solicitor to the debtor is:</div>
								<div style="margin-bottom: 0.4cm;">Name: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentDebtorSolicitorName"/></div>
								<div style="margin-bottom: 0.4cm;">Address: <xsl:call-template xmlns="http://eds.com/supsfo" name="format-address-single-line">
									<xsl:with-param name="theAddress"><xsl:copy-of select="$vdJudgmentDebtorSolicitorAddress"/></xsl:with-param>
									</xsl:call-template></div>
								<div style="margin-bottom: 0.4cm;">Telephone No: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentDebtorSolicitorTelephone"/></div>
								<div style="margin-bottom: 0.2cm;">Reference: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectReference"/></div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdJudgmentDebtorHasSolicitor != 'Y'">
			<div xmlns="" style="margin-bottom: 4.8cm;"> </div>
		</xsl:if>
		</div>
	</footnote> 					
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>