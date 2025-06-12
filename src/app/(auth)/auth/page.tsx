import { AuthForm } from '@/components/forms/AuthForm'

const page = () => {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <main className="max-w-[600px] h-max">
                <h1>Login</h1>

                <AuthForm />
            </main>
        </div>
    )
}

export default page
