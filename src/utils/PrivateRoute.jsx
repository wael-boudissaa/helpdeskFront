import { Navigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({children, ...rest}) => {
    const {user} = useContext(AuthContext)

    return !user ? <Navigate to='/auth/sign-in' replace/> : children;
}

export default PrivateRoute;