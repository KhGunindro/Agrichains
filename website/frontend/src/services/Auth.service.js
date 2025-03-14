import Cookie from 'js-cookie'

class Authentication {
    async signup(username, email, password, confirmPassword) {
        try {
            if (!username || typeof username !== "string") throw new Error("Username is required!");
            if (!email || typeof email !== "string") throw new Error("Email is required!");
            if (!password || typeof password !== "string") throw new Error("Password is required!");

            // compare the password and the confirmPassword
            if (password !== confirmPassword) {
                throw new Error("Passwords do not match!");
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/account/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
                credentails: 'include'
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

    async login(email, password) {
        try {
            if (!email || typeof email !== 'string') throw new Error("Email is required!");
            if (!password || typeof password !== 'string') throw new Error("Password is required!");
            console.log(`Email: ${email}, Password: ${password}`); // debugging

            const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/account/signIn`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const data = await response.json();
            Cookie.set("token", data.token); // set the token

            return { data: data.message, success: true };
        } catch (error) {
            console.log(error);
            return { message: error.message, success: false }
        }
    }

    // add later
    async logout() {
        try {
            const response = await fetch();
        } catch (error) {
            console.log(error);
            return { message: error.message, success: false }
        }
    }
}

const authentication = new Authentication();
export default authentication;
