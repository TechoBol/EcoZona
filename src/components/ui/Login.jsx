import styled, { createGlobalStyle } from "styled-components";

export const Wrapper = styled.div`
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffffff;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 350px;

  display: flex;
  flex-direction: column;
  justify-content: center; /* 🔥 centra contenido vertical */

  background: #ffffff;
  border-radius: 25px;
  padding: 24px;

  box-sizing: border-box;

  max-height: 100%; /* 🔥 evita overflow */
`;

export const Logo = styled.h1`
  text-align: center;
  color: #404594;
  font-family: var(--font-title);

  font-size: 45px;
  font-weight: 700;

  margin-bottom: 20px;
`;

export const Title = styled.h2`
  text-align: center;
`;

export const Subtitle = styled.p`
  text-align: center;
  font-size: 14px;
  color: black;
  margin-bottom: 10px;
  margin-top: 20px;
`;

export const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 45px 0 15px; /* espacio para el icono */

  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 20px;

  font-size: 14px;
  color: rgba(0, 0, 0, 0.63);

  outline: none;

  &::placeholder {
    color: rgba(0, 0, 0, 0.4);
  }
`;

export const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

export const Button = styled.button`
  width: 100%;
  height: 48px;
  margin-top: 5px;

  background-color: #404594;
  color: #ffffff;

  border: none;
  border-radius: 30px;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover { 
    opacity: 0.95;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const LinkText = styled.p`
  text-align: center;
  font-size: 14px;
  margin-top: 10px;
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

export const IconWrapper = styled.div` /*El icono del ojito*/
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  color: rgba(0, 0, 0, 0.5);
`;
