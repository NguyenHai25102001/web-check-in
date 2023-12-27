import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { decoHome, frame, logo, share } from "../../static";
import html2canvas from "html2canvas";
import { saveImageToGallery } from "zmp-sdk";
import { useSnackbar } from "zmp-ui";
import API, { baseUrl } from "../../api";
import { REQUEST_API } from "../../api/method";
import { useAuth} from "../../context/app.context";
import LoadingPage from "../loading";

import Swal from "sweetalert2";
import { FacebookShareButton, FacebookIcon } from "react-share";
import axios from "axios";

const WIDTH_WINDOW = window.innerWidth;

export default function ShowImage() {
    const location = useLocation();
    const item = location.state?.imageFile;
    const infoData = location.state?.info;
    const frameBase64 = location.state?.frameBase64;
    const [imageSrc, setImageSrc] = useState("");
    const [base64View, setBase64View] = useState("");
    const { openSnackbar } = useSnackbar();
    const circularDivRef = useRef(null);
    const { phoneUser, setPhoneUser } = useAuth();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [linkShare, setLinkShare] = useState("");
    const navigate = useNavigate();

    const [selectedImage, setSelectedImage] = useState(null);
    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setImageSrc(file)
            const reader = new FileReader();

            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };

            reader.readAsDataURL(file);
        }


    };

    const shareImage = () => {
        if (!selectedImage) {
            Swal.fire({
                position: "top-end",
                icon: "warning",
                title: "Bạn chưa chọn ảnh",
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }


        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${linkShare}`;

        window.open(facebookShareUrl, '_blank', 'width=600,height=400');
    };




    const handleConvertToBase64AndSaveImage = () => {

    };

    const fetchBlobImage = async () => {
        // ... (your existing code for fetching blob image)
    };

    const getUser = async () => {
        // ... (your existing code for getting user info)
    };

    const hanldeGetViewBase64 = () => {
        // ... (your existing code for getting view base64)
    };

    useEffect(() => {
        fetchBlobImage();
        getUser();
    }, []);

    useEffect(() => {
        hanldeGetViewBase64();
    }, [imageSrc]);

    const handleCheckinEvent = async () => {
        if (!selectedImage || !linkShare) {
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
                formData.append("image", selectedImage);
                formData.append("name", name);
                const res=await axios.post(API.checkinEvent(),formData)
                console.log(res)
                if (res?.status) {
                    // handleAlert();
                    shareImage();
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

    const getUrlImage = async () => {
        if (!selectedImage) return;
        try {
            const data=new FormData();
            data.append("base64",selectedImage)
           const response=await axios.post(API.convertBase64(),data)
            console.log(response.data)
            if(response.data?.status){
                setLinkShare(`${baseUrl}${response.data?.link}`);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUrlImage();
    }, [selectedImage]);

    const handleAlert = () => {
        // ... (your existing code for handling alert)
    };

    return (
        <div className="position-relative w-full h-full flex flex-col items-center justify-center bg-[#92D3F9] relative main-home h-screen">
            <img
                src={decoHome}
                className="absolute top-0 right-0 w-[240px] h-[115px]"
                alt={''}
            />
            {
                imageSrc?(<div className='position-absolute w-100'
                               style={{ position: "absolute", top: "50px", zIndex: 10 }}
                   onClick={shareImage} role={'button'}>
                    <div className="d-flex justify-content-start w-100">
                        <img src={share} alt="" className='ms-2'/>
                    </div>

                </div>):(
                    <div
                        className="flex items-center justify-between w-full"
                        style={{ position: "absolute", top: "70px", zIndex: 10 }}
                    >
                        {/* <button className="mt-3" onClick={() => shareImage()}>
          <img src={share} className="w-36 h-12" />
        </button> */}
                        <button className="mx-auto">
                            <img src={logo} className="w-32 h-auto" alt={''} />
                        </button>
                    </div>)
            }



            <div className="relative bg-transparent">
                <div
                    id="download"
                    ref={circularDivRef}
                    className="relative flex items-center justify-center mx-auto"
                    style={{
                        // width: WIDTH_WINDOW * 0.95,
                        // height: WIDTH_WINDOW * 0.95,
                        backgroundImage: `url('data:image/jpeg;base64,${frameBase64}')`,
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        overflow: "hidden",
                        background: "transparent",
                    }}
                >
                    {
                        imageSrc?( <div className="w-[100%] h-[100%] rounded-full overflow-hidden bg-transparent relative z-40 position-relative"
                        style={{
                            // background:`url(${frame})`
                            // ,backgroundSize:'cover',
                            // backgroundPosition: 'center',
                        }}>
                            <img src={selectedImage} alt="" className='w-100 rounded-full p-5 object-fit-cover ratio ratio-1x1'
                            style={{
                                minWidth:'400px',
                                minHeight:'400px',
                                aspectRatio:'1/1'

                            }}/>
                            <img src={frame} alt="" className='w-100 rounded-full position-absolute z-3 top-0'  />


                        </div>):(
                            <button type={'button'}   className='bg-[#1E9FF2] min-h-[50px] rounded-full flex items-center justify-center'>
                                <input type="file" id="show_image" className="d-none" onChange={handleImageChange} accept={'image/*'} />
                                <label role={'button'} htmlFor="show_image" className='p-2 text-[#FFFFFF] text-base text-center font-normal'>Chọn ảnh</label>
                            </button>
                        )
                    }

                    <div className="absolute bg-transparent">
                        {/*<img*/}
                        {/*    src={`data:image/jpeg;base64,${frameBase64}`}*/}
                        {/*    style={{*/}
                        {/*        width: WIDTH_WINDOW * 0.95,*/}
                        {/*        height: WIDTH_WINDOW * 0.95,*/}
                        {/*    }}*/}
                        {/*/>*/}
                    </div>
                </div>
            </div>
            <div className="absolute w-full bottom-0 flex items-center justify-center py-2 bg-[#92D3F9] z-10">
                <button
                    className="bg-[#1E9FF2] min-h-[50px] rounded-full flex items-center justify-center w-[90%]"
                    onClick={handleConvertToBase64AndSaveImage}
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
