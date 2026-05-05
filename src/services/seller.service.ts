// Nexora — seller (storefront) service.
// Apply-as-seller and self-service shop endpoints.
import { httpClient } from "@/src/lib/axious/httpClient";

export interface ApplyAsSellerPayload {
  shopName: string;
  tagline?: string;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  websiteUrl?: string;
  legalName?: string;
  businessType?: "INDIVIDUAL" | "COMPANY" | "LLC" | "PARTNERSHIP" | "OTHER";
  taxId?: string;
  registrationNo?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  /** ISO-3166 alpha-2 — backend uppercases. */
  country?: string;
  postalCode?: string;
  returnPolicy?: string;
  shippingPolicy?: string;
  payoutMethod?: "STRIPE_CONNECT" | "MANUAL_BANK";
  bankAccountHolderName?: string;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  bankName?: string;
  bankCountry?: string;
}

export interface ApplyAsSellerResult {
  success: boolean;
  message?: string;
  sellerId?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
}

export async function applyAsSeller(
  payload: ApplyAsSellerPayload,
): Promise<ApplyAsSellerResult> {
  try {
    const res = await httpClient.post<{
      data?: { id?: string; status?: ApplyAsSellerResult["status"] };
      message?: string;
      success?: boolean;
    }>("/sellers/apply", payload, {
      withCredentials: true,
      silent: true,
    });
    const body = res?.data;
    return {
      success: true,
      message: body?.message ?? "Application submitted",
      sellerId: body?.data?.id,
      status: body?.data?.status ?? "PENDING",
    };
  } catch (err: unknown) {
    const e = err as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    return {
      success: false,
      message:
        e?.response?.data?.message ??
        e?.message ??
        "Failed to submit application",
    };
  }
}
