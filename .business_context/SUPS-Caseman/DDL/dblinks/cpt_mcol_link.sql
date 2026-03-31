/*-------------------------------------------------------------------------------
|
| $HeadURL$:     
| 
| PACKAGE       : cpt_mcol_link
| SYNOPSIS      : This script creates an Oracle database link
|               : between the CASEMAN database and the MCOL CPC staging
|               : database.
|
|               Prerequisite:   The ORACLE CONNECTION MANAGER must have 
|                               been installed on the Interoperabilty server
|                               and configured act as a proxy routing connections 
|                               to the MCOL CPC staging server
|
| $Author$:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) CGI.
|                 This file contains information which is confidential and of
|                 value to CGI. It may be used only for the specific purpose for
|                 which it has been provided. CGI's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : The user will be prompted to supply value for the variables
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id:  $         Revision at last change
|
--------------------------------------------------------------------------------*/

/* link renamed to cpt_mcol_link */
CREATE DATABASE LINK cpt_mcol_link
   CONNECT TO &CPC_USERNAME
   IDENTIFIED BY &CPC_PASSWORD
   USING '&MCOL_CPC_HOST';