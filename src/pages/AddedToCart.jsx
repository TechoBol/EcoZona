import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useCartStore } from "../components/store/cartStore";
import {
    Wrapper,
    Card,
    LeftSection,
    ProductThumb,
    ProductMeta,
    ConfirmRow,
    ProductName,
    ProductQty,
    RightSection,
    SubtotalRow,
    SubtotalLabel,
    SubtotalValue,
    ItemCount,
    GoToCartButton,
    ContinueButton,
} from "../components/ui/AddedToCart";

const AddedToCart = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { product, quantity, imageUrl, token } = state || {};
    const inventoryPath = token ? `/inventory/${token}` : "/inventory";
    const cartPath = token ? `/cart/${token}` : "/cart";

    const { cartItems, getTotal } = useCartStore();
    const totalItems = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
    const subtotal = getTotal();

    if (!product) {
        navigate("/inventory", { replace: true });
        return null;
    }

    return (
        <Wrapper>
            <Card>
                <LeftSection>
                    <ProductThumb
                        src={imageUrl || "https://via.placeholder.com/150"}
                        alt={product.name}
                    />
                    <ProductMeta>
                        <ConfirmRow>
                            <CheckCircle2 size={15} />
                            Añadido al carrito
                        </ConfirmRow>
                        <ProductName>{product.name}</ProductName>
                        <ProductQty>Cantidad: {quantity}</ProductQty>
                    </ProductMeta>
                </LeftSection>

                <RightSection>
                    <SubtotalRow>
                        <SubtotalLabel>Subtotal del carrito</SubtotalLabel>
                        <SubtotalValue>Bs {subtotal.toFixed(2)}</SubtotalValue>
                        <ItemCount>{totalItems} {totalItems === 1 ? "producto" : "productos"} en el carrito</ItemCount>
                    </SubtotalRow>

                    <GoToCartButton onClick={() => navigate(cartPath)}>
                        <ShoppingCart size={17} />
                        Ir al carrito
                    </GoToCartButton>

                    <ContinueButton onClick={() => navigate(inventoryPath)}>
                        <ArrowLeft size={17} />
                        Seguir comprando
                    </ContinueButton>
                </RightSection>
            </Card>
        </Wrapper>
    );
};

export default AddedToCart;