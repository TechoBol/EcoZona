import React, { useState, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import useAuthentication from "../hooks/useAuthentication";

import {
  Wrapper,
  Card,
  Logo,
  Subtitle,
  Input,
  PasswordWrapper,
  Button,
  Field,
  IconWrapper
} from "../components/ui/Login";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, isLoading } = useAuthentication();

  const passwordRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(email, password);
  };

  return (
    <Wrapper>
      {/* FORM */}
      <Card as="form" onSubmit={handleSubmit}>
        <Logo>EcoZona</Logo>

        <Subtitle>
          Inicia sesión para continuar
        </Subtitle>

        <Field>
          <Input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}

            autoFocus
            autoComplete="email"
            enterKeyHint="next"

            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                passwordRef.current.focus();
              }
            }}
          />
        </Field>

        <Field>
          <PasswordWrapper>
            <Input
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}

              autoComplete="current-password"
              enterKeyHint="go"
            />

            <IconWrapper onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </IconWrapper>
          </PasswordWrapper>
        </Field>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Cargando..." : "Iniciar sesión"}
        </Button>
      </Card>
    </Wrapper>
  );
}

export default Login;