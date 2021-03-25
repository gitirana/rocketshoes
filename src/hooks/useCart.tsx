import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");

    console.log("storage: ", storagedCart);

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const product = cart.find((p) => p.id === productId);

      const stockData = await api.get(`/stock/${productId}`);
      const stockAmount = stockData.data.amount;

      if (stockAmount <= 0) {
        toast.error("O produto não tem estoque.");
        return;
      }

      if (!product) {
        const productsData = await api.get(`/products/${productId}`);

        const addNewProduct = {
          ...productsData.data,
          amount: 1,
        };

        const newProductIntoCart = [...cart, addNewProduct];

        setCart(newProductIntoCart);
        localStorage.setItem(
          "@RocketShoes:cart",
          JSON.stringify(newProductIntoCart)
        );
      } else {
        if (product.amount < stockAmount) {
          const updatedCart = [...cart];
          const index = updatedCart.findIndex(
            (product) => product.id === productId
          );

          updatedCart[index].amount += 1;

          setCart(updatedCart);
          localStorage.setItem(
            "@RocketShoes:cart",
            JSON.stringify(updatedCart)
          );
        } else {
          toast.error("O estoque não tem a quantidade solicitada do produto");
        }
      }
    } catch {
      toast.error("Não foi possivel adicionar um novo produto ao carrinho.");
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
