<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100C2"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.8cm; margin-top: 1.2cm;"/>
		<div>
			<span style="font-weight: bold;">TAKE NOTICE</span> that this action having been set down for trial at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdUserCourtName"/>.
		</div>
		<div style="margin-bottom: 0.4cm;">
			on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate1"/> at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/>.
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">THE DISTRICT JUDGE</span> has directed that this matter be transferred to the Technology and Construction Court and that the file be forwarded to the Listing Officer at the Crown Court,
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdUserCourtAddress"/> to whom all future correspondence should be sent.
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">Dated </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEventDate"/>
		</div>
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			ALL COMMUNICATIONS SHOULD BE ADDRESSED TO <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdUserCourtAddress"/>
		</div>
		<div style="font-weight: bold;">
			PLEASE NOTE:-
		</div>
		<div style="margin-bottom: 0.4cm;">
			The above setting down number <span style="font-weight: bold;">MUST BE QUOTED IN ALL FUTURE CORRESPONDENCE WITH THE COURT</span>
		</div>
		<div>
			It is the duty of all parties to inform the Court of likely settlements or of the action having been settled or withdrawn (including an acceptance of monies paid into Court)
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>