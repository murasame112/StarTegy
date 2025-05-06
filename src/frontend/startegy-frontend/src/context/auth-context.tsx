import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type UserAuth = {
	id: string;
	login: string;
};


type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
	user: UserAuth | null,
	setUser: (user: UserAuth | null) => void;
  logout: () => void;
	loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
	user: null,
	setUser: () => {},
  logout: () => {},
	loading: true
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState<UserAuth | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:4200/check-auth', {
      credentials: 'include',
    })
      .then((res) => {
				setIsLoggedIn(res.ok);
				if(res.ok){
					return fetch('http://localhost:4200/me', {credentials: 'include'});
				}else{
					return null;
				}
				
			})    
			.then((res) => res?.json())
			.then((data) => {
				if (data) setUser(data); 
			})
      .catch(() =>{ 
				setIsLoggedIn(false);
				setUser(null);
			})
			.finally(() => {
				setLoading(false);
			}

			);
  }, []);

  const logout = () => {
    fetch('http://localhost:4200/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(() => {
      setIsLoggedIn(false);
    });
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
