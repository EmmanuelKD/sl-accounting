export function determineDebitOrCredit(
  type:
    | "ASSET"
    | "CONTRA_ASSET"
    | "EXPENSE"
    | "LIABILITY"
    | "EQUITY"
    | "REVENUE",
  action: "increment" | "decrement"
) {
  switch (type) {
    case "ASSET":
    case "EXPENSE":
      // For ASSET and EXPENSE:
      // Increment = Debit, Decrement = Credit
      return action === "increment" ? "DEBIT" : "CREDIT";

    case "LIABILITY":
    case "EQUITY":
    case "REVENUE":
    case "CONTRA_ASSET":
      // For LIABILITY, EQUITY, and REVENUE:
      // Increment = Credit, Decrement = Debit
      return action === "increment" ? "CREDIT" : "DEBIT";

    default:
      throw new Error("Invalid type");
    // Unknown
  }
}
