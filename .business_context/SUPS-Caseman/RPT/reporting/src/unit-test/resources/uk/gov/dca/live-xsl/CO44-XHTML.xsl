<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100A4"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.8cm;"/>
		<div style="font-weight: bold;">
			To the debtor
		</div>
		<div style="font-weight: bold;">
			You have failed to pay the sums due in accordance with the administration order made on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCODate"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			There are currently <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOPaymentsMissed"/> instalments outstanding, amounting in total to £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOBalance"/>
		</div>
		<div style="font-weight: bold; margin-bottom: 0.2cm;">
			The administration order will be revoked unless within 16 days of the date shown on the postmark you either:
		</div>
		<div style="margin-bottom: 0.4cm;">
			<table>
			<col width="728.784"/>
			<tbody>
			<tr>
			<td style="padding-left: 0.8cm; padding-right: 0.2cm;">
			<div><table width="100%"><colgroup><col width="20" align="center" valign="top"/><col/></colgroup><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.2cm;">
						make the payments due under the order (total shown above) or
					</div></td></tr><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.2cm;">
						explain your reasons for failing to make payments and make a proposal to pay the outstanding sum (in addition to the instalments ordered) or
					</div></td></tr><tr><td style="width: 12;">•</td><td><div style="margin-bottom: 0.2cm;">
						make a request to the court to vary the rate of payment ordered
					</div></td></tr></table></div>
			</td>
			</tr>
			</tbody>
			</table>
		</div>
		<div style="margin-bottom: 0.4cm;">
			Give your reasons for failing to make payments below (together with any proposals you wish to make for future payment)
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>