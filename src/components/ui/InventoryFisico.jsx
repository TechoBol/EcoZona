import styled from "styled-components";
import { theme } from "./Theme";

/* WRAPPER GENERAL */
export const Wrapper = styled.div`
  min-height: 100dvh;
  background: ${theme.colors.background};
  padding: 20px;

  @media (max-width: 600px) {
    padding: 12px;
  }
`;

/* HEADER */
export const Header = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 20px;
  gap: 10px;

  @media (max-width: 600px) {
    grid-template-columns: auto 1fr;
  }
`;

/* TITLE */
export const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  font-family: var(--font-title);

  @media (max-width: 600px) {
    font-size: 18px;
  }
`;

/* CONTAINER CENTRAL */
export const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;

  width: 100%;
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: 600px) {
    padding: 10px;
    gap: 14px;
  }
`;

/* SECTION (CARDS) */
export const Section = styled.div`
  background: ${theme.colors.background};
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  width: 100%;

  @media (max-width: 768px) {
    padding: 14px;
  }
`;

/* ROW (LABEL + INPUT) */
export const Row = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 10px;
  align-items: center;
  margin-bottom: 12px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 6px;
  }
`;

/* LABEL */
export const Label = styled.label`
  font-size: 13px;
  color: ${theme.colors.textSecondary};
`;

/* INPUT */
export const Input = styled.input`
  height: 40px;
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.2);
  padding: 0 12px;
  font-size: 13px;
  outline: none;
  background: #fff;

  transition: all 0.2s ease;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(0,0,0,0.05);
  }
`;

/* SELECT */
export const Select = styled.select`
  height: 40px;
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.2);
  padding: 0 12px;
  font-size: 13px;
  outline: none;
  background: #fff;

  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

/* DATE ROW */
export const DateRow = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

/* CHECKBOX GROUP */
export const CheckboxRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
`;

/* RADIO GROUP */
export const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

/* FOOTER */
export const Footer = styled.div`
  position: sticky;
  bottom: 0;
  background: ${theme.colors.background};
  padding: 10px 0;
`;

/* BUTTON */
export const Button = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 30px;
  background: ${theme.colors.primary};
  color: white;
  border: none;
  font-weight: 600;
  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 600px) {
    height: 52px;
    font-size: 15px;
  }
`;