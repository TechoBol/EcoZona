import { useLoginStore } from "../components/store/loginStore";

export const usePermissions = () => {
  const { level } = useLoginStore();

  const lvl = Number(level); // por si acaso

  return {
    level: lvl,

    // 🔥 SUPER ADMIN
    isAdmin: [1 , 4].includes(lvl),

    // 📊 VISIBILIDAD (todos ven todo)
    canView: true,

    // 🛠 GESTIÓN
    canManageBranches:  [1 , 4].includes(lvl),
    canManageEmployees: [1, 2 , 4].includes(lvl),
    canManageRoles: [1 , 4].includes(lvl),
    canManageLines: [1, 2 , 4].includes(lvl),
    canManageTransfers: [1, 2 , 4].includes(lvl),
    canApproveTransfers: [1, 2].includes(lvl),
    canCreateTransfers: [1, 2].includes(lvl),
    canManageLinesAdmin: [1, 2].includes(lvl),

    // 💰 VENTAS
    canManageSales: [1, 2, 3 , 4].includes(lvl),
    canSell: [1, 2, 3].includes(lvl),

    // 📦 PRODUCTOS
    canCreateProduct: [1, 2].includes(lvl),
    canEditProduct: [1, 2].includes(lvl),

    // 👀 SOLO LECTURA
    isReadOnly: lvl === 4,
  };
};