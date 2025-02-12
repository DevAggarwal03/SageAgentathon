import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link, NavLink } from "react-router-dom";


const Navbar = () => {
    return (
        <div className="bg-none">
            <nav className="border-b border-white bg-none p-4 flex justify-between items-center">
                <Link to="/" className="text-white text-3xl font-bold">DEX</Link>
                <div className="flex gap-x-4 text-white text-xl">
                    <NavLink to="/swap" className={({ isActive }) => isActive ? "text-blue-500" : ""}><span>Swap</span></NavLink>
                    <NavLink to="/pools" className={({ isActive }) => isActive ? "text-blue-500" : ""}><span>Pool</span></NavLink>
                    <NavLink to="/tokens" className={({ isActive }) => isActive ? "text-blue-500" : ""}><span>Tokens</span></NavLink>
                    <NavLink to="/chat" className={({ isActive }) => isActive ? "text-blue-500" : ""}><span>Chat</span></NavLink>
                </div>
                <div className="space-x-4">
                    <ConnectButton
                        chainStatus="icon"
                        showBalance={true}
                        accountStatus="address"
                    />
                </div>
            </nav>
        </div>
    );
}

export default Navbar
