<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10074"><div><font size="4" face="Times New Roman">
		<div style="margin-top: 0.8cm; margin-bottom: 0.4cm; font-weight: bold;">
			To the District Judge
		</div>
		<div style="margin-bottom: 0.4cm;">
			I apply for an order for leave to serve the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectPartyRoleLower"/> with the attached <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdTypeOfProcess"/> by substituted service through the letter box at the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectPartyRoleLower"/>'s
			address, having been unable to serve the process personally.
		</div>
		<div style="margin-bottom: 0.4cm;">
			I have visited the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectPartyRoleLower"/>'s address on the following days and times:-
		</div>
		<div style="margin-bottom: 0.4cm;">
			<table style="border-style: solid;">
				<col width="161.784"/>
				<col width="189"/>
				<col width="378"/>
				<tbody style="border-style: solid;">
					<tr style="border-style: solid;">
						<td style="border-style: solid; border-width: 0.02cm;">
							<div>Date</div>
						</td>
						<td style="border-style: solid; border-width: 0.02cm;">
							<div>Time</div>
						</td>
						<td style="border-style: solid; border-width: 0.02cm;">
							<div>Result of visit</div>
						</td>
					</tr>
						<xsl:copy-of xmlns="http://eds.com/supsfo" select="$vdBailiffVisitTable"/>
				</tbody>
			</table>
		</div>
		<div style="margin-bottom: 0.4cm;">
			I believe that the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectPartyRoleLower"/> lives at the address because:-
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdBailiffVisitReason"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			On the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdLetterLeftDate"/> I left a letter, a copy of which is attached, at the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectPartyRoleLower"/>'s address asking the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSubjectPartyRoleLower"/> to contact me within seven days
			to arrange an appointment for the process to be served. There has been no reply to that letter.
		</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>