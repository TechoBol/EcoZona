import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import useAuthentication from "../hooks/useAuthentication";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuthentication();


  return (
    <Wrapper>
      <Card>
        <Logo>EcoZona</Logo>

        <Subtitle>
          Inicia sesión para continuar
        </Subtitle>

        <Field>
                <Input placeholder="Correo" />
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              </Field>

        <Field>
                <PasswordWrapper>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <IconWrapper onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconWrapper>
                </PasswordWrapper>
              </Field>

        <Button
          onClick={(e) => {
            e.preventDefault();
            signIn(email, password);
          }}
        >Iniciar sesión</Button>
        
      </Card>
    </Wrapper>
  );
}

export default Login;