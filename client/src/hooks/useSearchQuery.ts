import { useSearchParams } from "react-router-dom";

export default function useSearchQuery() {
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  return params;
}
