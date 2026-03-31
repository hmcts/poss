<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100C8"><div><font size="2" face="Times New Roman">
		<div style="margin-top: 0.3cm;">
			In accordance with <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectPartyRoleLower"/>'s bill of costs 
		</div>
		<div style="margin-bottom: 0.4cm;">	
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> has assessed the total costs as 
			£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
				<xsl:with-param name="value"><xsl:value-of select="$vdAssessedCosts"/></xsl:with-param>
			</xsl:call-template>
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDetailAssessmentCosts"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInterimCosts"/>
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdBalanceAmount &gt; 0">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				You must pay the balance of 
				£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
					<xsl:with-param name="value"><xsl:value-of select="$vdBalanceAmount"/></xsl:with-param>
				</xsl:call-template> to the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectPartyRoleLower"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSumPayableWithin"/>.
			</div>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdJudgmentDate != $emptyDate">
			<div xmlns="" style="margin-bottom: 0.2cm;">
				The date from which any entitlement to interest under this certificate is to run is :-
			</div>
			<div xmlns="" style="margin-bottom: 0.2cm;">
				1. as to the amount of the bill as assessed excluding the costs of assessment, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentDate"/>
			</div>
			<div xmlns="">
				2. and as to 
				£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
					<xsl:with-param name="value"><xsl:value-of select="$vdAssessedCosts"/></xsl:with-param>
				</xsl:call-template>
				being the costs of assessment, the date of this certificate.
			</div>
		</xsl:if>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>