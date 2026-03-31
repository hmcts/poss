-----------------------------------------------------------------------------
--   SQL Script to delete reprintable reports that are older than 7 days.  --
--                                                                         --  
--   Tables Affected : CONTENT_STORE, DOCUMENT_STORE,                      --    
--                   REPORT_REPRINTS, REPORT_QUEUE                         --
--                                                                         --
--   Author : Anoop Sehdev                                                 --
--   Version : 0.1                                                         --
--   Date : 9th Feb 2005                                                   --
--                                                                         --
--   Change History                                                        --
--     24 May 2007 : Chris Hutt : report_queue.storage_duration selection  --
--                                changed from '=7' to '>=0'               --
--                                to ensure all records not flagged for    --
--                                permanent retention                      --
--				  (ie storage_duration = -1) are deleted   --
-----------------------------------------------------------------------------

-----------------------------------------------
-- First delete from Content Store table     --
-----------------------------------------------

delete
from 
       content_store cs 
where 
       cs.id in 
          ( 
            select 
                     ds.content_store_id
              from
                     document_store ds
              where
                     ds.id in
                        (
                          select 
                                  rq.document_id 
                          from 
                                  report_queue rq 
                          where 
                                  rq.id in 
                                    (
                                      select 
                                              rp.fw_report_id 
                                      from 
                                              report_reprints rp 
                                      where 
                                              rp.report_date < sysdate - 7
                                    )
                        )
          );
-----------------------------------------------
-- Then delete from Document Store table     --
-----------------------------------------------

delete
      from 
            document_store ds 
      where 
            ds.id in 
                  (
                    select 
                            rq.document_id 
                    from 
                            report_queue rq 
                    where 
                            rq.id in 
                            (
                                select 
                                       rp.fw_report_id 
                                from 
                                       report_reprints rp 
                                where 
                                      rp.report_date < sysdate - 7
                            )
                  );
                  
-----------------------------------------------
--  Then delete from Report Reprints table --
-----------------------------------------------              

delete
from 
     report_reprints rp 
where 
      rp.report_date < sysdate - 7;


commit;                            
-----------------------------------------------
-- Finally delete from Report Queue table       --
-----------------------------------------------    
  
--select 
--       *
delete
from 
       report_queue rq 
where 
      rq.storage_duration >= 0
and
      rq.created_date < sysdate - 7;               

-----------------------------------------------
-- That's all. Just commit                   --
-----------------------------------------------    
commit;

exit;

--rollback;

