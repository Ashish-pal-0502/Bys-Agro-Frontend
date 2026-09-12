
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "./../../utility/pagination";

export default function PaginationClient({ count, page }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (_, value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(value));
    router.push(`/blogs?${params.toString()}`);
  };

  return (
    <Pagination
      count={count}
      page={page}
      siblingCount={1}
      onChange={handleChange}
    />
  );
}