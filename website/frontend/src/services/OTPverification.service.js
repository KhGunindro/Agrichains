import Cookie from 'js-cookie'

const OTPverification = async (otp, accountCredentails) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/account/signup/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ otp, accountCredentails })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        const data = await response.json();

        // set the token in cookie
        Cookie.set("token", data.token); // clear the cookie only when the user logs out or when the token expires

        return { data: response.message, success: true };
    } catch (error) {
        console.log(error);
        return { message: error.message, success: false };
    }
}

export default OTPverification; 