<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N116FD"><div><font size="3" face="Times New Roman">
				<div style="margin-bottom: 0.4cm;">
					TAKE NOTICE that <xsl:if xmlns="http://eds.com/supsfo" test="$vdInterimChargingOrderDate2 != $emptyDate">pursuant to the order dated <xsl:value-of select="$vdInterimChargingOrderDate2"/> </xsl:if> the court has today sent a request for investment decision to the Court Funds Office.
                 </div>
				<div>
					Further enquiries about the investment should be made to Court Funds Office, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCFOAddressLine"/> (<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCFODXNumber"/>).  Telephone <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCFOTelephone"/>
				</div>
			</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>