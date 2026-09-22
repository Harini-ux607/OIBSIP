/* =========================
   SHA-256 PASSWORD HASH
========================= */

async function hashPassword(password) {

    const encoder = new TextEncoder();

    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        data
    );

    const hashArray = Array.from(
        new Uint8Array(hashBuffer)
    );

    const hashHex = hashArray
        .map(function (byte) {
            return byte.toString(16).padStart(2, "0");
        })
        .join("");

    return hashHex;
}


/* =========================
   REGISTER
========================= */

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const username =
                document
                    .getElementById("registerUsername")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            const message =
                document.getElementById("registerMessage");


            /* Empty validation */

            if (username === "" || password === "") {

                message.textContent =
                    "Please fill in all fields.";

                message.className =
                    "message error";

                return;
            }


            /* Password length */

            if (password.length < 8) {

                message.textContent =
                    "Password must be at least 8 characters.";

                message.className =
                    "message error";

                return;
            }


            /* Password number */

            const hasNumber =
                /[0-9]/.test(password);


            if (!hasNumber) {

                message.textContent =
                    "Password must contain at least one number.";

                message.className =
                    "message error";

                return;
            }


            /* Get existing users */

            const users =
                JSON.parse(
                    localStorage.getItem("users")
                ) || [];


            /* Duplicate check */

            const existingUser =
                users.find(function (user) {

                    return user.username.toLowerCase()
                        === username.toLowerCase();

                });


            if (existingUser) {

                message.textContent =
                    "Username or email already exists.";

                message.className =
                    "message error";

                return;
            }


            /* Hash password */

            const hashedPassword =
                await hashPassword(password);


            /* Create user */

            const newUser = {

                username: username,

                password: hashedPassword

            };


            users.push(newUser);


            /* Save user */

            localStorage.setItem(
                "users",
                JSON.stringify(users)
            );


            message.textContent =
                "Registration successful! Redirecting to login...";

            message.className =
                "message success";


            /* Redirect */

            setTimeout(function () {

                window.location.href =
                    "login.html";

            }, 1500);

        }
    );

}


/* =========================
   LOGIN
========================= */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const username =
                document
                    .getElementById("loginUsername")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const message =
                document.getElementById("loginMessage");


            /* Empty validation */

            if (username === "" || password === "") {

                message.textContent =
                    "Please fill in all fields.";

                message.className =
                    "message error";

                return;
            }


            /* Get users */

            const users =
                JSON.parse(
                    localStorage.getItem("users")
                ) || [];


            /* Hash entered password */

            const hashedPassword =
                await hashPassword(password);


            /* Find user */

            const user =
                users.find(function (user) {

                    return (
                        user.username.toLowerCase()
                        === username.toLowerCase()
                        &&
                        user.password
                        === hashedPassword
                    );

                });


            /* Incorrect credentials */

            if (!user) {

                message.textContent =
                    "Invalid username/email or password.";

                message.className =
                    "message error";

                return;
            }


            /* Create login session */

            localStorage.setItem(
                "loggedInUser",
                user.username
            );


            /* Redirect dashboard */

            window.location.href =
                "dashboard.html";

        }
    );

}


/* =========================
   PROTECTED DASHBOARD
========================= */

if (
    window.location.pathname.endsWith(
        "dashboard.html"
    )
) {

    const loggedInUser =
        localStorage.getItem(
            "loggedInUser"
        );


    /* No session */

    if (!loggedInUser) {

        window.location.href =
            "login.html";

    } else {

        const welcomeUser =
            document.getElementById(
                "welcomeUser"
            );

        if (welcomeUser) {

            welcomeUser.textContent =
                "Hello, " + loggedInUser + "!";

        }

    }

}


/* =========================
   LOGOUT
========================= */

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            /* Clear login session */

            localStorage.removeItem(
                "loggedInUser"
            );


            /* Redirect */

            window.location.href =
                "login.html";

        }
    );

}