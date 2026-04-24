export interface AttributeValue {
  value: string;
}

export interface ItemAttribute {
  attribute: string;
  attribute_value: AttributeValue[];
}

export interface ItemData {
  name: string;
  item_name: string;
  has_variants: number;
  attributes: ItemAttribute[];
}

export interface ApiResponse {
  data: ItemData[];
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
    console.error("Error Item Service:", error);
    return [];
  }
}