import { useLoginStore } from "../components/store/loginStore";
import { updateSaleService } from "../services/saleService";

export function useUpdateSale() {
  const { token } = useLoginStore();

  const updateSale = (id: number, typeSale: string) =>
    updateSaleService(token, id, typeSale);
  return { updateSale };
}