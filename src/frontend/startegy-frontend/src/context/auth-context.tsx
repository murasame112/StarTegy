import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type UserAuth = {
	id: string;
	login: string;
};


type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
	userAuth: UserAuth | null,
	setUserAuth: (user: UserAuth | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
	userAuth: null,
	setUserAuth: () => {},
  logout: () => {}
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userAuth, setUserAuth] = useState<UserAuth | null>(null);

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
				if (data) setUserAuth(data); 
			})
      .catch(() =>{ 
				setIsLoggedIn(false);
				setUserAuth(null);
			});
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
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userAuth, setUserAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
