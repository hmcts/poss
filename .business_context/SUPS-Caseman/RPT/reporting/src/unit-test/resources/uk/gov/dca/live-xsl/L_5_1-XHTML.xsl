<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1002E"><div><font size="4" face="Arial">
		<div style="margin-bottom: 0.4cm;">Dear <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGreeting"/></div>
		<div style="margin-bottom: 0.4cm; font-size: 12pt; font-weight: bold; text-align: center;">Re: Case Number: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimNumber"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimantName"/> v <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectName"/>
		</div>
			<xsl:choose xmlns="http://eds.com/supsfo">
				<xsl:when test="$vdEarningsOrderOther = 'RCJ'">
					<div xmlns="" style="margin-bottom: 0.8cm;">
						Take notice that the above matter has been transferred from the Royal Courts of Justice Number. <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdRCJCaseNo"/> to the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtSelection"/> County Court
						and has been allocated Number. <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdNewCaseNumber"/> which should be quoted on all future correspondence.
					</div>
				</xsl:when>
				<xsl:otherwise>
					<div xmlns="" style="margin-bottom: 0.4cm;">
						I am returning your request for
						<xsl:choose xmlns="http://eds.com/supsfo">
							<xsl:when test="$vdEarningsOrderOther = 'ATT'">
								an attachment of earnings order
							</xsl:when>
							<xsl:when test="$vdEarningsOrderOther = 'OFQ'">
								an order for oral examination
							</xsl:when>
							<xsl:when test="$vdEarningsOrderOther = 'OTH'"><xsl:value-of select="$vdReturnProcessType"/></xsl:when>
						</xsl:choose>
						<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderFee"/> in the above case. You must issue the proceedings in the defendant's local County Court which in this case is
						<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtSelection"/>.
					</div>
				</xsl:otherwise>
			</xsl:choose>
		<div style="margin-bottom: 0.8cm;">Please instruct the Court to transfer the case to <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtSelection"/> County Court.</div>
		<div style="margin-bottom: 1.5cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdLetterEnding"/></div>
		<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdName"/></div>
		<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSection"/> Section</div>
		<div>Ext <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdExtension"/></div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>