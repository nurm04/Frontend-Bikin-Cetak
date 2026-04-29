// @/app/(public)/produk/[slug]/page.tsx
import { slugify } from "@/lib/utils";
import { notFound } from "next/navigation";
import { getItems, getVariantDetail } from "@/services/itemService";
import ProductAction from "@/app/(public)/produk/[slug]/ProductClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Produk({ params }: PageProps) {
  const { slug } = await params;
  const itemGroups = await getItems();
  
  const currentGroup = itemGroups.find((group) => 
    group.templates.some((t) => slugify(t.item_name) === slug)
  );
  
  if (!currentGroup) return notFound();
  
  const foundItem = currentGroup.templates.find(
    (t) => slugify(t.item_name) === slug
  );
  
  if (!foundItem) return notFound();

  const mappedFields = foundItem.attributes.map((attr) => ({
    name: attr.attribute,
    label: attr.attribute,
    type: "select",
    options: attr.attribute_values.map((v) => v.attribute_value),
  }));

  const initialAttributes: Record<string, string> = {};
  mappedFields.forEach(field => {
    if (field.options && field.options.length > 0) {
      initialAttributes[field.name] = field.options[0]; 
    }
  });

  const initialVariant = await getVariantDetail(foundItem.item_name, initialAttributes);

  const products = currentGroup.templates;
  const recommendations = products
    .filter((item) => item.item_name !== foundItem.item_name)
    .slice(0, 4)
    .map((item) => ({
      name: item.item_name,
      image: item.image_url || "/images/placeholder-product.jpg"
    }));

  return (
    <ProductAction 
      foundItem={foundItem}
      initialVariant={initialVariant}
      mappedFields={mappedFields}
      recommendations={recommendations}
    />
  );
}