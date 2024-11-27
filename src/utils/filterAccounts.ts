import { AccountMinimal, AccountWithSubAccounts } from "types";

  /**
   * Converts a flat list of accounts into a hierarchical structure.
   * @param accounts Flat list of accounts
   * @returns Hierarchical account structure
   */

  // export  function organizeAccounts(accounts: AccountMinimal[]): AccountWithSubAccounts[] {
  //   // Step 1: Create a map to store all accounts by their ID for easy lookup
  //   const accountMap: Map<string, AccountWithSubAccounts> = new Map();
  
  //   // Step 2: Initialize the map with the accounts and add an empty subAccounts array
  //   accounts.forEach((account) => {
  //     accountMap.set(account.id, { ...account, subAccounts: [] } as unknown as AccountWithSubAccounts);
  //   });
  
  //   // Step 3: Create a list to store top-level accounts (those with no parent)
  //   const rootAccounts: AccountWithSubAccounts[] = [];
  
  //   // Step 4: Organize the accounts into a hierarchical structure
  //   accounts.forEach((account) => {
  //     const parentAccountId = account.parentAccountId;
  
  //     if (parentAccountId === null) {
  //       // If there's no parent, add to the root accounts list
  //       rootAccounts.push(accountMap.get(account.id)!);
  //     } else {
  //       // If there's a parent, add this account to its subAccounts
  //       const parentAccount = accountMap.get(parentAccountId);
  //       if (parentAccount) {
  //         parentAccount.subAccounts.push(accountMap.get(account.id)!);
  //       }
  //     }
  //   });
  
  //   return rootAccounts;
  // }

  export  function organizeAccounts(accounts: AccountMinimal[]): AccountWithSubAccounts[] {
 
    // Step 1: Create a map to store all accounts by their ID for easy lookup
    const accountMap: Map<string, AccountWithSubAccounts> = new Map();
  
    // Step 2: Initialize the map with the accounts and add an empty subAccounts array
    accounts.forEach((account) => {
      accountMap.set(account.id, { ...account, subAccounts: [] } as unknown as AccountWithSubAccounts);
    });
  
    // Step 3: Create a list to store top-level accounts (those with no parent)
    const rootAccounts: AccountWithSubAccounts[] = [];
  
    // Step 4: Organize the accounts into a hierarchical structure
    accounts.forEach((account) => {
      const currentAccount = accountMap.get(account.id)!; // Get the current account from the map
      if ((account.parentAccountId??"").length === 0) {
        // If there's no parent, it's a root account
        rootAccounts.push(currentAccount);
      } else {
        // If there's a parent, add this account to its parent's subAccounts
        const parentAccount = accountMap.get(account.parentAccountId);
        if (parentAccount) {
          parentAccount.subAccounts.push(currentAccount);
        } else {
          console.warn(`Parent account not found for ID: ${account.parentAccountId}`);
        }
      }
    });
  
    return rootAccounts;
  }