<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10095"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> has considered the statements of case and allocation questionnaires filed and allocated the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAllocation"/> 
			to the <span style="font-weight: bold;">small claims track.</span>
		</div>
		<div style="margin-bottom: 0.4cm;">
			The judge proposes to deal with the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAllocation"/> without a hearing, that is, on papers alone but can only do this if all parties agree.
		</div>
		<div style="margin-bottom: 0.4cm;">
		Please tell the court whether or not you agree to your case being dealt with in this way by completing the lower half of this form and returning a copy to the court on or 
		before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFormCompleteDate"/>. You must at the same time send a copy of it to all other parties.
		</div>	
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>