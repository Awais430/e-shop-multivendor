import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url } from "../../server";
import { styled } from "@material-ui/core";
import styles from "../../styles/styles";
import axios from "axios";
import { server } from "../../server";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";

// here i implement two way using seller and get-info-shop
const ShopInfo = ({ isOwner }) => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  const { id } = useParams();
  const [data, setData] = useState({});
  
  useEffect(() => {
    dispatch(getAllProductsShop(id));

    axios
      .get(`${server}/shop/get-shop-info/${id}`)
      .then((res) => {
        console.log(res);
        setData(res.data.shop);
      })
      .catch((error) => console.log(error));
  }, []);
  console.log(data.avatar);
  const navigate = useNavigate();
  const logoutHandler = async () => {
    axios.get(`${server}/shop/logout`, {
      withCredentials: true,
    });
    window.location.reload();
    navigate("/shop-login");
  };
  const { seller } = useSelector((state) => state.seller);
  console.log(seller);
  return (
    <div>
      <div className="w-full py-5 ">
        <div className="w-full flex items-center justify-center">
          <img
            src={`${backend_url}/${data.avatar}`}
            className="w-[150px] h-[150px] object-cover rounded-full"
            alt="sorry"
          />
        </div>
        <h3 className="text-center py-2 text-[20px]"> {data.name}</h3>
        <p className="text-[16px] text-[#000000a6] p-[10px] flex items-center">
          {data.description}
        </p>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Address</h5>
        <h4 className="text-[#000000a6]">{data.address}</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Phone Number</h5>
        <h4 className="text-[#000000a6]">{data.phoneNumber}</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Total Products</h5>
        <h4 className="text-[#000000a6]">{products && products.length}</h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600]">Join On</h5>
        <h4 className="text-[#000000a6]">{data?.createdAt?.slice(0, 10)}</h4>
      </div>
      {isOwner && (
        <div className="py-3 px-4">
          <Link to="/settings">
            <div
              className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
            >
              <span className="text-white"> Edit Shop</span>
            </div>
          </Link>
          <div
            className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
            onClick={logoutHandler}
          >
            <span className="text-white"> Log Out</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopInfo;
