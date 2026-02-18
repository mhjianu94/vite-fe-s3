import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, Link } from "react-router-dom"
import { loginSchema, type LoginInput } from "@/lib/validation/schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useSetAtom } from "jotai"
import { userAtom } from "@/lib/store/auth"

export default function Login() {
    const navigate = useNavigate()
    const setUser = useSetAtom(userAtom)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginInput) => {
        try {
            // TODO: Replace with actual Cognito authentication
            // const response = await signIn(data.email, data.password)

            // For now, simulate authentication
            console.log("Login attempt:", data)

            // Set user in state (replace with actual user data from Cognito)
            setUser({
                id: "1",
                email: data.email,
                name: data.email.split("@")[0],
            })

            // Redirect to home page
            navigate("/")
        } catch (error) {
            console.error("Login error:", error)
            // TODO: Show error message to user
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Welcome back
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to sign in to your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                {...register("email")}
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                {...register("password")}
                                className={errors.password ? "border-red-500" : ""}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </Button>
                        <div className="text-sm text-center text-gray-600 dark:text-gray-400">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-blue-600 hover:underline dark:text-blue-400"
                            >
                                Sign up
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

