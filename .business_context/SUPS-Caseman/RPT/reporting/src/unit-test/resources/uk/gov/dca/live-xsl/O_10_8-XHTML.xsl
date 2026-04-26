<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1009C"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 0.8cm;"/>
		<div style="font-weight: bold; margin-bottom: 0.4cm; font-size: 12pt;">
			In Bankruptcy
		</div>
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div>
			Upon the hearing of this petition this day
		</div>
		<div style="margin-bottom: 0.4cm;">
			And upon the application of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstigatorName"/> for an order that he be substituted as petitioning creditor therein pursuant to Rule 6.30 of the Insolvency Rules 1986
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdHearingAttendees) &gt; 0">
			<div xmlns="" style="margin-bottom: 0.4cm;"><xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/></div>
		</xsl:if>
		<div style="margin-bottom: 0.4cm;">
			Upon <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderSubPetReason"/> 
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdStatutoryDeposit = 'Y'">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				It is ordered that upon payment of the said <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstigatorName"/> of the statutory deposit to the court the statutory deposit paid by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOriginalPetitioner"/> to the court be repaid to him by the official receiver
			</div>
		</xsl:if>
		<div style="margin-bottom: 0.4cm;">
			And it is ordered that the said <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstigatorName"/> be substituted as petitioning creditor in place of the said <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOriginalPetitioner"/> and that the said <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstigatorName"/> be at liberty to amend the said petition accordingly.  And it is ordered that the said <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstigatorName"/> do within 7 days from the date of this order file an affidavit of truth of statements in the bankruptcy petition and exhibit thereto a sealed copy of the said amended petition and at least 14 days before the date of the adjourned hearing of the petition serve, in the absence of any order to the contrary, this will involve personal service, upon the above-named debtor a sealed copy of the amended petition
		</div>
		<div style="margin-bottom: 0.4cm;">
			And it is ordered that the hearing of the said amended petition be adjourned to:
		</div>
		<div style="margin-bottom: 0.4cm;">
			Date: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate1"/>
 		</div>
		<div style="margin-bottom: 0.4cm;"> 		
			Time: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/>
 		</div>
		<div style="margin-bottom: 0.4cm;">
			at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>
 		</div>
		<div style="margin-bottom: 0.4cm;">
			It is ordered that the question of the costs of the said <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOriginalPetitioner"/> <xsl:if xmlns="http://eds.com/supsfo" test="$vdStatutoryDepositReserved = 'Y'"> and of the statutory deposit</xsl:if> be reserved until the final determination of the said amended petition
 		</div>
		<div style="margin-bottom: 0.4cm;">
			Dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/>
 		</div>
 	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>