import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const Container = styled.div`
  background: white;
  width: 100%;
  padding: 40px;
  border-radius: 15px;
  border: 1px solid #e5e7eb;
`;

export const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: #f3f4f6;

  display: flex;
  justify-content: center;
  padding: 40px;
`;

export const Title = styled.h1`
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #374151;
  margin-bottom: 40px;
`;

export const Grid = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
`;

export const Card = styled.div`
  width: 180px;     
  height: 180px;     
  padding: 20px;

  border-radius: 16px;
  border: 1px solid #cbd5e1;
  background: #f3f4f6;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
    transform: translateY(-5px);
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;

  svg {
    width: 60px;
    height: 60px;
  }
`;

export const Label = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #111827;
`;

export const StyledLink = styled(NavLink)`
  text-decoration: none;
  color: inherit;
  display: flex;   
`;