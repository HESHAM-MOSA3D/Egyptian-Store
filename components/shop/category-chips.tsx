"use client";

import { CategoryChip, CategoryChipRow } from "@/components/ui/category-chip";
import { ChipRowSkeleton } from "@/components/ui/skeleton";

type Category = { id: string; nameAr: string; slug: string };

export function CategoryChips({
  categories,
  selected,
  onSelect,
  loading,
}: {
  categories: Category[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
  loading?: boolean;
}) {
  if (loading) {
    return <ChipRowSkeleton />;
  }

  return (
    <CategoryChipRow>
      <CategoryChip
        label="الكل"
        selected={selected === null}
        onClick={() => onSelect(null)}
      />
      {categories.map((cat) => (
        <CategoryChip
          key={cat.id}
          label={cat.nameAr}
          selected={selected === cat.slug}
          onClick={() => onSelect(cat.slug)}
        />
      ))}
    </CategoryChipRow>
  );
}
