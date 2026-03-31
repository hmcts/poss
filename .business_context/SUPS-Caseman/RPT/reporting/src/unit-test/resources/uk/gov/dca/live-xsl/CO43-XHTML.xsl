<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1009F"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.8cm;"/>
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			The administration order made on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCODate"/> is to be reviewed by the court
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdReviewRequester"/>
		</div>
		<div style="margin-bottom: 0.8cm;">
			<table>
				<col width="728.784"/>
				<tbody>
					<tr>
						<td style="padding-top: 0.2cm; padding-bottom: 0.2cm; padding-left: 0.2cm; padding-right: 0.2cm; border-style: solid; border-width: 0.02cm;">
							<table>
								<col width="710.64"/>
									<tbody>
										<tr>
											<td style="padding-bottom: 0.4cm;">				
												<div>
													<span style="font-weight: bold;">Take notice that </span>this matter will be heard at
												</div>
											</td>
										</tr>
										<tr>
											<td style="padding-bottom: 0.4cm;">
												<div>
													<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingCourtAddress"/>
												</div>
											</td>
										</tr>
										<tr>
											<td style="padding-left: 0.5cm; padding-bottom: 0.4cm;">
												<div>
													on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingDate"/>
												</div>															
											</td>
										</tr>
										<tr>
											<td style="padding-left: 0.5cm; padding-bottom: 0.4cm;">
												<div>
													at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingTime"/>
												</div>															
											</td>
										</tr>
										<tr>
											<td style="padding-bottom: 0.4cm;">
												<div>
													when the court will review the administration order
												</div>															
											</td>
										</tr>
									</tbody>								
							</table>						
						</td>												
					</tr>
				</tbody>
			</table>
		</div>
		<div style="text-align: right; margin-bottom: 0.4cm;">
			<span style="font-weight: bold;">Dated </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEventDate"/>
		</div>
		<div style="margin-bottom: 0.4cm; font-weight: bold;">
			To the debtor
		</div>
		<table>
		<col width="728.784"/>
		<tbody>
		<tr>
		<td style="padding-left: 0.5cm;">		
		<div>
			<div><table width="100%"><colgroup><col width="20" align="center" valign="top"/><col/></colgroup><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.2cm;">
						If the review is being held at your request (or because you object to the court's intention to revoke the order) you must attend the court on the above date.  If you do not attend the order may be revoked.
					</div></td></tr><tr style="margin-bottom: 0.2cm;"><td style="width: 12;">•</td><td><div>
						If the review is being held at the direction of the court or a creditor, it is in your best interest to attend the court on the above date.
					</div></td></tr></table></div>
		</div>
		</td>
		</tr>
		</tbody>
		</table>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>