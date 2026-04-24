import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useLoginStore } from "../store/loginStore";
import useAuthentication from "../../hooks/useAuthentication";
import { LogOut, Building2, Users, User, ShoppingCart } from "lucide-react";

import {
  ProfileButton,
  Dropdown,
  UserInfo,
  Name,
  Role,
  LogoutButton,
  MenuOption
} from "../ui/Inventory";
import { useSucursales } from "../../hooks/useSucursales";
import { useEmployees } from "../../hooks/useEmployees";
import { useRoles } from "../../hooks/useRoles";
import { useSales } from "../../hooks/useSale";

const UserMenu = () => {
  const { fullName, role } = useLoginStore() || {};
  const displayName = fullName || "Usuario";
  const { logOut } = useAuthentication();
  const { goToSucursales } = useSucursales();
  const {goToTrabajadores} = useEmployees();
  const {goToRoles} = useRoles();
  const {goToSales} = useSales();
  const initial = fullName ? fullName.charAt(0).toUpperCase() : "?";

  return (
    <Menu as="div" style={{ position: "relative", display: "flex", justifyContent: "flex-start" }}>


      {/* BOTÓN */}
      <Menu.Button
        style={{
          all: "unset",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
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

            {/* OPCIONES NUEVAS */}
            <Menu.Item>
              {({ active }) => (
                <MenuOption onClick={goToSucursales} $active={active}>
                  <Building2 size={16} />
                  <span>Administrar sucursales</span>
                </MenuOption>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <MenuOption onClick={goToTrabajadores} $active={active}>
                  <Users size={16} />
                  <span>Administrar trabajadores</span>
                </MenuOption>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <MenuOption onClick={goToRoles} $active={active}>
                  <Users size={16} />
                  <span>Administrar roles</span>
                </MenuOption>
              )}
            </Menu.Item>

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
    </Menu>
  );
};

export default UserMenu;