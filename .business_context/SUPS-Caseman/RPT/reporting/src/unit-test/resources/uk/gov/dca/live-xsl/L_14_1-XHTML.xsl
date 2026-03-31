<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10030"><div><font size="4" face="Arial">
		<div style="margin-bottom: 1.0cm;"/>
			<xsl:choose xmlns="http://eds.com/supsfo">
				<xsl:when test="$vdCaseType='CREDITORS PETITION'">
					<div xmlns="" style="font-weight: bold;">DEBTOR'S NAME</div>
				</xsl:when>
				<xsl:when test="$vdCaseType='DEBTORS PETITION'">
					<div xmlns="" style="font-weight: bold;">DEBTOR'S NAME</div>
				</xsl:when>
				<xsl:when test="$vdCaseType ='WINDING UP PETITION'">
					<div xmlns="" style="font-weight: bold;">COMPANY NAME</div>
				</xsl:when>
                                <xsl:when test="$vdCaseType ='COMPANY ADMIN ORDER'">
					<div xmlns="" style="font-weight: bold;">COMPANY NAME</div>
				</xsl:when>
			</xsl:choose>
		<div style="margin-bottom: 0.4cm;">
			<xsl:choose xmlns="http://eds.com/supsfo">
				<xsl:when test="$vdCaseType='CREDITORS PETITION'">
					<xsl:value-of select="$vdDebtorName"/>
				</xsl:when>
				<xsl:when test="$vdCaseType='DEBTORS PETITION'">
					<xsl:value-of select="$vdDebtorName"/>
				</xsl:when>
				<xsl:when test="$vdCaseType ='WINDING UP PETITION'">
					<xsl:value-of select="$vdCompanyName"/>			
				</xsl:when>
                                <xsl:when test="$vdCaseType ='COMPANY ADMIN ORDER'">
					<xsl:value-of select="$vdCompanyName"/>			
				</xsl:when>
			</xsl:choose>
		</div>
		<div style="font-weight: bold;">
			ADDRESS
		</div>
		
		<div style="margin-bottom: 0.4cm;">
			<xsl:choose xmlns="http://eds.com/supsfo">
			<xsl:when test="$vdCaseType='CREDITORS PETITION'">
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of select="$vdDebtorAddress"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$vdCaseType='DEBTORS PETITION'">
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of select="$vdDebtorAddress"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$vdCaseType ='WINDING UP PETITION'">
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of select="$vdCompanyAddress"/>	
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
                        <xsl:when test="$vdCaseType ='COMPANY ADMIN ORDER'">
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of select="$vdCompanyAddress"/>	
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			</xsl:choose>
		</div>
		
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			 PROCEEDINGS ISSUED
			<xsl:choose xmlns="http://eds.com/supsfo">
				<xsl:when test="$vdCaseType='CREDITORS PETITION'">
					BANKRUPTCY
				</xsl:when>
				<xsl:when test="$vdCaseType='DEBTORS PETITION'">
					BANKRUPTCY
				</xsl:when>
				<xsl:when test="$vdCaseType ='WINDING UP PETITION'">
					WINDING UP
				</xsl:when>
                                <xsl:when test="$vdCaseType ='COMPANY ADMIN ORDER'">
					COMPANY ADMINISTRATION ORDER
				</xsl:when>
			</xsl:choose>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:choose xmlns="http://eds.com/supsfo">
			    <xsl:when test="string-length(variabledata/claim/insolvencynumber) &gt; 0">
					<span xmlns="" style="font-weight: bold;">INSOLVENCY NUMBER</span>  <xsl:value-of select="substring($vdInsolvencyNumber,1,4)"/> of <xsl:value-of select="substring($vdInsolvencyNumber,5,4)"/> 
				</xsl:when>
				<xsl:otherwise>
					<span xmlns="" style="font-weight: bold;">NUMBER</span>  <xsl:value-of select="$vdClaimNumber"/>
				</xsl:otherwise>
			</xsl:choose>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">DATE ISSUED</span>  <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEventDate"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">HEARING DATE</span>  <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate1"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">AT</span>  <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>
		</div>
		<div style="margin-bottom: 2.0cm;"> </div>
				
		<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdName"/></div>
		<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSection"/> Section</div>
		<div>Ext <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdExtension"/></div>
		
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>