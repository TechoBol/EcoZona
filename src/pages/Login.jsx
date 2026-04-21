import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Wrapper,
  LeftPanel,
  RightPanel,
  LogoContainer,
  LogoMain,
  LogoSRL,
  Form,
  Title,
  Subtitle,
  Input,
  Button,
  LinkText,
  Field,
  Label,
  PasswordWrapper,
  Card,
  EyeIcon,
} from "../components/ui/Login";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>

      <Wrapper>
        <Card>
          {/* IZQUIERDA */}
          <LeftPanel>
            <LogoContainer>
              <LogoMain>
                <h1 className="white">TECHO</h1>
                <h1 className="red">BOL</h1>
              </LogoMain>
              <LogoSRL>SRL</LogoSRL>
            </LogoContainer>
          </LeftPanel>

          {/* DERECHA */}
          <RightPanel>
            <Form>
              <Title>Iniciar sesión</Title>
              <Subtitle>
                Ingrese sus credenciales para acceder al sistema
              </Subtitle>

              {/* EMAIL */}
              <Field>
                <Label>Email</Label>
                <Input placeholder="Email" />
              </Field>

              {/* PASSWORD */}
              <Field>
                <Label>Contraseña</Label>
                <PasswordWrapper>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                  />
                  <EyeIcon onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </EyeIcon>
                </PasswordWrapper>
              </Field>

              <Button onClick={() => navigate("/home")}>Iniciar sesión</Button>

              <LinkText>¿Olvidó su contraseña?</LinkText>
            </Form>
          </RightPanel>
        </Card>
      </Wrapper>
    </>
  );
};

export default Login;
