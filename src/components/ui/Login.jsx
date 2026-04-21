import styled, { createGlobalStyle } from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%; /* 🔥 AGREGA ESTO */
  padding: 40px;
  background-color: #f3f4f6;
`;

export const Card = styled.div`
  display: flex;
  width: 100%;
  border-radius: 25px;
  background: white;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

/* IZQUIERDA */
export const LeftPanel = styled.div`
  flex: 1;
  background-color: #0b132b;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

/* LOGO */
export const LogoContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;

export const LogoMain = styled.div`
  display: flex;

  h1 {
    font-size: 70px;
    font-weight: 800;
    margin: 0;
  }

  .white {
    color: white;
  }

  .red {
    color: #e74c3c;
  }
`;

export const LogoSRL = styled.span`
  color: white;
  font-size: 22px;
  font-weight: 800;
  position: relative;
  bottom: -20px;
`;

/* DERECHA */
export const RightPanel = styled.div`
  width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 60px 60px 120px;
`;

export const Form = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h2`
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 5px;
  text-align: center;
  color: black;
`;

export const Subtitle = styled.p`
  color: #9ca3af;
  font-size: 16px;
  margin-bottom: 25px;
  text-align: left;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const Label = styled.label`
  font-size: 14px;
  margin-bottom: 5px;
  text-align: left;
  color: black;
  font-weight: 700;
`;

export const Input = styled.input`
  width: 100%;
  height: 38px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  padding: 10px;
  color: black;

  &:focus {
    outline: none;
    border: 1px solid #0b132b;
    background: white;
    color: black;
  }
`;

export const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const EyeIcon = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #6b7280;

  display: flex;
  align-items: center;
`;

export const Button = styled.button`
  width: 100%;
  height: 45px;
  border-radius: 10px;
  border: none;
  background-color: #0b132b;
  color: white;
  cursor: pointer;
  font-weight: 600;
  margin-top: 10px;

  &:hover {
    opacity: 0.95;
  }
`;

export const LinkText = styled.span`
  margin-top: 15px;
  font-size: 14px;
  color: gray;
  text-align: center;
  cursor: pointer;
text-decoration: underline;
  &:hover {
    color:black;
  }
`;
