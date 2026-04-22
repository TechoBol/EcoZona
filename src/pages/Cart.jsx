import React, { useState } from "react";
import emptyCart from "../assets/Images/EmptyCart.jpeg";

import {
  Wrapper,
  Header,
  Title,
  SearchButton,
  Content,
  Image,
  MainText,
  SubText,
  Button
} from "../components/ui/Cart";

import { Search } from "lucide-react";

function Cart() {
  return (
    <Wrapper>

      {/* HEADER */}
      <Header>
        <Title>Carrito</Title>

        <SearchButton>
          <Search size={20} />
        </SearchButton>
      </Header>

      {/* EMPTY STATE */}
      <Content>
        <Image src={emptyCart} alt="carrito vacio" />
        <MainText>Ohhh... El carrito esta vacio</MainText>
        <SubText>Es hora de llenarlo</SubText>

        <Button>Comprar</Button>
      </Content>

    </Wrapper>
  );
}

export default Cart;