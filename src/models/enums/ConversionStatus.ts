export enum ConversionStatus {
  approvedPaid = "approvedPaid",
  approvedUnpaid = "approvedUnpaid",
  rejected = "rejected",
  pending = "pending",
}

export function getConversionStatusLabel(status: ConversionStatus) {
  switch (status) {
    case ConversionStatus.approvedPaid:
      return "Approved / Paid";
    case ConversionStatus.approvedUnpaid:
      return "Approved / Unpaid";
    case ConversionStatus.rejected:
      return "Rejected";
    case ConversionStatus.pending:
      return "Pending";
    default:
      return "Unknown";
  }
}
