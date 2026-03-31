-- =====================================================================================================================
-- Copyrights and Licenses
--
-- Copyright (c) 2016 by the Ministry of Justice. All rights reserved.
-- Redistribution and use in source and binary forms, with or without modification, are permitted
-- provided that the following conditions are met:
-- - Redistributions of source code must retain the above copyright notice, this list of conditions
-- and the following disclaimer.
-- - Redistributions in binary form must reproduce the above copyright notice, this list of
-- conditions and the following disclaimer in the documentation and/or other materials
-- provided with the distribution.
-- - All advertising materials mentioning features or use of this software must display the
-- following acknowledgment: "This product includes CaseMan (County Court management system)."
-- - Products derived from this software may not be called "CaseMan" nor may
-- "CaseMan" appear in their names without prior written permission of the
-- Ministry of Justice.
-- - Redistributions of any form whatsoever must retain the following acknowledgment: "This
-- product includes CaseMan."
-- This software is provided "as is" and any expressed or implied warranties, including, but
-- not limited to, the implied warranties of merchantability and fitness for a particular purpose are
-- disclaimed. In no event shall the Ministry of Justice or its contributors be liable for any
-- direct, indirect, incidental, special, exemplary, or consequential damages (including, but
-- not limited to, procurement of substitute goods or services; loss of use, data, or profits;
-- or business interruption). However caused any on any theory of liability, whether in contract,
-- strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this
-- software, even if advised of the possibility of such damage.
--
-- $Id: drop_functions_procedures_triggers.sql 13065 2009-12-14 11:49:01Z lowtherr $
-- $LastChangedRevision: 13065 $
-- $LastChangedDate: 2009-12-14 11:49:01 +0000 (Mon, 14 Dec 2009) $
-- $LastChangedBy: lowtherr $
-- =====================================================================================================================

-- This script revomes all triggers

whenever sqlerror exit failure

declare
    cursor c1 is
        select 'drop '||object_type||' "'||owner||'"."'||object_name||'" '
                from all_objects
                where owner in ('CASEMAN')
                and object_type in ('PACKAGE','FUNCTION','TRIGGER', 'PROCEDURE','VIEW');

    v_sql_stmt varchar(256);
begin
    open c1;
    loop
        fetch c1 into v_sql_stmt;
        if c1%found then
            --dbms_output.put_line(v_sql_stmt);
            execute immediate v_sql_stmt;
        else
            exit;
        end if;
    end loop;
    close c1;
end;
/

exit success;

