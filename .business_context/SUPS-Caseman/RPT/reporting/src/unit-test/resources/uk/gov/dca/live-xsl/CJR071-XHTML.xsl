<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1008F"><div><font size="4" face="Times New Roman">
		<div style="margin-top: 0.8cm; margin-bottom: 0.8cm;">
			The parties to this <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimCounterClaimBoth"/> having failed either to file completed questionnaires by the date required, or to inform the court that the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimCounterClaimBoth"/> has been settled.
		</div>
		<div style="margin-bottom: 0.8cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> orders that this <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimCounterClaimBoth"/> be struck out unless the parties file completed allocation questionnaires with the court on or before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAllocationQuestionaireFileDate"/>.	
		</div>
		<div>
			Date <xsl:value-of xmlns="http://eds.com/supsfo" select="$datetoday"/>
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>