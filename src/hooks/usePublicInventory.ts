import { useEffect, useState } from "react";
import useSWR from "swr";

import { getProducts } from "../services/InventoryService";

import { usePublicInventoryStore } from "../components/store/publicInventoryStore";

const fetcher = ([_, token]: [string, string]) =>
  getProducts(token);

const usePublicInventory = () => {
  const { publicToken } =
    usePublicInventoryStore();

  const [filteredProducts, setFilteredProducts] =
    useState<any[]>([]);

  const [search, setSearch] = useState("");

  //////////////////////////////
  // SWR
  //////////////////////////////

  const {
    data: products = [],
    isLoading,
    mutate,
  } = useSWR(
    publicToken
      ? ["public-products", publicToken]
      : null,

    fetcher,

    {
      revalidateOnFocus: false,
    },
  );

  //////////////////////////////
  // FILTRO
  //////////////////////////////

  useEffect(() => {
    if (!search) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(
      (product: any) =>
        (product.name || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        (product.barcode || "")
          .toLowerCase()
          .includes(search.toLowerCase()),
    );

    setFilteredProducts(filtered);
  }, [search, products]);

  const onFilterTextBoxChanged = (e: any) => {
    setSearch(e.target.value);
  };

  return {
    products: filteredProducts,
    search,
    setSearch,
    isLoading,
    refresh: mutate,
    onFilterTextBoxChanged,
  };
};

export default usePublicInventory;