<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100BE"><div><font size="2" face="Times New Roman">
		<div style="margin-bottom: 0.4cm;"/>
		<div style="margin-bottom: 0.4cm;">
			The Accountant General is informed that on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCaseTransferDate"/>.
		</div>
		<div style="margin-bottom: 0.4cm;">
			the above action was transferred from: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdTransferFromCourtName"/>,
			<xsl:call-template xmlns="http://eds.com/supsfo" name="format-address-single-line">
				<xsl:with-param name="theAddress">
					<xsl:value-of select="$vdTransferFromCourtAddress"/>
				</xsl:with-param>
			</xsl:call-template>
		</div>
		<div style="margin-bottom: 0.4cm;">
			and I request you to transfer the sum of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdTransferAmount"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			lodged in this action to an account for this Court.
		</div>
		<div>
			Signed........................................................................................
		</div>
		<div style="margin-bottom: 0.4cm; margin-left: 2cm;">
			Court Manager/Proper Officer.
		</div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>