<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100A7"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.8cm;"/>
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOHearingAttendees"/>
		</div>
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			IT IS ORDERED that
		</div>
		<div style="margin-bottom: 0.4cm;">
			this Administration Order made on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCODate"/> be set aside
		</div>
		
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdHearingDate1 != $emptyDate">
			<div xmlns="" style="margin-bottom: 0.4cm;">
				the application for an Administration Order be listed for hearing
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
				at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
				on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate"/>
			</div>
			<div xmlns="" style="margin-bottom: 0.4cm;">
				at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/>
			</div>
		</xsl:if>
		<div style="margin-bottom: 0.4cm;">
			when the court will consider the objection of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdObjector"/>.
		</div>		
		<div style="text-align: right; margin-bottom: 1.2cm;">
			<span style="font-weight: bold;">Dated </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEventDate"/>
		</div>
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdOrderMade2 != 'Y'">
			<div xmlns="">
				<table>
					<col width="728.784"/>
					<tbody>
						<tr>
							<td style="padding-left: 0.2cm; padding-right: 0.2cm; border-style: solid; border-width: 0.02cm;">
								<div style="font-weight: bold; text-align: center;">
									Notice to parties
								</div>
								<div style="font-weight: bold;">
									This order was made by the court of its own initiative.  Any party affected by it has the right to apply to have the order set aside, varied or stayed, but the application must be received by the court within 7 days of the date of service of this order.
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</xsl:if>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>