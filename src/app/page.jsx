"use client"; // ← これを追加

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [code, setCode] = useState("");
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);

  const fetchProduct = async () => {
    try {
      const requestUrl = `http://localhost:8000/product/${code.trim()}`;
      console.log("送信URL:", requestUrl);

      const response = await axios.get(requestUrl);
      console.log("APIレスポンス:", response.data); // ここでレスポンスを確認

      if (response.data && response.data.NAME) {
        setProduct(response.data);
      } else {
        alert("商品が見つかりません");
      }
    } catch (error) {
      console.error("APIエラー:", error);
      alert("商品が見つかりません");
      setProduct(null);
    }
  };

  const addToCart = () => {
    if (product) {
      setCart([...cart, product]);
      setProduct(null);
      setCode("");
    }
  };

  const purchase = async () => {
    const request = {
      emp_cd: "9999999999",
      store_cd: "30",
      pos_no: "90",
      items: cart.map((item) => ({
        code: item.CODE,
        name: item.NAME,
        price: item.PRICE,
      })),
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/purchase",
        request
      );
      alert(`購入完了: 合計金額 ${response.data.total_amount}円`);
      setCart([]);
    } catch (error) {
      alert("購入処理に失敗しました");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 flex">
        <div className="w-1/2 pr-4 border-r">
          <input
            type="text"
            className="border p-2 w-full mb-2"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="商品コードを入力"
          />
          <button
            className="bg-blue-500 text-white w-full p-2 mb-4"
            onClick={fetchProduct}
          >
            商品コード 読み込み
          </button>
          {product && (
            <>
              <input
                type="text"
                className="border p-2 w-full mb-2"
                value={product.NAME}
                readOnly
              />
              <input
                type="text"
                className="border p-2 w-full mb-2"
                value={`${product.PRICE}円`}
                readOnly
              />
              <button
                className="bg-blue-700 text-white w-full p-2"
                onClick={addToCart}
              >
                追加
              </button>
            </>
          )}
        </div>
        <div className="w-1/2 pl-4">
          <h2 className="text-lg font-bold mb-2">購入リスト</h2>
          <div className="border p-4 h-40 overflow-auto mb-4">
            <ul>
              {cart.map((item, index) => (
                <li key={index} className="border-b py-1">
                  {item.NAME} x1 {item.PRICE}円
                </li>
              ))}
            </ul>
          </div>
          <button
            className="bg-green-500 text-white w-full p-2"
            onClick={purchase}
          >
            購入
          </button>
        </div>
      </div>
    </div>
  );
}
