'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { State, Transition, Event } from '../src/data-model/schemas';
import { CLAIM_TYPES } from '../src/app-shell/index';
import { getDefaultTheme, toggleTheme as toggle, getThemeClass } from '../src/app-shell/index';

// ── Model Data Context ──────────────────────────────────────────────

interface ModelData {
  states: State[];
  transitions: Transition[];
  events: Event[];
}

interface AppContextValue {
  activeClaimType: string;
  setActiveClaimType: (id: string) => void;
  theme: string;
  toggleTheme: () => void;
  modelData: ModelData;
  setModelData: (data: ModelData) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// ── Sample data per claim type ───────────────────────────────────────

const CLAIM_DATA: Record<string, { stateNames: string[]; flows: [number, number, string, boolean, boolean][]; eventDefs: [string, number, boolean, string, boolean, Record<string, boolean>][] }> = {
  MAIN_CLAIM_ENGLAND: {
    stateNames: ['Draft', 'Submitted', 'With Judge', 'Listed for Hearing', 'Order Made', 'Closed', 'Struck Out'],
    flows: [[0,1,'Claimant submits',false,false],[1,2,'Refer to judge',false,false],[1,3,'Auto-list 28d',true,true],[2,3,'Judge lists',false,false],[2,6,'Judge strikes out',false,false],[3,4,'Hearing concludes',false,false],[4,5,'Order enforced',true,true]],
    eventDefs: [['Submit Claim',0,false,'Claimant submits form',false,{Claimant:true}],['Case Issued',0,true,'System issues case after payment',false,{SystemAuto:true}],['Allocate hearing centre',0,false,'Caseworker assigns hearing centre',false,{Caseworker:true}],['Respond to Claim',1,false,'Defendant responds to claim',false,{Defendant:true}],['Upload your documents',1,false,'Citizen uploads supporting documents',false,{Claimant:true,Defendant:true}],['Create case flags',1,false,'Set accessibility or language flags',false,{Caseworker:true}],['Refer to Judge',1,false,'Caseworker escalates',false,{Caseworker:true}],['Auto-list',1,true,'Auto-list after 28d',true,{SystemAuto:true}],['Make an application',2,false,'Party makes general application',false,{Claimant:true,Defendant:true}],['Upload translated document',2,false,'HMCTS uploads translated document',false,{Caseworker:true}],['Direct Listing',2,false,'Judge directs listing',false,{Judge:true}],['Strike Out',2,false,'Judge strikes out',false,{Judge:true}],['Issue order',3,false,'Judge issues order after hearing',false,{Judge:true}],['Record Outcome',3,false,'Record hearing outcome',true,{Caseworker:true}],['Seal the order',4,false,'Court seals the order',false,{Caseworker:true}],['Close Case',4,true,'',false,{SystemAuto:true}]],
  },
  ACCELERATED_CLAIM_WALES: {
    stateNames: ['Draft', 'Filed', 'Validated', 'Listed', 'Possession Order', 'Closed'],
    flows: [[0,1,'File claim',false,false],[1,2,'System validates',true,false],[2,3,'Auto-list 14d',true,true],[3,4,'Order granted',false,false],[4,5,'Warrant executed',false,false]],
    eventDefs: [['File Claim',0,false,'Accelerated filing',false,{Claimant:true}],['Case Issued',0,true,'System issues case',false,{SystemAuto:true}],['Upload your documents',1,false,'Citizen uploads documents',false,{Claimant:true}],['Create case flags',1,false,'Set case flags',false,{Caseworker:true}],['Auto-validate',1,true,'System checks',false,{SystemAuto:true}],['List Hearing',2,true,'Fast-track listing',false,{SystemAuto:true}],['Make an application',2,false,'Party makes application',false,{Claimant:true,Defendant:true}],['Issue order',3,false,'Judge issues possession order',false,{Judge:true}],['Execute Warrant',4,false,'Bailiff executes',false,{BailiffEnforcement:true}]],
  },
  COUNTER_CLAIM: {
    stateNames: ['Draft', 'Filed', 'Linked to Main', 'With Judge', 'Heard Together', 'Determined', 'Closed'],
    flows: [[0,1,'File counter-claim',false,false],[1,2,'System links',true,false],[2,3,'Refer to judge',false,false],[3,4,'Judge joins hearing',false,false],[4,5,'Judge determines',false,false],[5,6,'Case closed',true,true]],
    eventDefs: [['File Counter-Claim',0,false,'Defendant files',false,{Defendant:true}],['Respond to counter claim',1,false,'Claimant responds to counterclaim',false,{Claimant:true}],['Update Counter Claim',1,false,'Defendant updates counterclaim',false,{Defendant:true}],['Upload your documents',1,false,'Citizen uploads documents',false,{Claimant:true,Defendant:true}],['Link Claims',1,true,'System links to main',false,{SystemAuto:true}],['Refer to Judge',2,false,'Caseworker refers',false,{Caseworker:true}],['Create case flags',2,false,'Set case flags',false,{Caseworker:true}],['Make an application',3,false,'Party makes application',false,{Claimant:true,Defendant:true}],['Join Hearing',3,false,'Judge joins cases',false,{Judge:true}],['Issue order',4,false,'Judge issues order',false,{Judge:true}],['Determine',4,false,'Judge determines outcome',true,{Judge:true}],['Close',5,true,'Auto-close',false,{SystemAuto:true}]],
  },
  COUNTER_CLAIM_MAIN_CLAIM_CLOSED: {
    stateNames: ['Draft', 'Filed', 'Standalone Review', 'With Judge', 'Determined', 'Closed'],
    flows: [[0,1,'File counter-claim',false,false],[1,2,'Main claim closed',true,false],[2,3,'Refer to judge',false,false],[3,4,'Judge determines',false,false],[4,5,'Case closed',true,true]],
    eventDefs: [['File Counter-Claim',0,false,'Filed after main closed',false,{Defendant:true}],['Upload your documents',0,false,'Upload supporting documents',false,{Defendant:true}],['Respond to counter claim',1,false,'Claimant responds',false,{Claimant:true}],['Standalone Review',1,true,'Main claim detected closed',true,{SystemAuto:true}],['Refer',2,false,'Caseworker refers',false,{Caseworker:true}],['Create case flags',2,false,'Set case flags',false,{Caseworker:true}],['Make an application',3,false,'Party makes application',false,{Claimant:true,Defendant:true}],['Issue order',3,false,'Judge issues order',false,{Judge:true}],['Determine',3,false,'Judge determines',false,{Judge:true}],['Close',4,true,'Auto-close',false,{SystemAuto:true}]],
  },
  ENFORCEMENT: {
    stateNames: ['Warrant Requested', 'Warrant Issued', 'With Bailiff', 'Eviction Scheduled', 'Executed', 'Suspended'],
    flows: [[0,1,'Issue warrant',false,false],[1,2,'Assign bailiff',false,false],[2,3,'Schedule eviction',false,false],[3,4,'Execute warrant',false,false],[2,5,'Judge suspends',false,false]],
    eventDefs: [['Request Warrant',0,false,'Claimant requests',false,{Claimant:true}],['Upload your documents',0,false,'Citizen uploads documents',false,{Claimant:true}],['Issue Warrant',0,false,'Court issues',false,{Caseworker:true}],['Assign Bailiff',1,false,'Assign enforcement',false,{CourtAdmin:true}],['Make an application',1,false,'Party makes application',false,{Claimant:true,Defendant:true}],['Manage case flags',2,false,'Update case flags',false,{Caseworker:true}],['Schedule',2,false,'Bailiff schedules',false,{BailiffEnforcement:true}],['Issue order',3,false,'Judge issues enforcement order',false,{Judge:true}],['Execute',3,false,'Carry out eviction',true,{BailiffEnforcement:true}],['Suspend',2,false,'Judge suspends warrant',false,{Judge:true}]],
  },
  APPEALS: {
    stateNames: ['Notice Filed', 'Permission Review', 'Permission Granted', 'Appeal Hearing', 'Appeal Decided', 'Dismissed'],
    flows: [[0,1,'File notice',false,false],[1,2,'Grant permission',false,false],[1,5,'Refuse permission',false,false],[2,3,'List appeal',false,false],[3,4,'Decide appeal',false,false]],
    eventDefs: [['File Notice',0,false,'Appellant files',false,{Claimant:true,Defendant:true}],['Upload your documents',0,false,'Upload appeal documents',false,{Claimant:true,Defendant:true}],['Create case flags',1,false,'Set case flags',false,{Caseworker:true}],['Review Permission',1,false,'Judge reviews',false,{Judge:true}],['Grant',1,false,'Permission granted',false,{Judge:true}],['Refuse',1,false,'Permission refused',false,{Judge:true}],['Upload translated document',2,false,'HMCTS uploads translated doc',false,{Caseworker:true}],['List Appeal',2,false,'Caseworker lists',false,{Caseworker:true}],['Make an application',3,false,'Party makes application',false,{Claimant:true,Defendant:true}],['Make an order',3,false,'Judge makes appeal order',false,{Judge:true}],['Decide',3,false,'Judge decides appeal',true,{Judge:true}]],
  },
  GENERAL_APPLICATIONS: {
    stateNames: ['Draft', 'Filed', 'With Judge', 'Order Made', 'Closed'],
    flows: [[0,1,'File application',false,false],[1,2,'Refer to judge',false,false],[2,3,'Judge decides',false,false],[3,4,'Completed',true,true]],
    eventDefs: [['Make an application',0,false,'Party files application',false,{Claimant:true,Defendant:true}],['Upload your documents',0,false,'Upload application documents',false,{Claimant:true,Defendant:true}],['Create case flags',1,false,'Set case flags',false,{Caseworker:true}],['Refer',1,false,'Caseworker refers',false,{Caseworker:true}],['Directions Order Drawn',2,false,'Directions order drafted',false,{Judge:true}],['Make an order',2,false,'Judge makes order',false,{Judge:true}],['Seal the order',3,false,'Court seals the order',false,{Caseworker:true}],['Complete',3,true,'Auto-close',false,{SystemAuto:true}]],
  },
};

function createSampleData(claimTypeId: string): ModelData {
  const spec = CLAIM_DATA[claimTypeId] ?? CLAIM_DATA['MAIN_CLAIM_ENGLAND'];
  const completenessValues = [80, 90, 60, 70, 50, 100, 40];

  const states: State[] = spec.stateNames.map((name, i) => {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    const isFirst = i === 0;
    const isLast = i === spec.stateNames.length - 1;
    const isSecondLast = i === spec.stateNames.length - 2;
    return {
      id, technicalName: name.toUpperCase().replace(/\s+/g, '_'), uiLabel: name,
      claimType: claimTypeId, isDraftLike: isFirst, isLive: !isFirst && !isLast && !(isSecondLast && spec.stateNames.length > 5),
      isEndState: isLast || !spec.flows.some(f => f[0] === i),
      completeness: completenessValues[i % completenessValues.length],
    };
  });

  const transitions: Transition[] = spec.flows.map(([from, to, cond, sys, time]) => ({
    from: states[from].id, to: states[to].id, condition: cond, isSystemTriggered: sys, isTimeBased: time,
  }));

  const events: Event[] = spec.eventDefs.map(([name, stateIdx, isSys, notes, hasOQ, actors], i) => ({
    id: `${claimTypeId}-e${i}`, name, claimType: claimTypeId, state: states[stateIdx].id,
    isSystemEvent: isSys, notes, hasOpenQuestions: hasOQ, actors,
  }));

  return { states, transitions, events };
}

// ── Provider ────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeClaimType, setActiveClaimType] = useState<string>(CLAIM_TYPES[0].id);
  const [theme, setTheme] = useState(getDefaultTheme);
  const [modelData, setModelData] = useState<ModelData>(() => createSampleData(CLAIM_TYPES[0].id));

  const handleToggleTheme = useCallback(() => {
    setTheme((t) => toggle(t));
  }, []);

  const handleSetClaimType = useCallback((id: string) => {
    setActiveClaimType(id);
    setModelData(createSampleData(id));
  }, []);

  useEffect(() => {
    document.documentElement.className = getThemeClass(theme);
  }, [theme]);

  return (
    <AppContext.Provider
      value={{
        activeClaimType,
        setActiveClaimType: handleSetClaimType,
        theme,
        toggleTheme: handleToggleTheme,
        modelData,
        setModelData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
