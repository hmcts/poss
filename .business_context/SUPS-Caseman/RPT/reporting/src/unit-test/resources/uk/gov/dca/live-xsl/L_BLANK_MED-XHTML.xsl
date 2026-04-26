<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10035"><div><font size="4" face="Arial">
		<div style="margin-bottom: 0.4cm;">Dear <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGreeting"/></div>
		
		<!-- Added Insolvency Number block -->
		<xsl:choose xmlns="http://eds.com/supsfo">
			<xsl:when test="string-length(variabledata/claim/insolvencynumber) &gt; 0">
				<div xmlns="" style="margin-bottom: 1.5cm; font-size: 12pt; font-weight: bold; text-align: center;">Re: <xsl:value-of xmlns="http://eds.com/supsfo" select="substring($vdInsolvencyNumber,1,4)"/> of <xsl:value-of xmlns="http://eds.com/supsfo" select="substring($vdInsolvencyNumber,5,4)"/> 
					<xsl:choose xmlns="http://eds.com/supsfo">
						<xsl:when test="string-length(variabledata/aeeventid) &gt;0">
							<xsl:value-of select="$vdAeJudgmentCreditor"/> v <xsl:value-of select="$vdAeJudgmentDebtor"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:choose>
								<xsl:when test="$vdCaseType = 'APP TO SET STAT DEMD'">
									<xsl:value-of select="$vdApplicantName"/>
								</xsl:when>
								<xsl:when test="$vdCaseType = 'CREDITORS PETITION'">
									<xsl:value-of select="$vdDebtorName"/>
								</xsl:when>
								<xsl:when test="$vdCaseType = 'DEBTORS PETITION' or $vdCaseType='APP ON DEBT PETITION'">
									<xsl:value-of select="$vdDebtorName"/>				
								</xsl:when>	
								<xsl:when test="$vdCaseType = 'APP INT ORD (INSOLV)'">
									<xsl:value-of select="$vdDebtorName"/>				
								</xsl:when>				
								<xsl:when test="$vdCaseType = 'WINDING UP PETITION'">
									<xsl:value-of select="$vdCompanyName"/> 				
								</xsl:when>
                                                                <xsl:when test="$vdCaseType = 'COMPANY ADMIN ORDER'">
									<xsl:value-of select="$vdCompanyName"/> 				
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="$vdClaimantName"/> v <xsl:value-of select="$vdDefendant1Name"/> 				
								</xsl:otherwise>
							</xsl:choose>					
						</xsl:otherwise>
					</xsl:choose>
				</div>	
			</xsl:when>
			<xsl:otherwise>
				<div xmlns="" style="margin-bottom: 1.5cm; font-size: 12pt; font-weight: bold; text-align: center;">Re: Case Number: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimNumber"/> 
					<xsl:choose xmlns="http://eds.com/supsfo">
						<xsl:when test="string-length(variabledata/aeeventid) &gt;0">
							<xsl:value-of select="$vdAeJudgmentCreditor"/> v <xsl:value-of select="$vdAeJudgmentDebtor"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:choose>
								<xsl:when test="$vdCaseType = 'APP TO SET STAT DEMD'">
									<xsl:value-of select="$vdApplicantName"/>
								</xsl:when>
								<xsl:when test="$vdCaseType = 'CREDITORS PETITION'">
									<xsl:value-of select="$vdDebtorName"/>
								</xsl:when>
								<xsl:when test="$vdCaseType = 'DEBTORS PETITION' or $vdCaseType='APP ON DEBT PETITION'">
									<xsl:value-of select="$vdDebtorName"/>				
								</xsl:when>	
								<xsl:when test="$vdCaseType = 'APP INT ORD (INSOLV)'">
									<xsl:value-of select="$vdDebtorName"/>				
								</xsl:when>				
								<xsl:when test="$vdCaseType = 'WINDING UP PETITION'">
									<xsl:value-of select="$vdCompanyName"/> 				
								</xsl:when>
                                                                <xsl:when test="$vdCaseType = 'COMPANY ADMIN ORDER'">
									<xsl:value-of select="$vdCompanyName"/> 				
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="$vdClaimantName"/> v <xsl:value-of select="$vdDefendant1Name"/> 				
								</xsl:otherwise>
							</xsl:choose>					
						</xsl:otherwise>
					</xsl:choose>
				</div>	
			</xsl:otherwise>
		</xsl:choose>
		
		<xsl:if xmlns="http://eds.com/supsfo" test="string-length(variabledata/order/coorder/conumber) &gt; 0">
			<div xmlns="" style="margin-bottom: 1.5cm; font-size: 12pt; font-weight: bold; text-align: center;">Re: AO/CAEO Number: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCONumber"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOCreditorName"/> v <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCODebtorName"/>
			</div>	
		</xsl:if>		
		<div style="margin-bottom: 0.4cm;">
			<span class="SupsFoCursor" id="SupsFoCursor">Start adding text here.</span><br/>
		</div>
		<div style="margin-bottom: 1.5cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdLetterEnding"/>,</div>
		<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdName"/></div>
		<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSection"/> Section</div>
		<div>Ext <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdExtension"/></div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>