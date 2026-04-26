<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100BF"><div><font size="2" face="Times New Roman">
			<div style="font-size: 12pt;">
				<div style="margin-bottom: 0.8cm;"/>
				<div style="margin-bottom: 0.4cm; font-weight: bold; text-decoration: underline;">
					If you do not obey this order you will be guilty of contempt of court and you may be sent to prison
				</div>
				<div style="margin-bottom: 0.4cm;">
					On <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInjunctionDateConsidered"/> the court considered an application for an injunction
				</div>
				<div style="margin-bottom: 0.4cm;">
					<span style="font-weight: bold;">The Court ordered that </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectName"/>
				</div>
				<div style="margin-bottom: 0.4cm;">
					<span style="font-weight: bold;">is forbidden </span> (<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInjunctionLimitedCompanyClause"/>) <xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdInjunctionOrderDetails"/>
				</div>
				<xsl:if xmlns="http://eds.com/supsfo" test="$vdInjunctionForceDate != $emptyDate">
					<div xmlns="" style="margin-bottom: 0.4cm;">
						<span style="font-weight: bold;">This order shall remain in force until </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInjunctionForceDate"/> at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInjunctionForceTime"/> unless before then it is revoked by further order of the court
					</div>
				</xsl:if>
				<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdInjunctionActsDetails) &gt; 0">
					<div xmlns="">
						<span style="font-weight: bold;">And it is ordered that </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectName"/>
					</div>
					<div xmlns="">
						<span style="font-weight: bold;">shall </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInjunctionActsDetails"/>
					</div>
					<div xmlns="" style="margin-bottom: 0.4cm;">
						on or before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInjunctionActsDate"/>
					</div>
				</xsl:if>
				<xsl:if xmlns="http://eds.com/supsfo" test="string-length($vdInjunctionFurtherTerms) &gt; 0">
					<div xmlns="" style="font-weight: bold;">
						It is further ordered that
					</div>
					<div xmlns="" style="margin-bottom: 0.4cm;">
						<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInjunctionFurtherTerms"/>
					</div>
				</xsl:if>
				<xsl:if xmlns="http://eds.com/supsfo" test="$vdHasFurtherHearing = 'Y'">
					<div xmlns="" style="font-weight: bold;">
						Notice of further hearing
					</div>
					<div xmlns="">
						The court will reconsider the application and whether the order should continue at a further hearing at  <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/> on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate"/> at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/>
					</div>
					<div xmlns="" style="margin-bottom: 0.4cm;">
						If you do not attend at the time shown the court may make an injunction order in your absence.
					</div>
				</xsl:if>
				<xsl:if xmlns="http://eds.com/supsfo" test="$vdInjunctionDisplayOrderID != 'N16(1)' and $vdInjunctionOrder != 'Y'">
					<div xmlns="" style="margin-bottom: 0.4cm;">
						You are entitled to apply to the court to reconsider the order before the day.
					</div>
				</xsl:if>
				<xsl:if xmlns="http://eds.com/supsfo" test="$vdInjunctionPOA = 'Y'">
					<div xmlns="" style="margin-bottom: 0.4cm;">
						The court is satisfied that <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInjunctionViolenceHarm"/>.
					</div>
					<div xmlns="" style="margin-bottom: 0.4cm;">
						A power of arrest is attached to terms <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInjunctionPOADetails"/> of this injunction whereby any constable may under the power given in section 91
						of the Anti-social Behaviour Act 2003, arrest without warrant the <xsl:call-template xmlns="http://eds.com/supsfo" name="convertcase"><xsl:with-param name="toconvert"><xsl:value-of select="$vdSubjectPartyRole"/></xsl:with-param><xsl:with-param name="conversion">lower</xsl:with-param></xsl:call-template> if the constable has reasonable cause for
						suspecting the <xsl:call-template xmlns="http://eds.com/supsfo" name="convertcase"><xsl:with-param name="toconvert"><xsl:value-of select="$vdSubjectPartyRole"/></xsl:with-param><xsl:with-param name="conversion">lower</xsl:with-param></xsl:call-template> is in breach of any of those terms of this injunction.
					</div>
				</xsl:if>
				<div style="font-style: italic;">
					If you do not understand anything in this order you should go to a Solicitor, Legal Advice Centre or a Citizen's Advice Bureau
				</div>
			</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>