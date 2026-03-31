<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10092"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 0.8cm;"/>
		<div style="font-weight: bold; margin-bottom: 0.4cm; font-size: 12pt;">
			In Bankruptcy
		</div>
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			To the Official Receiver of the Court
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:call-template xmlns="http://eds.com/supsfo" name="format-address-multi-line">
				<xsl:with-param name="party">
					<xsl:copy-of select="$vdUnFormattedReceiverAddress"/>
				</xsl:with-param>
			</xsl:call-template>
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOfficialReceiverPartyTelephone"/>
		</div>
		<div>
			Order pronounced this day by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			for Winding up the under-mentioned company under the Insolvency Act 1986
		</div>
		<div>
			Name of Company:
		</div>
		<div style="margin-left: 1cm; margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectName"/>
		</div>
		<div>
			Registered office of company:
		</div>
		<div style="margin-left: 1cm; margin-bottom: 0.4cm;">
			<xsl:call-template xmlns="http://eds.com/supsfo" name="format-address-multi-line">
				<xsl:with-param name="party">
					<xsl:copy-of select="$vdCompanyAddress"/>
				</xsl:with-param>
			</xsl:call-template>
		</div>
		<div>
			<xsl:choose xmlns="http://eds.com/supsfo">
				<xsl:when test="$vdPetitionerHasSolicitor = 'Y' ">
					Solicitor's
				</xsl:when>
				<xsl:otherwise>
					Petitioner's
				</xsl:otherwise>
			</xsl:choose>
		</div>
		<div style="margin-left: 1cm; margin-bottom: 0.4cm;">
			<xsl:choose xmlns="http://eds.com/supsfo">
				<xsl:when test="$vdPetitionerHasSolicitor = 'Y' ">
					<xsl:call-template name="format-address-multi-line">
						<xsl:with-param name="party">
							<xsl:copy-of select="$vdPetitionerSolAddress"/>
						</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="format-address-multi-line">
						<xsl:with-param name="party">
							<xsl:copy-of select="$vdPetitionerAddress"/>
						</xsl:with-param>
					</xsl:call-template>
				</xsl:otherwise>
			</xsl:choose>												
		</div>
		<xsl:choose xmlns="http://eds.com/supsfo">
			<xsl:when test="$vdPetitionerHasSolicitor = 'Y' ">
				<div xmlns="" style="margin-left: 1cm;">
					Tel: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPetitionerSolTelephone"/>
				</div>
				<div xmlns="" style="margin-left: 1cm; margin-bottom: 0.4cm;">
					Ref: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPetitionerSolReference"/>
				</div>
			</xsl:when>
			<xsl:otherwise>
				<div xmlns="" style="margin-left: 1cm;">
					Tel: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPetitionerTelephone"/>
				</div>
				<div xmlns="" style="margin-left: 1cm; margin-bottom: 0.4cm;">
					Ref: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPetitionerReference"/>
				</div>
			</xsl:otherwise>
		</xsl:choose>
		<div style="margin-bottom: 0.4cm;">
			Date of Presentation of petition: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPetitionDate"/>
		</div>
		<div>
			Dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderDate"/>			
  		</div>

	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>