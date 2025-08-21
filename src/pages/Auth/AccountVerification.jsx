import React, { useEffect, useState } from 'react';
import { useSearchParams , Navigate } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis'
function AccountVerification() {
    let [ searchParams] = useSearchParams()
    // const email = searchParams.get('email')
    // const token = searchParams.get('token')
    const {email,token} = Object.fromEntries([...searchParams])
    // console.log(email,token);
    
    //tạo biến state để biết được là đã verify tài khoản hay chưa
    const [verified ,setVerified] = useState(false)

    //Goij APi để verify tài khoản
    useEffect( () => {
        if(email && token) {
            verifyUserAPI({email, token}).then( ()=> setVerified(true) )
        }
    }, [email, token])

    //nếu url có vấn đề ,không tồn tại 1 trong 2 gia strij email hoặc token thì sang trang 404
    if (!email || !token) {
        return <Navigate to ="/404" />
    }

    //nếu chưa verify xong thì hiện loading
    if(!verified) {
        return <PageLoadingSpinner caption = "Verifying your Account ..." />
    }
    //Cuối cùng không gặp vấn đề gì + verityfi thành công thì điều hướng về trang login cùng giá trị verifiedEmail

    return (
        <Navigate to={`/login?verifiedEmail=${email}`} />
    );
}

export default AccountVerification;