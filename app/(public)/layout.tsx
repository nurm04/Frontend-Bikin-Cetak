import ConditionalLayout from "@/components/layouts/ConditionalLayout";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConditionalLayout>
      {children}
    </ConditionalLayout>
  );
}