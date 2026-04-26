REM Local Machine Values
REM --------------------
PATH=C:\Program Files\Logica_CCCIS\Common;C:\Program Files\CA\eTrust\Antivirus\;%PATH%
set cdrom_disk_drive=D:\
set floppy_disk_drive=A:\

REM Set Application Variables
REM -------------------------
set app_id=ccbc
set app_title=CCBC
REM Do you want to remove C/Rs and N/Ls?  (0=No, 1=Yes)
set REMOVE_NLS_AND_CRS=0
REM Do you want to have upper or lower case file names? (0=Lower, 1=Upper, blank=no change)
SET FILENAMES_TO_UPPER_CASE=0

REM Media Centre Values
REM -------------------
set ftp_server_ip=10.100.198.11
set ftp_live_user_name=ccbcbatch
set ftp_live_user_password=ccbcbatchmc
set remote_staging_dir=/staging/disk
set remote_final_dir=/staging/diskprep

REM EDI Server Values
REM -----------------
set edi_server_ip=10.16.1.10
set edi_cat_user_name=anonymous
set edi_cat_user_password=cpc_ops_pc@moj.goc.uk
set remote_cat_edi_dir=/editest

mainmenu.bat