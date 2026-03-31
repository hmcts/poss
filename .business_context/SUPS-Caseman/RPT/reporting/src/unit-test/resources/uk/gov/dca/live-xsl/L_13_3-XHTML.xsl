<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100C1"><div><font size="2" face="Times New Roman">
			<div style="font-size: 12pt;">
				<div style="margin-bottom: 0.8cm;"/>
			
		
				<div style="margin-bottom: 0.8cm;">
				We agreed how you would pay the warrant but you have not kept to that agreement
				</div>
		
				<div style="margin-bottom: 0.8cm;">
				Unless you pay the amount of £<span class="SupsFoCursor" id="SupsFoCursor">Enter Oustanding Amount here.</span><br/> to the court office before:-
				</div>
		
		
				<div style="margin-bottom: 0.8cm;">
					<table>
						<col width="378"/>
						<tbody>
							<tr>
								<td style="padding-left: 0.1cm; padding-right: 0.1cm; border-style: solid; border-width: 0.02cm;">
									<div style="margin-top: 0.2cm; margin-bottom: 0.2cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdWarrantPaymentDue"/></div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>		
		
				<div style="margin-bottom: 1.5cm;">
				your goods <span style="font-weight: bold;">will be removed and sold.</span>
				</div>
		
				<div style="text-align: right;">Date <xsl:value-of xmlns="http://eds.com/supsfo" select="$datetoday"/></div>
				
				<div style="margin-bottom: 2.0cm;"/>
				<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdBailiffName"/></div>
				<div>Bailiff</div>				
				<div>Telephone <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdBailiffTelephone"/> between <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdBailiffAvailability"/></div>
				<div style="margin-bottom: 4cm;"/>	
			</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>