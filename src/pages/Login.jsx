import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// 👇 IMPORT CORRECTO
import {
  Wrapper,
  Card,
  Logo,
  Title,
  Subtitle,
  Input,
  PasswordWrapper,
  Button,
  LinkText,
  Field,
  Label,
  IconWrapper
} from "../components/ui/Login";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Wrapper>
      <Card>
        <Logo>EcoZona</Logo>

        <Subtitle>
          Inicia sesión para continuar
        </Subtitle>

        <Field>
                <Input placeholder="Correo" />
              </Field>

        <Field>
                <PasswordWrapper>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                  />
                  <IconWrapper onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconWrapper>
                </PasswordWrapper>
              </Field>

        <Button>Iniciar sesión</Button>

      </Card>
    </Wrapper>
  );
}

export default Login;