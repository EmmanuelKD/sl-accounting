"use server";

import {
  addVendor,
  createCustomer,
  getAllCustomers,
  getVendors,
  getVendorsMetadata,
} from "@/module/CoreAccountingModule";
import { Address } from "@prisma/client";

export async function createCustomerAction(
  id: string,
  name: string,
  email: string,
  workspaceId: string,
  address: Omit<
    Address,
    "createdAt" | "updatedAt" | "id" | "customerId" | "vendorId"
  >[],
  phone?: string
) {
  return await createCustomer(id, name, email, workspaceId, address, phone);
}

export async function getAllCustomersAction(workspaceId: string) {
  return await getAllCustomers(workspaceId);
}
export async function createVendorAction(
  name: string,
  email: string,
  contactPerson:string,
  workspaceId: string,
  address: Omit<
    Address,
    "createdAt" | "updatedAt" | "id" | "customerId" | "vendorId"
  >[],
  phone?: string
) {
  return await addVendor( name, email,contactPerson, workspaceId, address, phone);
}
export async function getAllVendorsAction(workspaceId: string) {
  return await getVendors(workspaceId);
}

export async function getAllVendorsMeterdataAction(workspaceId: string) {
  return await getVendorsMetadata(workspaceId);
}


