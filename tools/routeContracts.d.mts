// Types for the plain-JS visual-QA harness, so the unit suite can assert
// against the SAME contract objects the harness enforces. If the tests
// used their own copy, one could pass while the harness applied
// different rules — which is how a guard quietly stops guarding.
//
// `.d.mts` because TypeScript resolves a `.mjs` import to a `.d.mts`
// declaration. The harness itself stays plain JS so it runs under bare
// node with no build step.
export type RouteContract = {
  id: string;
  label: string;
  mustContain: string[];
  mustNotContain?: string[];
};
export declare const ROUTE_CONTRACTS: Record<string, RouteContract>;
export declare function checkContract(
  contract: RouteContract,
  visibleText: string
): string[];
