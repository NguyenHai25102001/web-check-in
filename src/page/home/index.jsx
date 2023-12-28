import React, { useContext, useState, useEffect, useRef } from "react";
import { checkHome, decoHome, logo } from "../../static";
import { useNavigate } from "react-router-dom";
import { REQUEST_API } from "../../api/method";

import Swal from "sweetalert2";
import ModalFollowOA from "../modalFollowOA";
import {useAuth} from "../../context/app.context";
import ModalAlertFollow from "../modalAlertFollow";
import LoadingPage from "../loading";
import API from "../../api";
import axios from "axios";
const APP_ID = "1459253300279989714";
export const ID_OA = "3427931215366581486";


export default function Home() {
    const navigate = useNavigate();
    const [data, setData] = useState();
    const [frameBase64, setFrameBase64] = useState();
    const { phoneUser, setPhoneUser, setShowModalFollow, showModalFollow } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isFollowOA, setIsFollowOA] = useState(false);
    const refModalAlertFollow = useRef(null);
    const [code, setCode] = useState("");
    const [isCheckin, setIsCheckin] = useState(true); //true cho checkin

    useEffect(() => {
           setPhoneUser(sessionStorage.getItem('phoneUser').trim())
        }, []);


    const handleChooseImage = async () => {
        navigate('/show-image',{state:{frameBase64}})

    };
    const getEvent = async () => {
        try {
            let formData = new FormData();
            formData.append("app_id", APP_ID);
            formData.append("phone", phoneUser);
            const [res] = await Promise.all([
                REQUEST_API({
                    url: API.getEvent(),
                    method: "post",
                    data: formData,
                }),
            ]);
            setIsCheckin(res?.check);
            if (res?.status) {
                setData(res?.event);
                setFrameBase64(res?.base64);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getEvent();
    }, []);

    // follow OA
    const follow = async () => {

        try {
            const phoneUser=sessionStorage.getItem('phoneUser').trim();

            setLoading(true);
            let formData = new FormData();
            formData.append("phone", phoneUser);
            formData.append("type", "1");
            formData.append("app_id", APP_ID);
            const [res] = await Promise.all([
                REQUEST_API({
                    url: API.followOA(),
                    method: "post",
                    data: formData,
                }),
            ]);
            if (res.status) {
                setShowModalFollow(false);
                setIsFollowOA(true);
                navigate('/show-image')
            } else {
                alert(res.msg);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async () => {

        try{
            setShowModalFollow(false);
            const data = new FormData();
            data.append("phone", phoneUser);
            data.append("app_id", APP_ID);
            data.append("type", 1);
             const response= await  axios.post(API.followOA(),data);

        }catch (e) {
            console.log(e)
        }


    };

    const handleFollowFromAlert = async () => {
      follow();
    };



    useEffect(() => {
        const checkFollow = async () => {
            if (!phoneUser) return;

            try {
                const data = new FormData();
                data.append("phone", phoneUser);
                data.append("app_id", APP_ID);

                const response = await axios.post(API.checkFollow(), data);
                const res = response.data;
                if (res.checkCode) {
                    setCode(res.code);
                }

                if (!res.status && res.msg?.includes("Chưa follow OA!")) {
                    setShowModalFollow(true);
                    setIsFollowOA(false);
                } else if (res.status) {
                    setShowModalFollow(false);
                    setIsFollowOA(true);
                } else {
                    console.error("Unexpected response:", res);
                    // Handle unexpected response here, such as showing an alert
                }
            } catch (error) {
                console.error("Error during checkFollow:", error);
                // Handle the error, e.g., show a user-friendly error message
            }
        };

        if (phoneUser !=='') {
            checkFollow();
        }
    }, [phoneUser]);


    return (
        <div className="w-full h-full bg-[#E2F6FF] overflow-y-scroll no-scrollbar relative">
            <div className="relative">
                <img
                    src={decoHome}
                    className="absolute top-0 right-0 w-[240px] h-[115px]"
                    alt={''}
                />
            </div>
            <div className="w-full h-[100vh] flex items-center flex-col pt-12 relative">
                <img src={logo} className="w-40 h-auto" alt={''}/>
                <img src={checkHome} className="w-32 h-42 object-contain mt-10" alt={''}/>
                {!isCheckin && (
                    <p className="text-[#28A3F2] text-xl mx-6 text-center font-bold mt-5 uppercase">
                        Bạn đã checkin
                    </p>
                )}
                <p className="text-[#28A3F2] text-xl leading-9 text-center font-bold my-5">
                    Chào mừng bạn đến với
                    <br /> Sự Kiện {data?.name}
                </p>
                <div className="w-full px-6">
                    <p className="text-[#405062] text-base text-center font-normal mb-20">
                        {/*{data?.description}*/}
                    </p>
                </div>
            </div>

            <div className="absolute w-full bottom-0 flex flex-col items-center justify-center py-2 bg-[#E2F6FF] z-10">
                <button
                    className="bg-[#1E9FF2] min-h-[50px] rounded-full flex items-center justify-center w-[90%]"
                    onClick={() => {
                        if (isFollowOA && isCheckin) {

                            handleChooseImage()
                        } else if (!isCheckin && isFollowOA) {
                            Swal.fire({
                                title: "Bạn đã Checkin",
                                icon: "info",
                                confirmButtonText: "Xác nhận",
                            });
                        } else {
                            refModalAlertFollow.current?.setShowModal(true);
                        }
                    }}
                >
          <span className="text-[#FFFFFF] text-base text-center font-normal">
            Chụp Ảnh Check In
          </span>
                </button>
            </div>
            {showModalFollow && <ModalFollowOA handleFollow={handleFollow} />}
            <ModalAlertFollow
                ref={refModalAlertFollow}
                followNow={() => {
                    handleFollowFromAlert();
                }}
            />
            {loading && <LoadingPage />}
        </div>
    );
}

