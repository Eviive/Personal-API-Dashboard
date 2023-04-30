import { UserService } from "api/services";
import { AxiosError } from "axios";
import { Button, Input } from "components/common";
import { useAuthContext } from "contexts/AuthContext";
import { FC, FormEventHandler, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthRequest } from "types/forms";

import styles from "./login.module.scss";

export const Login: FC = () => {

    const { accessToken, setAccessToken } = useAuthContext();

    const [ isSubmitting, setIsSubmitting ] = useState(false);

    const navigate = useNavigate();

    const { register, handleSubmit } = useForm<AuthRequest>();

    useEffect(() => {
        if (accessToken) {
            navigate("/", { replace: true });
        }
    }, [ accessToken, navigate ]);

    const handleInvalid: FormEventHandler<HTMLInputElement> = e => {
        e.preventDefault(); // prevents the default popup from showing
        console.log("Invalid input");
        // showPopup({
        //     title: "Invalid input",
        //     message: "Please fill in all the fields."
        // });
    };

    const submitHandler: SubmitHandler<AuthRequest> = async data => {
        if (isSubmitting) {
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await UserService.login(data);
            if (res.roles.includes("ROLE_ADMIN")) {
                setAccessToken(res.accessToken);
                navigate("/", { replace: true });
            } else {
                console.log("Insufficient permissions");
                // showPopup({
                //     title: "Insufficient permissions",
                //     message: "You must be an administrator to access the dashboard."
                // });
                setIsSubmitting(false);
            }
        } catch (e) {
            console.log(e);
            if (e instanceof AxiosError) {
                console.log(e.response?.data);
                // showPopup({
                //     title: e.response?.data?.error ?? e.name,
                //     message: e.response?.data?.message ?? e.message
                // });
            } else {
                console.log("Unknown error", e);
                // showPopup({
                //     title: "Unknown error",
                //     message: "Please try again later."
                // });
            }
            setIsSubmitting(false);
        }
    };

    return (
        <form
            className={styles.loginForm}
            onSubmit={handleSubmit(submitHandler)}
        >
            <Input
                attributes={{
                    ...register("username", { required: true }),
                    className: styles.inputWrapper,
                    autoComplete: "username"
                }}
                label={<FaUser size={14} />}
                handleInvalid={handleInvalid}
            />
            <Input
                attributes={{
                    ...register("password", { required: true }),
                    className: styles.inputWrapper,
                    type: "password",
                    autoComplete: "current-password"
                }}
                label={<FaLock size={14} />}
                handleInvalid={handleInvalid}
            />
            <Button loading={isSubmitting}>Sign In</Button>
        </form>
    );
};
