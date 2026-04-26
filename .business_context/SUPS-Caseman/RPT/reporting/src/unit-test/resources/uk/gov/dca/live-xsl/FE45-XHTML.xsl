<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1008B"><div><font size="2" face="Times New Roman">
			<div style="font-weight: bold; margin-bottom: 0.4cm; font-size: 12pt;">
				You have not complied with the following order
			</div>
			
			<div style="margin-bottom: 0.4cm; margin-left: 1cm; font-size: 12pt;">
				On <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInterimChargingOrderDate2"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentCourtNameDescription"/> 
				ordered the respondent <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectName"/> to pay £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGoodsMonthlyInstalment"/> per <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstalmentPeriodValue"/> to the applicant <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimantName"/>.
			</div>
			<div style="margin-bottom: 0.4cm; font-size: 12pt;">
				On <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/> an application under Rule 33.3(2) for an order for such method of enforcement as the court may consider appropriate was made.
			</div>
			<div style="font-size: 12pt;">
				<span style="font-weight: bold;">You are now ordered to attend court</span> to disclose full details of your income and outgoings and your assets (what you own) and liabilities (what you owe).
			</div>
			<div style="margin-bottom: 0.4cm; font-size: 12pt;">
				(If you have been ordered to attend as an officer of a company or corporation, you will be required to disclose the same details about the company or corporation.)
			</div>
			
			<div style="font-weight: bold; margin-bottom: 0.2cm; font-size: 12pt;">
				It is ordered:
			</div>
			<div style="margin-bottom: 0.4cm; font-size: 12pt;">					
				1. That you <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectName"/> (the respondent) must attend <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtNameDescription"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/> on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate1"/> at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/> to give information about your
				income and outgoings and your assets and liabilities and any other information required to enforce the maintenance order.
			</div>
			<div style="margin-bottom: 0.4cm; font-size: 12pt;">2. You (the respondent) must produce at court all documents in your control which relate to the your means of paying the amount due under the maintenance order.</div>
			<div style="margin-bottom: 0.4cm; font-size: 12pt;">3. You (the respondent) must answer on oath, all the questions which the court asks and if appropriate which the court allows the applicant to ask.</div>
			<div style="margin-bottom: 0.4cm; font-size: 12pt;">4. The court where the questioning is to take place may make an order for payment of the costs of the application and of the hearing.</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>