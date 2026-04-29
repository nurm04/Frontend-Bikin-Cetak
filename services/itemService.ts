// @/services/itemService.ts
"use server";

export interface PricingRule {
  min_qty: number;
  max_qty: number;
  rate: number;
}

export interface VariantDetail {
  variant_name: string;
  item_code: string;
  uom: string;
  description: string;
  pricing_rules: PricingRule[];
}

export interface AttributeValue {
  attribute_value: string;
}

export interface ItemAttribute {
  attribute: string;
  attribute_values: AttributeValue[];
}

export interface ItemTemplate {
  name: string;
  item_name: string;
  image_url: string;
  attributes: ItemAttribute[];
}

export interface ItemData {
  item_group_name: string;
  templates: ItemTemplate[];
}

export interface ApiResponse {
  data: ItemData[];
}

export interface ApiVariantResponse {
  data: VariantDetail[];
}

const API_URL = "https://bikincetak-api.up.railway.app/v1/items";

export async function getItems(): Promise<ItemData[]> {
  try {
    console.log(`[getItems] Memulai fetch ke: ${API_URL}`);
    const response = await fetch(API_URL, {
      method: "GET",
      next: { revalidate: 60 }, 
    });

    const textRes = await response.text();

    if (!response.ok) {
      console.error(`[getItems] Error ${response.status} dari API:`, textRes);
      return [];
    }

    const result: ApiResponse = JSON.parse(textRes);
    
    console.log(`[getItems] ✅ SUKSES! Mengambil ${result.data?.length || 0} grup produk.`);

    return result.data || [];
  } catch (error) {
    if (error instanceof Error) {
        console.error("[getItems] Catch Error:", error.message);
    }
    return [];
  }
}

export async function getVariantDetail(itemName: string, attributes: Record<string, string>): Promise<VariantDetail | null> {
  try {
    const url = `${API_URL}/${encodeURIComponent(itemName)}`;
    console.log("\n--------------------------------------------------");
    console.log(`[getVariantDetail] Menembak URL: ${url}`);
    console.log("[getVariantDetail] Atribut terpilih:", attributes);

    const response = await fetch(url, { method: "GET", cache: "no-store" });
    const textRes = await response.text();

    if (!response.ok) {
       console.error(`[getVariantDetail] Error ${response.status}:`, textRes);
       return null;
    }

    const result: ApiVariantResponse = JSON.parse(textRes);

    const suffix = Object.values(attributes)
      .filter(val => val !== "") 
      .map(val => val.toLowerCase())
      .join("-");
  
    const targetVariantName = suffix ? `${itemName}-${suffix}` : itemName;
    console.log(`[getVariantDetail] Mencari target: "${targetVariantName}"`);

    const found = result.data?.find(v => v.variant_name === targetVariantName) || null;
    
    if (found) {
        console.log("[getVariantDetail] ✅ VARIANT DITEMUKAN:", found);
    } else {
        console.log("[getVariantDetail] ❌ VARIANT TIDAK DITEMUKAN! Target tidak cocok.");
        console.log("[getVariantDetail] 💡 Berikut daftar semua Variant_Name dari API yang tersedia:");
        const availableVariants = result.data?.map(v => v.variant_name);
        console.log(availableVariants);
    }
    console.log("--------------------------------------------------\n");

    return found;
  } catch (error: unknown) {
    if (error instanceof Error) console.error("[getVariantDetail] Catch Error:", error.message);
    return null;
  }
}