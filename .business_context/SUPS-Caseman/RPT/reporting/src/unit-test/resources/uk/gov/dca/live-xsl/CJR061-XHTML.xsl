<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100C7"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">On</span> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentDate"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			considered the application of the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderApplicant"/> and found that the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderClaimantDefendant"/> has acted in an anti-social manner
			that caused or was likely to cause harassment, alarm or distress to one or more persons not of the same household
			as <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHimselfHerself"/> and that this order is necessary to protect persons from further anti-social acts by the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderClaimantDefendant"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">and the court ordered</span> that 
		</div>
		<div style="margin-bottom: 0.4cm;">
			The <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderClaimantDefendant"/> is forbidden from:-
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdProhibitedActivity"/>
		</div>
		<xsl:choose xmlns="http://eds.com/supsfo">
			<xsl:when test="$vdDateOrderExpires != $emptyDate"><div xmlns="" style="margin-bottom: 0.4cm;">until <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDateOrderExpires"/></div></xsl:when>
			<xsl:otherwise><div xmlns="" style="margin-bottom: 0.4cm;">until further notice</div></xsl:otherwise>
		</xsl:choose>
		<div style="margin-bottom: 0.4cm;">
			The <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderApplicant"/> or <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOrderClaimantDefendant"/> may apply to the court for this order to be varied or discharged.
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdOrderWithoutNotice != 'Y'">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				Unless both parties consent, this order may not be discharged within two years of the order being served.
			</div>
		</xsl:if>
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			To <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectName"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			You must obey this order.  If, without reasonable excuse, you do anything which you are forbidden from doing by this order, you will be liable on conviction to a term of imprisonment not exceeding five years or to a fine or to both.
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdHearingCourtAddress != $emptyAddress">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				Notice of further hearing (see also note below)
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
				The court will re-consider the application and whether the order should continue at a further hearing
			</div>
			<div xmlns="">
				at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
				on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate1"/> at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/>
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
				If you do not attend at the time shown the court may make an order in your absence.
		</div>
		</xsl:if>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>