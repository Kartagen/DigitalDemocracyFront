import Header from "@/components/header/Header";

export default function Home() {
    return (
        <main className="flex bg-slate-700 min-h-screen flex-col items-center">
            <Header activeTab={"home"} />

            <section className="flex flex-col text-2xl items-center mt-10">
                <h1 className="text-4xl font-bold mb-6">Welcome to Digital Democracy</h1>
                <p className="text-2xl text-center">
                    Empowering citizens through secure and transparent online voting. Make your voice heard in a few simple steps.
                </p>
            </section>

            <section className="flex text-2xl  flex-col items-center mt-10">
                <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                <div className="flex flex-col justify-around items-center">
                    <div className="w-full md:w-1/3 p-4">
                        <h3 className="text-3xl font-bold mb-2">1. Register</h3>
                        <p>Create an account to get started. Verify your identity to ensure a secure voting experience.</p>
                    </div>
                    <div className="w-full md:w-1/3 p-4">
                        <h3 className="text-3xl font-bold mb-2">2. Explore Elections</h3>
                        <p>Browse through upcoming elections, learn about candidates, and stay informed about the voting process.</p>
                    </div>
                    <div className="w-full md:w-1/3 p-4">
                        <h3 className="text-3xl font-bold mb-2">3. Cast Your Vote</h3>
                        <p>Participate in elections by casting your vote securely online. Your vote is confidential and counts towards shaping the future.</p>
                    </div>
                </div>
            </section>
        </main>
    )
}
