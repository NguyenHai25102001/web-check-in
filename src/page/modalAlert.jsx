import React, { useState, forwardRef, useImperativeHandle } from "react";

const ModalAlert = forwardRef((props, ref) => {
    const [showModal, setShowModal] = useState(false);
    useImperativeHandle(ref, () => {
        return {
            setShowModal,
        };
    });

    const { messageShow } = props;
    if (!showModal) return <></>;

    return (
        <div className="flex items-center w-full h-full bg-[#000000] bg-opacity-80 absolute top-0 left-0 z-50">
            <div className="w-[70%] m-auto bg-white rounded-lg">
                <div className="flex items-center border-b-4 pb-2 pt-2 border-b-slate-100">
                    <div className="flex-1 items-center justify-center">
                        <p className="text-base text-blue-600 uppercase text-center">
                            Thông báo
                        </p>
                    </div>
                </div>
                <div className="py-4">
                    <p className="text-base text-[#504da4] text-center">
                        {messageShow}
                    </p>
                </div>
                <button
                    className="w-[70%] mx-auto py-1 flex items-center justify-center border-2 border-[#01B2FF] bg-blue mt-4 mb-6 rounded-md"
                    onClick={() => {
                        setShowModal(false);
                    }}
                >
                    <p className="text-base text-blue-500 font-light">Đóng</p>
                </button>
            </div>
        </div>
    );
});

export default ModalAlert;
