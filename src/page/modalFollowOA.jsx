import React, { useContext } from "react";
import { logo } from "../static";

const ModalFollowOA = ({ handleFollow }) => {
    return (
        <div className="flex items-center w-full h-full bg-[#000000] bg-opacity-80 absolute top-0 left-0 z-50">
            <div className="w-[90%] m-auto bg-white rounded-lg">
                <div className="flex flex-col items-center pb-2 pt-1">
                    <img
                        src={logo}
                        className=" w-48 h-auto object-contain mx-auto my-6"
                        alt={''}
                    />
                    <p className="text-base text-center font-bold text-black">
                        Quan tâm ẦU Ơ
                    </p>
                    <p className="text-sm leading-6 mt-2 text-center text-black">
                        Hãy quan tâm ẦU Ơ ngay để có thể sử dụng đầy đủ chức năng
                    </p>
                    <button
                        className="flex items-center justify-center w-[50%] rounded-xl border px-4 py-2 border-blue-500 my-5 text-base text-black"
                        onClick={handleFollow}
                    >
                        Đã hiểu
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ModalFollowOA;
