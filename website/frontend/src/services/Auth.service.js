import Cookie from 'js-cookie'

class Authentication {
    async signup(username, email, password, confirmPassword) {
        console.log("Sign up method is processing!"); // checking...
        
        try {
            if (!username || typeof username !== "string") throw new Error("Username is required!");
            if (!email || typeof email !== "string") throw new Error("Email is required!");
            if (!password || typeof password !== "string") throw new Error("Password is required!");

            // compare the password and the confirmPassword
            if (password !== confirmPassword) {
                throw new Error("Passwords do not match!");
            }

            console.log("Env-->", import.meta.env.VITE_BACKEND_API);
            

            const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/account/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const data = await response.json();

            Cookie.set("verificationToken", data.verificationToken); // clear the cookie right after the otp is verified

            return { data: data.message, success: true };
        } catch (error) {
            console.log("error->", error);
            return { message: error.message, success: false };
        }
    }

    async login() {
        try {

        } catch (error) {

        }
    }

    async logout() {
        try {

        } catch (error) {

        }
    }
}

const authentication = new Authentication();
export default authentication;