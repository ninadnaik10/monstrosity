import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

import { AxiosError } from "axios"
import {
  type Body_login_login_access_token as AccessToken,
  type ApiError,
  DriversService,
  LoginService,
  type UserPublic,
  type UserRegister,
  UsersService,
} from "../client"
import useCustomToast from "./useCustomToast"

const isLoggedIn = () => {
  return localStorage.getItem("access_token") !== null
}
const isDriver = () => {
  return localStorage.getItem("user_type") === "driver"
}

const useAuth = () => {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const showToast = useCustomToast()
  const queryClient = useQueryClient()
  const { data: user, isLoading } = useQuery<UserPublic | null, Error>({
    queryKey: ["currentUser"],
    queryFn: UsersService.readUserMe,
    enabled: isLoggedIn(),
  })

  const signUpMutation = useMutation({
    mutationFn: (data: UserRegister) =>
      UsersService.registerUser({ requestBody: data }),

    onSuccess: () => {
      navigate({ to: "/login" })
      showToast(
        "Account created.",
        "Your account has been created successfully.",
        "success",
      )
    },
    onError: (err: ApiError) => {
      let errDetail = (err.body as any)?.detail

      if (err instanceof AxiosError) {
        errDetail = err.message
      }

      showToast("Something went wrong.", errDetail, "error")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  const login = async (data: AccessToken) => {
    let response;
    console.log(data)
    if (data.userType === "user") {

      response = await LoginService.loginAccessToken({
        formData: data,
      })
      localStorage.setItem("user_type", "user")
    }
    else {
      response = await DriversService.loginAccessToken({
        formData: data,
      })
      localStorage.setItem("user_type", "driver")

    }
    localStorage.setItem("access_token", response.access_token)
  }

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate({ to: "/" })
    },
    onError: (err: ApiError) => {
      let errDetail = (err.body as any)?.detail

      if (err instanceof AxiosError) {
        errDetail = err.message
      }

      if (Array.isArray(errDetail)) {
        errDetail = "Something went wrong"
      }

      setError(errDetail)
    },
  })

  // const loginMutation = useMutation({
  //   mutationFn: async ({ username, password, userType }: { username: string; password: string; userType: 'user' | 'driver' }) => {
  //     const service = userType === 'user' ? UsersService : DriversService;
  //     return await service.loginAccessToken({ username, password });
  //   },
  //   onSuccess: (data) => {
  //     localStorage.setItem('token', data.access_token);
  //     queryClient.invalidateQueries({ queryKey: ["currentUser"] });
  //     navigate({ to: "/" });
  //     showToast("Logged in successfully", "Welcome back!", "success");
  //   },
  //   onError: (err: ApiError) => {
  //     let errDetail = (err.body as any)?.detail;
  //     if (err instanceof AxiosError) {
  //       errDetail = err.message;
  //     }
  //     setError(errDetail || "An error occurred during login");
  //     showToast("Login failed", errDetail || "An error occurred during login", "error");
  //   },
  // });

  const logout = () => {
    localStorage.removeItem("access_token")
    navigate({ to: "/login" })
  }

  return {
    signUpMutation,
    loginMutation,
    logout,
    user,
    isLoading,
    error,
    resetError: () => setError(null),
  }
}

export { isLoggedIn, isDriver }
export default useAuth
