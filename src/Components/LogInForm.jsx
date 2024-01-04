import { useForm, Controller } from "react-hook-form";
import { Button, TextField } from "@mui/material/";
import SendIcon from "@mui/icons-material/Send";
import { auth } from "./FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export default function LogInForm({ isLoggedIn, email, uid }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const signUp = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log(userCredential);
    } catch (error) {
      console.log(error.message);
    }
  };

  const logIn = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log(userCredential);
    } catch (error) {
      console.log(error.message);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <form>
        {isLoggedIn ? null : (
          <>
            <div>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{ required: "Email is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    variant="filled"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email && errors.email.message}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Password"
                    variant="filled"
                    type="password"
                    error={!!errors.password}
                    helperText={errors.password && errors.password.message}
                  />
                )}
              />
            </div>
          </>
        )}
        <p>
          {isLoggedIn ? (
            <>
              <Button
                onClick={logOut}
                type="submit"
                variant="contained"
                endIcon={<SendIcon />}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleSubmit(logIn)}
                type="submit"
                variant="contained"
                endIcon={<SendIcon />}>
                Log In
              </Button>{" "}
              <Button
                onClick={handleSubmit(signUp)}
                type="submit"
                variant="contained"
                endIcon={<SendIcon />}>
                Sign Up
              </Button>
            </>
          )}
        </p>
      </form>
      {email && <p>Welcome! {email}</p>}
      {uid && <p>Your UID: {uid}</p>}
    </>
  );
}
