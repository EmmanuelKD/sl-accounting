 // import { ERROR_MESSAGE } from "@/const";
import ChartOfAccounts from "@/components/client-components/core-accounting/chart-of-accounts";
import { getAccountsAction } from "@/lib/actions/core-accounting/account-actions";


export default async function Page() {
  const initialAccounts = await getAccountsAction();

  return <ChartOfAccounts initialAccounts={initialAccounts.accounts} />;
}
