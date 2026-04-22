import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useLoginStore } from "../store/loginStore";
import useAuthentication from "../../hooks/useAuthentication";
import { LogOut } from "lucide-react";

import {
  ProfileButton,
  Initial,
  Dropdown,
  UserInfo,
  Name,
  Role,
  LogoutButton,
} from "../ui/Inventory";

const UserMenu = () => {
  const { fullName, role } = useLoginStore();
  const { logOut } = useAuthentication();

  const initial = fullName ? fullName.charAt(0).toUpperCase() : "?";

  return (
    <Menu as="div" style={{ position: "relative" }}>
      {/* 🔥 BOTÓN CORRECTO */}
      <Menu.Button>
        <ProfileButton>
          <Initial>{initial}</Initial>
        </ProfileButton>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        {/* 🔥 ESTO ES CLAVE */}
        <Menu.Items>
          <Dropdown>
            {/* INFO */}
            <UserInfo>
              <Name>{fullName}</Name>
              <Role>{role}</Role>
            </UserInfo>

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