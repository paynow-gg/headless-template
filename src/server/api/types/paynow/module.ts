import type { ManagementSchemas } from "@paynow-gg/typescript-sdk";

export type ModuleType =
  | "payment_goal"
  | "recent_payments"
  | "top_customer"
  | "giftcard_balance"
  | "text_box";

export type PaymentGoalModuleSettings = {
  header: string;
  period: string;
  barStyle: string;
  goalTarget: number;
  animateGoalBar: boolean;
  allowPercentageOverflow: boolean;
  displayAbsoluteGoalAmount: boolean;
};

export type RecentPaymentsModuleSettings = {
  header: string;
  displayLimit: number;
  displayFreePayments: boolean;
  displayTimeOfPurchase: boolean;
  displayPriceOfPurchase: boolean;
  displayPurchasedProduct: boolean;
};

export type TopCustomerModuleSettings = {
  header: string;
  field: string;
  limit: number;
  period: string;
  displayCustomerSpendAmount: boolean;
};

export type GiftCardBalanceModuleSettings = {
  header: string;
};

export type TextBoxModuleSettings = {
  header: string;
  content: string;
};

type ModuleSettings<T extends ModuleType> = T extends "payment_goal"
  ? PaymentGoalModuleSettings
  : T extends "recent_payments"
    ? RecentPaymentsModuleSettings
    : T extends "giftcard_balance"
      ? GiftCardBalanceModuleSettings
      : T extends "text_box"
        ? TextBoxModuleSettings
        : never;

export default interface Module<T extends ModuleType = ModuleType> {
  id: T;
  data: {
    settings: ModuleSettings<T>;
    orders?: ManagementSchemas["OrderDto"][];
    revenue?: string;
  };
}
