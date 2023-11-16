export enum ConversionsStatus {
  approvedPaid = "approvedPaid",
  approvedUnpaid = "approvedUnpaid",
  rejected = "rejected",
  pending = "pending",
}

export function getConversionStatusLabel(status: ConversionsStatus) {
  switch (status) {
    case ConversionsStatus.approvedPaid:
      return "Approved / Paid";
    case ConversionsStatus.approvedUnpaid:
      return "Approved / Unpaid";
    case ConversionsStatus.rejected:
      return "Rejected";
    case ConversionsStatus.pending:
      return "Pending";
    default:
      return "Unknown";
  }
}
