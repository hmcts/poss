<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1002E"><div><font size="4" face="Arial">
		<div style="margin-bottom: 0.4cm;">Dear <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGreeting"/></div>
		<div style="margin-bottom: 0.4cm; font-size: 12pt; font-weight: bold; text-align: center;">Re: Case Number: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimNumber"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimantName"/> v <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDefendant1Name"/>
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdSelectLetter = '1'">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				Receipt of your Bill of Costs in this matter is acknowledged. Please note the Bill has been given the following number: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdBillOfCostsNumber"/>.
			</div>
			<div xmlns="" style="margin-bottom: 0.8cm;">
				This number <span style="font-weight: bold;">MUST</span> be quoted in all future correspondence. The Court will not be able to trace your papers without it. I thank you for your co-operation in this matter. 
			</div>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdSelectLetter = '2'">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				I regret the need to return your correspondence dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCorrespondanceDate"/>, however I am unable to trace your bill/bundle from the information provided.
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
				Please return your correspondence with as much of the following information as possible to enable us to answer your enquiry. 
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
				1.   The bill number. 
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
				2.   The date the bill/bundle was originally submitted to the Court. 
			</div>
			<div xmlns="" style="margin-bottom: 0.8cm;">
				3.   The date of any hearing regarding the taxation. 
			</div>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdSelectLetter = '3'">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				Bill Number: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdBillOfCostsNumber"/>
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
				I refer to your letter dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCorrespondanceDate"/> and can confirm that the taxation hearing on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSelectHearingDate"/> has now been vacated, and our records marked "bill settled". 
			</div>
			<div xmlns="" style="margin-bottom: 0.8cm;">
				I return your Bill of Costs, together with any supporting documents. 
			</div>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdSelectLetter = '4'">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				Bill Number: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdBillOfCostsNumber"/>
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
				I enclose your taxed Bill of Costs in the above case. However I have retained your bundle of documents and would ask that you make arrangements to collect them by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCollectedByDate"/>
				. Due to a restriction on the amount of storage space available, we will have no alternative but to destroy files which are not collected within the time allowed, unless notified otherwise.
			</div>
			<div xmlns="" style="margin-bottom: 0.8cm;">
				Please quote the Bill Number when collecting your papers. 
			</div>
		</xsl:if>
		<div style="margin-bottom: 1.5cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdLetterEnding"/></div>
		<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdName"/></div>
		<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSection"/> Section</div>
		<div>Ext <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdExtension"/></div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>