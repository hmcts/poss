<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1008F"><div><font size="4" face="Times New Roman">
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdAllPartiesAgree = 'true'">
			<div xmlns="" style="margin-bottom: 0.4cm;">All parties having agreed</div>
		</xsl:if>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> orders that this <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimCounterClaimBoth"/> is stayed until <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDateStayedUntil"/> to enable the parties to attempt settlement.
		</div>
		<div style="margin-bottom: 0.4cm;">
			On or before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFDExpiryDate"/> one of the following steps must be taken:
		</div>
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			either
		</div>
		<div style="margin-bottom: 0.4cm;">
			the claimant must notify the court that the whole of the claim has been settled; (see note(i) below)
		</div>
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			or
		</div>
		<div style="margin-bottom: 0.4cm;">
			the claimant or defendant must write to the court requesting an extension of the stay period, explaining the steps being taken towards settlement 
			and identifying any mediator, expert, or other person helping with the process.
		</div>
		<div style="margin-bottom: 0.4cm;">
			The letter should confirm the agreement of all the other parties. (see note(ii) below)
		</div>
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			or
		</div>
		<div style="margin-bottom: 0.4cm;">
			all the parties must file a completed allocation questionnaire at the court. Where a settlement of some of the issues in dispute has been reached, a list 
			of those issues should be attached to the completed questionnaire. The list must be agreed with the other parties and must indicate that it has been agreed.
		</div>
		<div style="margin-bottom: 0.4cm;">
			Date <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdReceiptDate"/>
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>