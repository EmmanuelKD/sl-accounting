export interface Invoice {
  id: string;
  vendorName: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  status: "Pending" | "Paid" | "Overdue";
}

// Mock data (replace with actual API calls in a real application)
const mockInvoices: Invoice[] = [
  {
    id: "1",
    vendorName: "Acme Corp",
    invoiceDate: "2024-09-01",
    dueDate: "2024-09-30",
    totalAmount: 1000,
    status: "Pending",
  },
  {
    id: "2",
    vendorName: "Globex Inc",
    invoiceDate: "2024-08-15",
    dueDate: "2024-09-14",
    totalAmount: 1500,
    status: "Overdue",
  },
  {
    id: "3",
    vendorName: "Initech",
    invoiceDate: "2024-09-10",
    dueDate: "2024-10-10",
    totalAmount: 800,
    status: "Pending",
  },
  {
    id: "4",
    vendorName: "Umbrella Corp",
    invoiceDate: "2024-08-01",
    dueDate: "2024-08-31",
    totalAmount: 2000,
    status: "Paid",
  },
  {
    id: "5",
    vendorName: "Stark Industries",
    invoiceDate: "2024-09-05",
    dueDate: "2024-10-05",
    totalAmount: 3000,
    status: "Pending",
  },
];

export async function fetchInvoices() {
  // Simulating API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const totalPayable = mockInvoices.reduce(
    (sum, invoice) =>
      sum + (invoice.status !== "Paid" ? invoice.totalAmount : 0),
    0
  );
  const overduePayable = mockInvoices.reduce(
    (sum, invoice) =>
      sum + (invoice.status === "Overdue" ? invoice.totalAmount : 0),
    0
  );

  return { invoices: mockInvoices, totalPayable, overduePayable };
}

export async function markInvoiceAsPaid(invoiceId: string) {
  // Simulating API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real application, you would make an API call here
  console.log(`Marking invoice ${invoiceId} as paid`);

  // For now, we'll just return a success status
  return { success: true };
}
