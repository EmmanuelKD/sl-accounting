


import AccountsPayableContent from './account-payable-content'
import { fetchInvoices } from './to-delete'


export default async function AccountsPayablePage() {
  const { invoices, totalPayable, overduePayable } = await fetchInvoices()

  return (
    <AccountsPayableContent

      initialInvoices={invoices}
      totalPayable={totalPayable}
      overduePayable={overduePayable}
    />
  )
}
