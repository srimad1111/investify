import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useTradeStore } from '../../store/tradeStore';
import { useMarketStore } from '../../store/marketStore';

export function Navbar() {
  const { user, signOut } = useAuthStore();
  const portfolio = useTradeStore(state => state.portfolio);
  const marketStatus = useMarketStore(state => state.marketStatus);
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 w-full z-50 border-b border-surface-variant bg-background/80 backdrop-blur-md flex justify-between items-center px-8 py-3">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-xl font-black text-white flex items-center gap-2">
          <img src="/logo.png" alt="Investify Logo" className="h-8 w-8 object-contain rounded-md" />
          <span className="font-headline-md tracking-tight uppercase">Investify</span>
        </Link>
        
        {user && (
          <nav className="hidden md:flex items-center gap-6 font-sans font-medium tracking-tight text-sm mt-2">
            <NavLink 
              to="/" 
              className={({ isActive }) => `pb-2 transition-colors ${isActive ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-white'}`}
            >
              Markets
            </NavLink>
            <NavLink 
              to="/portfolio" 
              className={({ isActive }) => `pb-2 transition-colors ${isActive ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-white'}`}
            >
              Portfolio
            </NavLink>
            <NavLink 
              to="/orders" 
              className={({ isActive }) => `pb-2 transition-colors ${isActive ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-white'}`}
            >
              Orders
            </NavLink>
            <NavLink 
              to="/ai-chat" 
              className={({ isActive }) => `pb-2 transition-colors ${isActive ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-white'}`}
            >
              AI Assist
            </NavLink>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 text-xs mr-4">
          <span className="material-symbols-outlined text-sm text-outline">schedule</span>
          <span className={
            marketStatus?.status === 'OPEN' ? 'text-green-400 font-bold' :
            marketStatus?.status === 'PRE_OPEN' ? 'text-yellow-500 font-bold' :
            'text-error font-bold'
          }>
            {marketStatus?.message || 'Market Status'}
          </span>
        </div>

        {user ? (
          <>
            <button className="material-symbols-outlined text-outline hover:text-white transition-colors" title="Notifications">notifications</button>
            <button onClick={handleSignOut} className="material-symbols-outlined text-outline hover:text-error transition-colors" title="Logout">logout</button>
            <div className="hidden sm:flex flex-col items-end ml-4 mr-2 border-l border-surface-variant pl-4">
              <span className="text-[10px] font-label-caps text-outline uppercase tracking-wider">Avail. Margin</span>
              <span className="text-sm font-data-mono font-bold text-white">₹{portfolio?.available_margin?.toLocaleString('en-IN') || '10,00,000'}</span>
            </div>
            <Link to="/" className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded font-bold text-sm hover:brightness-110 active:scale-95 transition-all">
              Trade
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-on-surface-variant hover:text-white transition-colors">Log In</Link>
            <Link to="/signup" className="text-sm font-medium bg-primary-container hover:brightness-110 text-white px-4 py-1.5 rounded transition-colors">Sign Up</Link>
          </div>
        )}
      </div>
    </header>
  );
}
