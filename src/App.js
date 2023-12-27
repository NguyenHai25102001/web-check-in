import React, { Suspense } from "react";
import './App.css';
import './css/tailwind.css';
import './css/icons.css';
import './css/app.css';
import  './css/bootstrap.min.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ModalRequestPhone from "./page/modalRequestPhone";
import {
    createBrowserRouter,
    RouterProvider,

    Link,
} from "react-router-dom";
import Home from "./page/home";
import ShowImage from "./page/showImage";
import { AuthProvider} from "./context/app.context";
const loading = (
    <div className="pt-3 text-center">
        <div className="sk-spinner sk-spinner-pulse">Loading.....</div>
    </div>
);
function App() {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <ModalRequestPhone />,
        },
        {
            path: "/home",
            element: <Home />,
        },
        {
            path: "/show-image",
            element: <ShowImage />,
        },
    ]);
    return (
        <div className="main-home">
            <Suspense fallback={loading}>
                <AuthProvider>

                        <RouterProvider router={router} />


                </AuthProvider>

            </Suspense>
        </div>
    );
}

export default App;
