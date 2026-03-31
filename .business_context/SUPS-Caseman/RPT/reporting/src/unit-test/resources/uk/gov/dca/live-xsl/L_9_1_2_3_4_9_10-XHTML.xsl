<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1002E"><div><font size="4" face="Arial">
		<div style="margin-bottom: 0.4cm;">Dear <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGreeting"/></div>
		<div style="margin-bottom: 0.4cm; font-size: 12pt; font-weight: bold; text-align: center;">Re: Case Number: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimNumber"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdInstigatorName"/> v <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectName"/>
		</div>		
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSelectLetter2"/>: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdExaminationNo"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSelectLetter2Para1"/>
		</div>
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			AND
		</div>
						
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdletterselectvalue=1 or $vdletterselectvalue=2">			
			<div xmlns="" style="margin-bottom: 0.8cm;">
			The  
			<xsl:choose xmlns="http://eds.com/supsfo">
				<xsl:when test="$vdletterselectvalue=1">
					examinee 
				</xsl:when>
				<xsl:otherwise>
					officer 
				</xsl:otherwise>
			</xsl:choose>
				has offered to pay <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOfferAmount"/>. If you agree to the rate of repayment, 
				write to the court and the court will make a 
			<span style="font-weight: bold;">varied order</span>
			(order with new terms of repayment). You do not have to accept the examinee's offer.			
			</div>
		</xsl:if>
		
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdletterselectvalue &gt; 0 and 5 &gt; $vdletterselectvalue">		
			<div xmlns="" style="margin-bottom: 0.8cm;">			
				<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOffer"/> you can use the information given in the questionnaire to decide whether it is 
				worth enforcing your judgment against the examinee and, if so, which method of enforcement is 
				likely to be the most effective. You can find further information in the leaflet "I have a judgment, but 
				the defendant hasn't paid" (available free from any County Court office).
			</div>
		</xsl:if>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdletterselectvalue=5 or $vdletterselectvalue=6">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				States that:
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
				<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdReasonsNonService"/>
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
				If you have any further information which would help the bailiff, for example, a description of the 
				<xsl:choose xmlns="http://eds.com/supsfo">
					<xsl:when test="$vdletterselectvalue=5">
						officer
					</xsl:when>
					<xsl:otherwise>
						examinee 
					</xsl:otherwise>
				</xsl:choose>
				or details of his/her movements, you can ask the court to re-issue the order by completing form N446 (request
				to re-issue post-judgment process (other than warrant)).
			</div>
			<div xmlns="" style="margin-bottom: 0.8cm;">
				You may serve the order yourself. If you wish to do so, tell the court which will arrange a new examination and
				send the order to you to serve. If you serve the order, you must send the court an affidavit (sworn statement)
				(form N215) stating when and where you served it. A copy of the order must be attached to the affidavit when you
				return it to the court.
			</div>
		</xsl:if>
		<div style="margin-bottom: 1.5cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdLetterEnding"/></div>
		<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdName"/></div>
		<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSection"/> Section</div>
		<div>Ext <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdExtension"/></div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>