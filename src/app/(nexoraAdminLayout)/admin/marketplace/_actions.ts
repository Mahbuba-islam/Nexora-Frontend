"use server";

import { revalidatePath } from "next/cache";

import {
  approveAdminSeller,
  blockAdminUser,
  bulkAdminProducts,
  deleteAdminProduct,
  deleteAdminUser,
  reactivateAdminUser,
  reinstateAdminSeller,
  rejectAdminSeller,
  restoreAdminProduct,
  restoreAdminUser,
  softDeleteAdminSeller,
  suspendAdminSeller,
  suspendAdminUser,
  updateAdminProduct,
  updateAdminSeller,
  updateAdminUser,
  type AdminProductBulkAction,
} from "@/src/services/admin.service";

const PATHS = {
  products: "/admin/marketplace/products",
  users: "/admin/marketplace/users",
  sellers: "/admin/marketplace/sellers",
};

type Result = { success: boolean; message?: string };

const wrap = async (
  fn: () => Promise<unknown>,
  ok: string,
  fail: string,
  paths: string[],
): Promise<Result> => {
  try {
    await fn();
    for (const p of paths) revalidatePath(p);
    return { success: true, message: ok };
  } catch (err) {
    return {
      success: false,
      message:
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        fail,
    };
  }
};

// -----------------------------------------------------------------
// Products
// -----------------------------------------------------------------
export const updateProductAction = async (
  id: string,
  payload: Record<string, unknown>,
) =>
  wrap(
    () => updateAdminProduct(id, payload),
    "Product updated.",
    "Could not update product.",
    [PATHS.products, `${PATHS.products}/${id}`],
  );

export const deleteProductAction = async (id: string) =>
  wrap(
    () => deleteAdminProduct(id),
    "Product archived.",
    "Could not delete product.",
    [PATHS.products],
  );

export const restoreProductAction = async (id: string) =>
  wrap(
    () => restoreAdminProduct(id),
    "Product restored.",
    "Could not restore product.",
    [PATHS.products],
  );

export const bulkProductsAction = async (
  ids: string[],
  action: AdminProductBulkAction,
) =>
  wrap(
    () => bulkAdminProducts(ids, action),
    `Applied "${action}" to ${ids.length} products.`,
    "Bulk action failed.",
    [PATHS.products],
  );

// -----------------------------------------------------------------
// Users
// -----------------------------------------------------------------
export const updateUserAction = async (
  id: string,
  payload: Record<string, unknown>,
) =>
  wrap(
    () => updateAdminUser(id, payload),
    "User updated.",
    "Could not update user.",
    [PATHS.users, `${PATHS.users}/${id}`],
  );

export const suspendUserAction = async (id: string, reason: string) =>
  wrap(
    () => suspendAdminUser(id, reason),
    "User suspended.",
    "Could not suspend user.",
    [PATHS.users],
  );

export const blockUserAction = async (id: string, reason: string) =>
  wrap(
    () => blockAdminUser(id, reason),
    "User blocked.",
    "Could not block user.",
    [PATHS.users],
  );

export const reactivateUserAction = async (id: string) =>
  wrap(
    () => reactivateAdminUser(id),
    "User reactivated.",
    "Could not reactivate user.",
    [PATHS.users],
  );

export const deleteUserAction = async (id: string) =>
  wrap(
    () => deleteAdminUser(id),
    "User soft-deleted.",
    "Could not delete user.",
    [PATHS.users],
  );

export const restoreUserAction = async (id: string) =>
  wrap(
    () => restoreAdminUser(id),
    "User restored.",
    "Could not restore user.",
    [PATHS.users],
  );

// -----------------------------------------------------------------
// Sellers
// -----------------------------------------------------------------
export const updateSellerAction = async (
  id: string,
  payload: Record<string, unknown>,
) =>
  wrap(
    () => updateAdminSeller(id, payload),
    "Seller updated.",
    "Could not update seller.",
    [PATHS.sellers, `${PATHS.sellers}/${id}`],
  );

export const approveSellerAction = async (id: string) =>
  wrap(
    () => approveAdminSeller(id),
    "Seller approved.",
    "Could not approve seller.",
    [PATHS.sellers],
  );

export const rejectSellerAction = async (id: string, reason?: string) =>
  wrap(
    () => rejectAdminSeller(id, reason),
    "Seller rejected.",
    "Could not reject seller.",
    [PATHS.sellers],
  );

export const suspendSellerAction = async (id: string, reason?: string) =>
  wrap(
    () => suspendAdminSeller(id, reason),
    "Seller suspended.",
    "Could not suspend seller.",
    [PATHS.sellers],
  );

export const reinstateSellerAction = async (id: string) =>
  wrap(
    () => reinstateAdminSeller(id),
    "Seller reinstated.",
    "Could not reinstate seller.",
    [PATHS.sellers],
  );

export const deleteSellerAction = async (id: string) =>
  wrap(
    () => softDeleteAdminSeller(id),
    "Seller closed.",
    "Could not close seller.",
    [PATHS.sellers],
  );
