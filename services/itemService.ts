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
    const response = await fetch(API_URL, {
      method: "GET",
      next: { revalidate: 60 }, 
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil data dari API");
    }

    const result: ApiResponse = await response.json();
    return result.data;
  } catch (error) {
    if (error instanceof Error) {
        console.error("Error Item Service:", error.message);
    }
    return [];
  }
}

export async function getVariantDetail(itemName: string, attributes: Record<string, string>): Promise<VariantDetail | null> {
  try {
    const url = `${API_URL}/${encodeURIComponent(itemName)}`;
    console.log("Fetching URL:", url);

    const response = await fetch(url, { method: "GET", cache: "no-store" });
    if (!response.ok) return null;

    const result: ApiVariantResponse = await response.json();

    const suffix = Object.values(attributes)
      .filter(val => val !== "") 
      .map(val => val.toLowerCase())
      .join("-");
  
    const targetVariantName = suffix ? `${itemName}-${suffix}` : itemName;

    return result.data?.find(v => v.variant_name === targetVariantName) || null;
  } catch (error: unknown) {
    if (error instanceof Error) console.error("Error Fetch Variant:", error.message);
    return null;
  }
}