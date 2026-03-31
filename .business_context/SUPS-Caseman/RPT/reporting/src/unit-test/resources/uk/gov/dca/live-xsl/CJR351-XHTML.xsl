<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100C5"><div><font size="2" face="Times New Roman">
		<div>
			<span style="font-weight: bold;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> ordered</span> that, the defendant having failed to comply with the terms of a <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGoodsAgreementWas"/> agreement dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAgreementDate"/> made between 
			the claimant and the defendant(s) the claimant recovers against the defendant (<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectName"/>) the following goods of the claimant, being 
			goods subject to the agreement and wrongfully kept by the defendant, namely:
		</div>
		<div style="margin-left: 1cm;">
			<xsl:call-template xmlns="http://eds.com/supsfo" name="formatTextAreaText"><xsl:with-param name="text"><xsl:copy-of select="$vdGoodsDetained"/></xsl:with-param></xsl:call-template>
		</div>
		<div style="margin-bottom: 0.4cm;">
			and recovers against the defendant <xsl:choose xmlns="http://eds.com/supsfo"><xsl:when test="$vdGoodsCostsAre = 'A'">costs of this action to be assessed</xsl:when><xsl:otherwise>the sum of £<xsl:value-of select="$vdGoodsCostAmount"/> for costs</xsl:otherwise></xsl:choose>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> has ordered</span> that the defendant (<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectName"/>) do return the goods to the claimant by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGoodsReturnDate"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">And</span> that the defendant pays <xsl:choose xmlns="http://eds.com/supsfo"><xsl:when test="$vdGoodsCostsAre = 'A'">the amount of the costs when assessed</xsl:when><xsl:otherwise>the sum of £<xsl:value-of select="$vdGoodsCostAmount"/> for costs</xsl:otherwise></xsl:choose> to the claimant
			<xsl:choose xmlns="http://eds.com/supsfo">
				<xsl:when test="$vdGoodsCostToBePaid = 'FD'">within 14 days of assessment</xsl:when>
				<xsl:when test="$vdGoodsCostToBePaid = 'GD'">by <xsl:value-of select="$vdGoodsPaymentDate"/></xsl:when>
				<xsl:when test="$vdGoodsCostToBePaid = 'MTH'">by instalments of £<xsl:value-of select="$vdGoodsMonthlyInstalment"/> for every calendar month, the first instalment to reach the claimant by <xsl:value-of select="$vdGoodsFirstPaymentDate"/></xsl:when>
			</xsl:choose>
		</div>
		<div>
			<span style="font-weight: bold;">And</span> the claimant's title to the following goods be transferred to the defendant.
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>