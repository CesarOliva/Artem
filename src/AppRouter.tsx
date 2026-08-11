import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home/Home";
import Artwork from "./pages/Artwork/Artwork";
import NotFound from "./pages/NotFound/NotFound";
import Menu from "./components/Menu";

function Layout() {
    return (
        <>
            <Menu />
            <Outlet />
        </>
    );
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout/>}>
                    <Route path="/" element={<Home />} />
                    <Route path="/artwork" element={<></>} />
                    <Route path="/artwork/:id" element={<Artwork />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}