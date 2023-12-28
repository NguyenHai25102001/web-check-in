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
    const infoData = location.state?.info;
    const frameBase64 = location.state?.frameBase64;
    const circularDivRef = useRef(null);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(); //ảnh share
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const handleConvertToBase64AndSaveImage = () => {
        if(!!selectedImage){
            html2canvas(circularDivRef.current, {
                allowTaint: true,
                useCORS: true,
                backgroundColor: "transparent",
            }).then((canvas) => {
                const base64Data = canvas.toDataURL();
                setImage(base64Data);
                // await saveImageToGallery({
                //     imageBase64Data: base64Data.toString(),
                //
                //     success: () => {
                //         openSnackbar({
                //             text: "Lưu ảnh thành công",
                //             type: "success",
                //             duration: 2000,
                //             position: "bottom",
                //         });
                //     },
                //     fail: (error) => {
                //         console.log(error);
                //     },
                // });
            });
        }

    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }

    };

    const shareImage =async () => {
        if (!selectedImage) {
            Swal.fire({
                position: "top-end",
                icon: "warning",
                title: "Bạn chưa chọn ảnh",
                showConfirmButton: false,
                timer: 1500
            });

        }else {
            try {
                const data=new FormData();
                data.append("base64",image)
                const response=await axios.post(API.convertBase64(),data)
                if(response.data?.status){
                    const linkShare =`${baseUrl}${response.data?.link}`;
                    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${linkShare}`;
                    window.open(facebookShareUrl, '_blank', 'width=600,height=400');
                }

            }catch (e) {
                console.log(e)
            }
        }
    };



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
                    shareImage();
                    downloadBase64Image();
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
                selectedImage?(<div className='position-absolute w-100'
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

                        <button className="mx-auto">
                            <img src={logo} className="w-32 h-auto" alt={''} />
                        </button>
                    </div>)
            }

            {!selectedImage?(
                <button type={'button'}   className='bg-[#1E9FF2] min-h-[50px] rounded-full flex items-center justify-center'>
                    <input type="file" id="show_image" className="d-none" onChange={handleImageChange} accept={'image/*'} />
                    <label role={'button'} htmlFor="show_image" className='p-2 text-[#FFFFFF] text-base text-center font-normal'>Chọn ảnh</label>
                </button>
                ):(

                <div className="relative bg-transparent p-2">
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
                                className="w-[100%] h-[100%] rounded-full mx-auto object-cover circular-image"
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
