import React, {useContext, useState} from "react";

import axios from "axios";
import LoadingPage from "./loading";
import { REQUEST_API } from "../api/method";
import {AppContext, useAuth} from "../context/app.context";
import API from "../api";
import ModalFollowOA from "./modalFollowOA";
import {logo} from "../static"
import Swal from "sweetalert2";
import {setSelectionRange} from "@testing-library/user-event/dist/utils";
const ModalRequestPhone = () => {
    const { phoneUser, setPhoneUser, showModalFollow, setShowModalFollow } =
        useAuth();
    const [loading, setLoading] = React.useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [phone, setPhone] = useState()

    const handleLogin = async () => {
      setIsOpen(true)

    };
    const closeMiniApp = async () => {
        // try {
        //     await closeApp({});
        // } catch (error) {
        //     console.log(error);
        // }
    };


     const handleSubmitPhone = async (e) => {
         e.preventDefault();
         console.log(phone)
         if(phone && /^\d{10}$/.test(phone)){
             setPhoneUser(phone)
             sessionStorage.setItem('phoneUser',phone)
             console.log(phoneUser)
             window.location.href='/home'
         }else {
             Swal.fire({
                 position: "top",
                 icon: "error",
                 html: "<div class='fs-6'>Số điện thoại không hợp lệ</div>",
                 showConfirmButton: false,
                 timer: 1500
             });

         }



     }
    return (
        <div className="absolute  p-0 m-0 w-full h-full flex flex-cols items-center justify-center bg-[#222222] main-home ">

            {
                isOpen ?(
                    <div className="bg-white position-absolute rounded w-10/12">
                        <div className="text-center fs-3 p-2">Vui lòng nhập số điện thoại</div>
                        <form action="" onSubmit={handleSubmitPhone}>
                            <div className="p-2 flex">
                                <input type="text" name="phome"
                                       id="phone"
                                       value={phone}
                                       onChange={(e)=>setPhone(e.target.value)}
                                       className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Số điện thoại..."/>
                                <button className="ms-1 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                    ):(
                    <div className="w-[90%] rounded-xl bg-white px-4 ">
                        <img src={logo} className=" w-48 h-auto object-contain mx-auto my-6" alt={''}/>
                        <p className=" font-bold uppercase text-center text-lg leading-6 mb-2">
                            CHÀO MỪNG ĐẾN VỚI ẦU Ơ
                        </p>
                        <p className=" font-semibold text-base leading-6 mt-2">
                            Chúng tôi cần số điện thoại của bạn để :
                        </p>
                        <div className="flex items-center mt-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="21"
                                height="20"
                                viewBox="0 0 21 20"
                                fill="none"
                            >
                                <path
                                    d="M7.01855 4L13.0186 10L7.01855 16"
                                    stroke="#01B2FF"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <p className=" font-medium text-base leading-6 m-0">
                                Định danh tài khoản.
                            </p>
                        </div>

                        <div className="flex items-center mt-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="21"
                                height="20"
                                viewBox="0 0 21 20"
                                fill="none"
                            >
                                <path
                                    d="M7.01855 4L13.0186 10L7.01855 16"
                                    stroke="#01B2FF"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <p className=" font-medium text-base leading-6 m-0">
                                Thông báo quà tặng
                            </p>
                        </div>

                        <p className=" font-medium text-base  leading-6 mt-2 p-0">
                            Vui lòng đồng ý chia sẻ số điện thoại với MiniGame ẦU Ơ để liên kết
                            tài khoản.
                        </p>
                        <p className="font-medium text-base text-center leading-6 mt-2"></p>
                        <button
                            className="w-[100%] py-2 flex items-center justify-center border-2 border-[#01B2FF] bg-blue mt-4 mb-3 rounded-md"
                            onClick={handleLogin}
                        >
                            <p className="text-base text-blue-500 font-light m-0">
                                Liên kết số điện thoại.
                            </p>
                        </button>
                        <button
                            className="w-full box-content py-2 flex items-center justify-center border-2 border-[#01B2FF] mb-6 rounded-md"
                            onClick={closeMiniApp}
                        >
                            <p className="text-base text-black font-light m-0">Từ chối và thoát</p>
                        </button>
                    </div>
                    )
            }

            {loading && <LoadingPage />}
        </div>
    );
};
export default ModalRequestPhone;
