import { Route,   } from "react-router-dom";
import Login from "../components/Login";
import { ProtectedRoute } from "../components/ProtectedRoute";
import UrlShortenerHome from "../components/Home";
import SignUP from "../components/SignUp";
 


const UserRoutes = () => (
    <>
      <Route>
        <Route path="/signup" element={<SignUP/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={
        <ProtectedRoute>
           <UrlShortenerHome/>
        </ProtectedRoute>
    } />
      </Route>
    </>
  );

export default UserRoutes;