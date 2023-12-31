import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {decoHome, frame, iconFacebook, iconZalo, logo, share} from "../../static";
import html2canvas from "html2canvas";
import API, { baseUrl } from "../../api";
import LoadingPage from "../loading";

import Swal from "sweetalert2";

import axios from "axios";



export default function ShowImage() {
    const location = useLocation();
    const infoData = location.state?.info;
    const frameBase64 = location.state?.frameBase64;
    const selectedImage = location.state?.selectedImage;
    const circularDivRef = useRef(null);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(); //ảnh share
    const navigate = useNavigate();
    const [linkShare, setLinkShare] = useState('');
    const id_oa='3427931215366581486';
    const handleConvertToBase64AndSaveImage = async () => {
        if (!!selectedImage) {
            html2canvas(circularDivRef.current, {
                allowTaint: true,
                useCORS: true,
                backgroundColor: "transparent",
            }).then(async (canvas) => {
                const base64Data = canvas.toDataURL();
                setImage(base64Data);
                const data = new FormData();
                data.append("base64", base64Data);

                try {
                    const response = await axios.post(API.convertBase64(), data);
                    if (response.data?.status) {
                        const linkShare = `${baseUrl}${response.data?.link}`;
                        setLinkShare(linkShare);
                    }
                } catch (error) {
                    console.error("Error converting to base64 and saving image:", error);
                }
            });
        }
    };


    const shareImage =async (type) => {
        if (!selectedImage) {
            Swal.fire({
                position: "top-end",
                icon: "warning",
                title: "Bạn chưa chọn ảnh",
                showConfirmButton: false,
                timer: 1500
            });

        }else {
            if( linkShare){
                const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${linkShare}`;


                if (type==='zalo'){
                    return (
                        <div
                            className="zalo-share-button"
                            data-href={linkShare}
                            data-oaid={id_oa}
                            data-layout="4"
                            data-color="blue"
                            data-customize="false"
                        >

                        </div>
                    );
                }else {
                    window.open(facebookShareUrl, '_blank', 'width=600,height=400');

                }
            }

        }
    };
    useEffect(() => {
        const convertBase64 = async () => {
            const data = new FormData();
            data.append("base64", image);
            try {
                const response = await axios.post(API.convertBase64(), data);
                if (response.data?.status) {
                    const linkShare = `${baseUrl}${response.data?.link}`;
                    setLinkShare(linkShare)

                }
            } catch (e) {

                console.error(e);
            }
        };

        convertBase64();
    }, [image]);

    const loadZaloSDK = () => {
        const script = document.createElement('script');
        script.src = 'https://sp.zalo.me/plugins/sdk.js';
        script.defer = true;

        script.onload = () => {
            console.log('Zalo SDK script loaded successfully');
            ZaloSocialSDK.reload(); // Gọi hàm reload() để khởi tạo lại widget
        };

        script.onerror = (error) => {
            // Handle script loading error
            console.error('Error loading Zalo SDK script:', error);
        };

        document.head.appendChild(script);
    };

    useEffect(() => {
        if(linkShare){
            loadZaloSDK();
        }

    }, [linkShare]);

    const handleCheckinEvent = async () => {
        if (!image) {
            Swal.fire({
                title: "Thử lại sau",
                icon: "error",
                confirmButtonText: "Xác nhận",
            });
        } else {
            try {
                setLoading(true);
                let formData = new FormData();
                formData.append("events_id", infoData?.id ||1);
                formData.append("phone", sessionStorage.getItem('phoneUser').trim());
                formData.append("image", image);
                formData.append("name", name);
                const res=await axios.post(API.checkinEvent(),formData)
                console.log(res)
                if (res?.status) {
                    downloadBase64Image();
                    shareImage('face');


                } else {
                    Swal.fire({
                        title: "Checkin thất bại",
                        icon: "error",
                        confirmButtonText: "Xác nhận",
                    }).then(() => {
                        navigate();
                    });
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    };


    useEffect(() => {
        handleConvertToBase64AndSaveImage()
    }, [selectedImage]);

    const downloadBase64Image = () => {
        if (image){
            const  fileName = "anh_check_in_su_kien_au_o.png"
            const downloadLink = document.createElement("a");
            downloadLink.href = image;
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };


    return (
        <div className="position-relative w-full h-full flex flex-col items-center justify-center bg-[#92D3F9] relative main-home h-screen">


            <img
                src={decoHome}
                className="absolute top-0 right-0 w-[240px] h-[115px]"
                alt={''}
            />
            {
                linkShare !==''?(<div className='position-absolute w-100'
                                      style={{ position: "absolute", top: "20px", zIndex: 10 }}
                                      role={'button'}>
                    <div className="d-flex justify-content-end relative w-[50%] h-[60px] items-center p-1 gap-2"
                         style={{
                             background:`url(${share})`,
                             backgroundSize:'cover'
                         }}>

                        <img src={iconFacebook} alt="" className='size-11'   onClick={()=>shareImage('face')} />


                        <div
                            className="zalo-share-button"
                            data-href={linkShare}
                            data-oaid={id_oa}
                            data-layout="4"
                            data-color="blue"
                            data-customize="false"

                        >

                        </div>



                    </div>

                </div>):(
                    <div
                        className="flex items-center justify-between w-full"
                        style={{ position: "absolute", top: "70px", zIndex: 10 }}
                    >

                        <button className="mx-auto">
                            <img src={logo} className="w-32 h-auto" alt={''} />
                        </button>
                    </div>)
            }


            {!selectedImage?(
                ''
            ):(

                <div className="relative bg-transparent p-2 w-100">
                    <div
                        id="download"
                        ref={circularDivRef}
                        className="relative flex items-center justify-center mx-auto"
                        style={{
                            width: '100%',
                            height: 'auto',
                            aspectRatio:'1/1',
                            backgroundImage: `url('data:image/jpeg;base64,${frameBase64}')`,
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            overflow: "hidden",
                            background: "transparent",
                        }}
                    >
                        <div className="w-[80%] h-[80%] rounded-full overflow-hidden bg-transparent">
                            <img
                                src={selectedImage}
                                className="w-[100%] h-[100%] rounded-full mx-auto circular-image object-fit-cover"
                                alt={''}
                            />
                        </div>
                        <div className="absolute bg-transparent">
                            <img
                                src={`data:image/jpeg;base64,${frameBase64}`}
                                style={{
                                    width:'100%',
                                    height: 'auto',
                                    aspectRatio:'1/1'
                                }}
                                alt={''}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="absolute w-full bottom-0 flex items-center justify-center py-2 bg-[#92D3F9] z-10">
                <button
                    className="bg-[#1E9FF2] min-h-[50px] rounded-full flex items-center justify-center w-[90%]"
                    onClick={handleCheckinEvent}
                >
          <span className="text-[#FFFFFF] text-base text-center font-normal">
            Check In Tham Gia
          </span>
                </button>
            </div>
            {loading && <LoadingPage />}
        </div>
    );
}
