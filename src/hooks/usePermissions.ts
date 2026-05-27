import { useLoginStore } from "../components/store/loginStore";

export const usePermissions = () => {
  const { level, role } = useLoginStore();

  const lvl = Number(level);

  const canViewKardexUtilRoles = [
    "Técnico en sistemas",
    "Gerente General",
    "Gerente Operaciones",
    "Subgerente Tecnico",
  ];

  return {
    level: lvl,

    // 🔥 SUPER ADMIN
    isAdmin: [1, 4].includes(lvl),

    // 📊 VISIBILIDAD
    canView: true,

    // 🛠 GESTIÓN
    canManageBranches: [1, 4].includes(lvl),
    canManageInventaryFisico: [1, 4].includes(lvl),
    canManageEmployees: [1, 2, 4].includes(lvl),
    canManageRoles: [1, 4].includes(lvl),
    canManageLines: [1, 2, 4].includes(lvl),
    canManageTransfers: [1, 2, 4].includes(lvl),
    canApproveTransfers: [1, 2].includes(lvl),
    canCreateTransfers: [1, 2].includes(lvl),
    canManageLinesAdmin: [1, 2].includes(lvl),
    canManageDateSale: [1, 2].includes(lvl),
    canManageKardex: [1, 4].includes(lvl),
    canManageImportation: [1, 2].includes(lvl),

    // 🔥 UTILIDADES KARDEX
    canManageKardexUtil:
      [1].includes(lvl) && canViewKardexUtilRoles.includes(role),

    // 💰 VENTAS
    canManageSales: [1, 2, 3, 4].includes(lvl),
    canSell: [1, 2, 3].includes(lvl),

    // 📦 PRODUCTOS
    canCreateProduct: [1, 2].includes(lvl),
    canEditProduct: [1, 2].includes(lvl),

    // 👀 SOLO LECTURA
    isReadOnly: lvl === 4,
  };
};
