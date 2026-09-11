import React from "react";
import { useParams } from "react-router-dom";

// Standalone 9 Voucher & Trade Entries Components
import RoughPurchase from "./RoughPurchase";
import RoughSale from "./RoughSale";
import PolishPurchase from "./PolishPurchase";
import PolishSale from "./PolishSale";
import LgdPurchase from "./LgdPurchase";
import LgdSale from "./LgdSale";
import ExpenseEntry from "./ExpenseEntry";
import PaymentEntryPage from "./PaymentEntryPage";
import PaymentReceivePage from "./PaymentReceivePage";

// Re-export constants for backwards compatibility
export { VOUCHER_CONFIGS, EXPENSE_HEADS, STORAGE_KEY } from "./voucherConstants";

const VoucherEntryPage = ({ voucherTypeProp }) => {
  const { voucherType: routeVoucherType } = useParams();
  const currentSlug = voucherTypeProp || routeVoucherType || "rough-purchase";

  switch (currentSlug) {
    case "rough-purchase":
      return <RoughPurchase />;
    case "rough-sale":
      return <RoughSale />;
    case "polish-purchase":
      return <PolishPurchase />;
    case "polish-sale":
      return <PolishSale />;
    case "lgd-purchase":
      return <LgdPurchase />;
    case "lgd-sale":
      return <LgdSale />;
    case "expense":
      return <ExpenseEntry />;
    case "payment-entry":
      return <PaymentEntryPage />;
    case "payment-receive":
      return <PaymentReceivePage />;
    default:
      return <RoughPurchase />;
  }
};

export default VoucherEntryPage;
