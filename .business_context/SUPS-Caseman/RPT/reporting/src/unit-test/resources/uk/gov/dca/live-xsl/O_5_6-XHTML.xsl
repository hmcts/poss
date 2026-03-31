<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100AD"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 1.0cm;"/>
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			On <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudgmentDate"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> 
		</div>
		<div style="margin-bottom: 0.4cm;">
			sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>. 
		</div>
		<div style="margin-bottom: 0.4cm;">
			considered the application and the award made to the applicant on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAwardDate"/> by the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdBodyName"/> under reference <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdBodyReference"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">and the court orders </span>that
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">1. </span>The applicant may enforce the award in this court.
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">2. </span>The respondent pay the applicant's costs of the application, which are to be added to the amount unpaid under the award.
		</div>
		<div style="margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">3. </span>The amount enforceable is:
		</div>
		<div style="margin-bottom: 0.4cm;">
			<table style="font-family: Times;">
				<col width="151.2"/>
				<col width="340.2"/>
				<col width="86.93999999999998"/>
				<tbody>
					<tr>
						<td/>
						<td>
							<div>Unpaid under the award </div>
						</td>
						<td>
							<div style="text-align: right;">£<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAwardUnpaid"/></div>
						</td>
					</tr>
					<tr>
						<td/>
						<td>
							<div><span style="font-style: italic;">(including interest)</span></div>
						</td>
						<td>
							<div/>
						</td>
					</tr>					
					<tr>
						<td/>
						<td>
							<div>Court Fee</div>
						</td>
						<td>
							<div style="text-align: right;">£<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAwardCourtFee"/></div>
						</td>
					</tr>
					<tr>
						<td/>
						<td>
							<div> </div>
						</td>
						<td>
							<div> </div>
						</td>
					</tr>					
					<tr>
						<td/>
						<td>
							<div>Solicitor's costs</div>
						</td>
						<td>
							<div style="text-align: right;">£<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAwardSolicitorCosts"/></div>
						</td>
					</tr>
					<tr>
						<td/>
						<td>
							<div> </div>
						</td>
						<td>
							<div> </div>
						</td>
					</tr>						
					<tr>
						<td/>
						<td style="padding-right: 1.0cm;">
							<div style="font-weight: bold; text-align: right;"/>
						</td>
						<td>
							<div>______________</div>
						</td>
					</tr>
					<tr>
						<td/>
						<td style="padding-right: 1.0cm;">
							<div style="font-weight: bold; text-align: right;">Total</div>
						</td>
						<td>
							<div style="text-align: right;">£<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdTotalAmount"/></div>
						</td>
					</tr>
					<tr>
						<td/>
						<td style="padding-right: 1.0cm;">
							<div style="font-weight: bold; text-align: right;"/>
						</td>
						<td>
							<div>______________</div>
						</td>
					</tr>					
				</tbody>
			</table>	
		</div>
		<div>
			together with any further interest becoming due.
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>