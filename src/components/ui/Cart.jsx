import styled from "styled-components";

/* WRAPPER */
export const Wrapper = styled.div`
  min-height: 100vh;
  background: #ffffff;
  padding: 20px;
`;

/* HEADER */
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

export const Title = styled.h1`
  font-family: var(--font-title);
  font-size: 28px;
  font-weight: 700;
`;

export const SearchButton = styled.div`
  width: 40px;
  height: 40px;

  display: flex;
  justify-content: center;
  align-items: center;

  color: #3D44C9;
  cursor: pointer;
`;

/* CONTENT */
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
`;

/* IMAGE */
export const Image = styled.img`
  width: 420px;
  margin-bottom: 25px;
`;

/* TEXTS */
export const MainText = styled.h2`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 5px;
`;

export const SubText = styled.p`
  font-size: 14px;
  color: gray;
  margin-bottom: 30px;
`;

/* BUTTON */
export const Button = styled.button`
  width: 100%;
  max-width: 280px;
  height: 48px;

  background-color: #3D44C9;
  color: #ffffff;

  border: none;
  border-radius: 25px;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  &:active {
    transform: scale(0.98);
  }
`;