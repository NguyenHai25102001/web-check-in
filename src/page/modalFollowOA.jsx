import React, { useContext } from "react";
import { logo } from "../static";

export const ID_OA = "3427931215366581486";


const ModalFollowOA = ({ handleFollow }) => {

    window.handleFollow = (res) => {
        handleFollow()
    };

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

                    <div className="mt-2"  role={'button'}>
                        {
                            ID_OA&& <div className="zalo-follow-only-button w-100 h-100"
                                         data-oaid={ID_OA}
                                         data-callback="handleFollow"
                            >
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ModalFollowOA;
