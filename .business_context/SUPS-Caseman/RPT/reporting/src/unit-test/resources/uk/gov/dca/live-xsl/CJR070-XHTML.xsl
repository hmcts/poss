<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1008A"><div><font size="4" face="Times New Roman">
		<div style="margin-top: 1.0cm; margin-bottom: 0.6cm;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>,  <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.6cm;">
			<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdHearingAttendees"/>
		</div>
		<div style="margin-bottom: 0.6cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> orders that this <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimCounterClaimBoth"/> be further stayed until <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDateStayedUntil"/> to allow the parties to continue their attempts to settle.
		</div>
		<div style="margin-bottom: 0.6cm;">
			On or before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFDExpiryDate"/> one of the following steps must be taken:
		</div>
		<div style="font-weight: bold; margin-bottom: 0.6cm;">
			either
		</div>
		<div style="margin-bottom: 0.6cm;">
			the claimant must notify the court that the whole of the claim has been settled; (see note (i) below)
		</div>
		<div style="font-weight: bold; margin-bottom: 0.6cm;">
			or
		</div>
		<div style="margin-bottom: 0.6cm;">
			the claimant or defendant must write to the court requesting a further extension of the stay period, explaining the steps being taken towards settlement 
			and identifying any mediator, expert, or other person helping with the process.  The letter should confirm the agreement of all the other parties. (see note (ii) below)
		</div>
		<div style="font-weight: bold; margin-bottom: 0.6cm;">
			or
		</div>
		<div style="margin-bottom: 0.6cm;">
			all the parties must file a completed allocation questionnaire at the court. Where a settlement of some of the issues in dispute has been reached, a list 
			of those issues should be attached to the completed questionnaire. The list must be agreed with the other parties and must indicate that it has been agreed.
		</div>
		<div>
			Date <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdReceiptDate"/>
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>