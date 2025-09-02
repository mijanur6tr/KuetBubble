import Navbar from "@/components/navbar";

interface RootLayoutType {
    children: React.ReactNode
} 

export default async function RootLayout({children}:RootLayoutType){
    return(
        <div className="flex flex-col min-h-screen">
            <Navbar/>
            {children}
        </div>
    )
}