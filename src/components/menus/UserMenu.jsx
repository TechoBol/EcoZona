import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useLoginStore } from "../store/loginStore";
import useAuthentication from "../../hooks/useAuthentication";
import { LogOut, Building2, Users, User, ShoppingCart, Truck, ListPlusIcon, Tag, Bookmark } from "lucide-react";
import { MdOutlineInventory2 } from "react-icons/md";
import {
  ProfileButton,
  Dropdown,
  UserInfo,
  Name,
  Role,
  LogoutButton,
  MenuOption,
} from "../ui/Inventory";

import useInventory  from "../../hooks/useInventory";
import { useSucursales } from "../../hooks/useSucursales";
import { useEmployees } from "../../hooks/useEmployees";
import { useRoles } from "../../hooks/useRoles";
import { useSales } from "../../hooks/useSale";
import { useTransfers } from "../../hooks/useTransfers";
import { useLines } from "../../hooks/useLine";

const UserMenu = () => {
  const { fullName, role } = useLoginStore() || {};
  const { logOut } = useAuthentication();

  const { goToInventory } = useInventory();
  const { goToSucursales } = useSucursales();
  const { goToTrabajadores } = useEmployees();
  const { goToRoles } = useRoles();
  const { goToSales } = useSales();
  const { goToTransfer } = useTransfers();
  const { goToLines } = useLines();

  const initial = fullName ? fullName.charAt(0).toUpperCase() : "?";
  const canEdit =
    role === "Administrador sucursal" ||
    role === "Técnico en sistemas" ||
    role === "Gerente General" ||
    role === "Gerente Operaciones";

  const isAdmin =
    role === "Técnico en sistemas" ||
    role === "Gerente General" ||
    role === "Gerente Operaciones";

  const isAdminOrSucursal = isAdmin || role === "Administrador sucursal";

  return (
    <Menu as="div" style={{ position: "relative", display: "flex" }}>
      {({ open }) => (
        <>
          {/* OVERLAY */}
          {open && (
            <div
              onClick={() => { }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.35)",
                zIndex: 90,
              }}
            />
          )}

          {/* BOTÓN */}
          <Menu.Button
            style={{
              all: "unset",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              zIndex: 101,
            }}
          >
            <ProfileButton>
              <User size={20} />
            </ProfileButton>
          </Menu.Button>

          {/* DROPDOWN */}
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Menu.Items
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                left: 0,
                minWidth: "220px",
                zIndex: 100,
              }}
            >
              <Dropdown>
                {/* INFO USUARIO */}
                <UserInfo>
                  <Name>{fullName}</Name>
                  <Role>{role}</Role>
                </UserInfo>

                {/* INVENTARIO */}
                <Menu.Item>
                    {({ active }) => (
                      <MenuOption onClick={goToInventory} $active={active}>
                        <MdOutlineInventory2 size={16} />
                        <span>Inventario</span>
                      </MenuOption>
                    )}
                  </Menu.Item>

                {/* SUCURSALES */}
                {isAdmin && (
                  <Menu.Item>
                    {({ active }) => (
                      <MenuOption onClick={goToSucursales} $active={active}>
                        <Building2 size={16} />
                        <span>Administrar sucursales</span>
                      </MenuOption>
                    )}
                  </Menu.Item>
                )}

                {/* TRABAJADORES */}
                {isAdminOrSucursal && (
                  <Menu.Item>
                    {({ active }) => (
                      <MenuOption onClick={goToTrabajadores} $active={active}>
                        <Users size={16} />
                        <span>Administrar trabajadores</span>
                      </MenuOption>
                    )}
                  </Menu.Item>
                )}

                {/* ROLES */}
                {isAdmin && (
                  <Menu.Item>
                    {({ active }) => (
                      <MenuOption onClick={goToRoles} $active={active}>
                        <Users size={16} />
                        <span>Administrar roles</span>
                      </MenuOption>
                    )}
                  </Menu.Item>
                )}
                <Menu.Item>
                  {({ active }) => (
                    <MenuOption onClick={goToTransfer} $active={active}>
                      <Truck size={16} />
                      <span>Transferencias</span>
                    </MenuOption>
                  )}
                </Menu.Item>

                {/* LÍNEAS */}
                {isAdmin && (
                  <Menu.Item>
                    {({ active }) => (
                      <MenuOption onClick={goToLines} $active={active}>
                        <Tag size={16} />
                        <span>Administrar líneas</span>
                      </MenuOption>
                    )}
                  </Menu.Item>
                )}

                {/* VENTAS */}
                <Menu.Item>
                  {({ active }) => (
                    <MenuOption onClick={goToSales} $active={active}>
                      <ShoppingCart size={16} />
                      <span>Administrar ventas</span>
                    </MenuOption>
                  )}
                </Menu.Item>

                {/* LOGOUT */}
                <Menu.Item>
                  {({ active }) => (
                    <LogoutButton onClick={logOut} $active={active}>
                      <LogOut size={16} />
                      <span>Cerrar sesión</span>
                    </LogoutButton>
                  )}
                </Menu.Item>
              </Dropdown>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default UserMenu;