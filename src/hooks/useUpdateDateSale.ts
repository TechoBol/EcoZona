import { useLoginStore } from "../components/store/loginStore";
import { updateDateSaleService } from "../services/saleService";

export function useUpdateDateSale() {
  const { token } = useLoginStore();

  const updateDateSale = (id: number, date: string) =>
    updateDateSaleService(token, id, date);

  return { updateDateSale };
}