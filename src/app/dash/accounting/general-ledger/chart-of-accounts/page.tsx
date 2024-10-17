
import ChartOfAccounts from "@/components/client-components/chart-of-accounts";
import { AccountMinimal } from "types";

async function getAccounts(): Promise<AccountMinimal[]> {
  // Replace this with your actual API call
  return [
    {
      id: "1",
      number: "1000",
      name: "Cash",
      type: "EQUITY",
      parentAccountId: "",
      balance: 0,
      status: "ACTIVE",
    },
    {
      id: "2",
      number: "2000",
      name: "Accounts Payable",
      type: "ASSET",
      parentAccountId: "",
      balance: 0,
      status: "ACTIVE",
    },
    {
      id: "3",
      number: "3000",
      name: "Revenue",
      type: "EQUITY",
      parentAccountId: "",
      balance: 0,
      status: "ACTIVE",
    },
    {
      id: "4",
      number: "4000",
      name: "Expenses",
      type: "LIABILITY",
      parentAccountId: "",
      balance: 0,
      status: "ACTIVE",
    },
  ] satisfies AccountMinimal[];
}

export default async function Page() {
  const initialAccounts = await getAccounts();

  return <ChartOfAccounts initialAccounts={initialAccounts} />;
}
